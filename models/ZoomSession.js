const mongoose = require("mongoose");

const zoomSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    topic: {
      type: String,
      required: true,
    },
    zoomMeetingId: {
      type: String,
      required: true,
    },
    joinUrl: {
      type: String,
      required: true,
    },
    startUrl: {
      type: String,
    },
    password: {
      type: String,
    },
    duration: {
      type: Number,
      default: 30,
    },
    startTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "active", "ended"],
      default: "scheduled",
    },
    provider: {
      type: String,
      default: "zoom",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ZoomSession", zoomSessionSchema);
