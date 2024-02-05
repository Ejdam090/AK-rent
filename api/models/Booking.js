const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  stuff: { type: mongoose.Schema.Types.ObjectId, require: true, ref:'Stuff' },
  user: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'User'},
  checkIn: { type: Date, require: true },
  checkOut: { type: Date, require: true },
  name: { type: String, require: true },
  mobile: { type: String, require: true },
  price: Number,
});
const BookingModel = mongoose.model("Booking", bookingSchema);
module.exports = BookingModel;
