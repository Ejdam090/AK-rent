const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const jwt = require("jsonwebtoken");
const CookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const multer = require("multer");
const Stuff = require("./models/Stuffs.js");
const Booking = require("./models/Booking.js");
const mime = require("mime-types");

require("dotenv").config();
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";
const bucket = "ejdam-rentstuff";
app.use(express.json());
app.use(CookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    origin: ["http://127.0.0.1:5173"],
    credentials: true,
  })
);

// mongodb://localhost:27017

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "eu-north-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + "." + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}
function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

/// endpoints
app.get("/api/test", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json("test ok");
});
//pass mongo db nRl7uh0MfB9mrD7c login booking
//register endpoint
app.post("/api/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;
  /// check if username already exist
  const usernameCheck = await User.findOne({ name });
  if (usernameCheck)
    return res.json({
      msg: "Ta nazwa użytkownika już istnieje!",
      status: false,
    });

  const emailCheck = await User.findOne({ email });
  if (emailCheck) {
    return res.json({ msg: "Ten email jest już zajęty!", status: false });
  }
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json({ userDoc, status: true });
  } catch (e) {
    res.status(422).json(e);
  }
});
//login endpoint
app.post("/api/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { email: userDoc.email, id: userDoc._id, name: userDoc.name },
        jwtSecret,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({ userDoc, status: true });
        }
      );
    } else {
      res.json({ msg: "Błędne hasło!", status: false });
    }
  } else {
    res.json({ msg: "błędny adres email!", status: false });
  }
});
///profile endpoint

app.get("/api/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id, isAdmin } = await User.findById(userData.id);
      res.json({ name, email, _id, isAdmin });
    });
  } else {
    res.json(null);
  }
});

//endpoint logout

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//endpoint upload photos

app.post("/api/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: `/tmp/` + newName,
  });
  const url = await uploadToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup("/tmp/" + newName)
  );
  res.status(200).json(url);
});

//endpoint upload photo from file
const photosMiddleware = multer({ dest: "/tmp/" });

app.post(
  "/api/upload",
  photosMiddleware.array("photos", 100),
  async (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname, mimetype } = req.files[i];
      const url = await uploadToS3(path, originalname, mimetype);
      uploadedFiles.push(url);
    }
    res.status(200).json(uploadedFiles);
  }
);
/// endpoint add new stuffs

app.post("/api/add-new-stuff", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const { title, dayCost, addedPhotos, description, perks, checkIn, checkOut } =
    req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Stuff.create({
      owner: userData.id,
      title,
      dayCost,
      photos: addedPhotos,
      description,
      perks,
      checkIn,
      checkOut,
    });
    res.json(placeDoc);
  });
});
app.get("/api/remove-stuff/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const { id } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    await Stuff.deleteOne(id);
    res.json("deleted");
  });
});

app.put("/api/add-new-stuff", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    dayCost,
    addedPhotos,
    description,
    perks,
    checkIn,
    checkOut,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Stuff.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        dayCost,
        photos: addedPhotos,
        description,
        perks,
        checkIn,
        checkOut,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

/// endpoint fetching stuffs

app.get("/api/user-stuffs", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Stuff.find({ owner: id }));
  });
});

app.get("/api/stuffs/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Stuff.findById(id));
});

app.get("/api/stuffs", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Stuff.find());
});

app.post("/api/booking", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const { stuff, checkIn, checkOut, name, mobile, price } = req.body;
  const bookingModel = await Booking.create({
    stuff,
    checkIn,
    checkOut,
    name,
    mobile,
    price,
    user: userData.id,
  });
  res.json(bookingModel);
});

app.get("/api/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("stuff"));
});

app.get("/api/bookings-admin", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Booking.find().populate("stuff").populate("user"));
});

app.listen(4000);
