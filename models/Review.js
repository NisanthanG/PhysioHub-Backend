const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: true,
    },
    physioName: {
      type: String,
      default: "Physio Hub Lanka",
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
