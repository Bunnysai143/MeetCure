const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: 
    {
      type: Date,
      required: true,
    },
    time: 
    {
      type: String,
      required: true,
    },
    status: 
    {
      type: String,
      enum: ["Upcoming","Completed", "Cancelled"],
      default: "Upcoming",
    },
    reason: 
    {
      type: String,
      default: "",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
