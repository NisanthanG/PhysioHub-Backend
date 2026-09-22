const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    physio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Physio",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      default: "",
    },
    treatmentPlan: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "completed", "follow-up"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
