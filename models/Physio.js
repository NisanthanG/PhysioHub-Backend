const mongoose = require("mongoose");

const physioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: String,
    specialization: String,
    experience: Number,
    consultationFee: Number,
    homeVisitRadius: Number,
    licenseNumber: String,
    clinicRegistrationNumber: String,

    verified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    availability: String,

    category: {
      type: String,
      enum: ["home", "premium", "online"],
      default: "home",
    },

    bio: String,
    onlineConsultationEnabled: {
      type: Boolean,
      default: true,
    },
    homeVisitEnabled: {
      type: Boolean,
      default: true,
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

    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number],
    },
  },
  {
    timestamps: true,
  }
);

physioSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Physio", physioSchema);