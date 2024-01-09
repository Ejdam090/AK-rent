const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
const jwt = require("jsonwebtoken");
const CookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const Stuff = require("./models/Stuffs.js");
const Booking = require("./models/Booking.js");

require("dotenv").config();
const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";
app.use(express.json());
app.use(CookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: ["https://ak-rentstuffs.onrender.com", "https://659dbd1389a086609bd9aa91--whimsical-sawine-e7f083.netlify.app/"],
  })
);
mongoose.connect(process.env.MONGO_URL);
// mongodb://localhost:27017

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

/// endpoints
app.get("/test", (req, res) => {
  res.json("test ok");
});
//pass mongo db nRl7uh0MfB9mrD7c login booking
//register endpoint
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
});
//login endpoint
app.post("/login", async (req, res) => {
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
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.json("pass not ok");
    }
  } else {
    res.json("not found");
  }
});
///profile endpoint

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

//endpoint logout

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

//endpoint upload photos

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

//endpoint upload photo from file
const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});
/// endpoint add new stuffs

app.post("/add-new-stuff", (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    dayCost,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
  } = req.body;

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Stuff.create({
      owner: userData.id,
      title,
      dayCost,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
    });
    res.json(placeDoc);
  });
});

app.put("/add-new-stuff", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    dayCost,
    addedPhotos,
    description,
    perks,
    extraInfo,
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
        extraInfo,
        checkIn,
        checkOut,
      });
      await placeDoc.save();
      res.json("ok");
    }
  });
});

/// endpoint fetching stuffs

app.get("/user-stuffs", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData;
    res.json(await Stuff.find({ owner: id }));
  });
});

app.get("/stuffs/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Stuff.findById(id));
});

app.get("/stuffs", async (req, res) => {
  res.json(await Stuff.find());
});

app.post("/booking", async (req, res) => {
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

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate("stuff"));
});

app.listen(4000);
