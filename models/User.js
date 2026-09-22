const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "physio", "admin"],
      default: "patient",
    },

    phoneNumber: String,
    address: String,

    verificationStatus: {
      type: String,
      enum: ["pending_submission", "submitted", "verified", "rejected"],
      default: "pending_submission",
    },

    verificationDocuments: [
      {
        documentType: String,
        fileName: String,
        data: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);