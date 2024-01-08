const mongoose = require("mongoose");

const stuffsSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  dayCost: Number,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
});
const StuffsModel = mongoose.model("Stuff", stuffsSchema);
module.exports = StuffsModel;
