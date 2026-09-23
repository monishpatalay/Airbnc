import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  place: {type:mongoose.Schema.Types.ObjectId,required:true, ref: "Place"},
  user: {type:mongoose.Schema.Types.ObjectId,required:true, ref: "User"},
  checkIn: {type: Date, required: true},
  checkOut: {type: Date, required: true},
  noOfGuests: {type: Number, required: true},
  name: {type: String, required: true},
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^\+\d{1,3} \d{10}$/.test(value),
      message: "Phone must include a country code and exactly 10 digits",
    },
  },
  price: {type: Number, required: true},
});

const BookingModel = mongoose.model("Booking", BookingSchema);
export default BookingModel;
