const Physio = require("../models/Physio");
const User = require("../models/User");

const fallbackPhysios = [
  {
    _id: "seed-home-1",
    specialization: "Orthopedic & Geriatric Care",
    consultationFee: 2500,
    rating: 4.9,
    verified: true,
    name: "Dr. Nirmala Silva",
    availability: "Available today",
    category: "home",
    bio: "Specialist in geriatric mobility and post-op rehabilitation.",
    location: {
      type: "Point",
      coordinates: [79.8612, 6.9271],
    },
  },
  {
    _id: "seed-home-2",
    specialization: "Neurological Rehabilitation",
    consultationFee: 3000,
    rating: 4.8,
    verified: true,
    name: "Dr. Ruwan Jayasuriya",
    availability: "Available this evening",
    category: "premium",
    bio: "Focused on stroke recovery and neurological mobility programmes.",
    location: {
      type: "Point",
      coordinates: [79.8745, 6.9334],
    },
  },
  {
    _id: "seed-premium-1",
    specialization: "Sports & Orthopedic Physio",
    consultationFee: 2800,
    rating: 5.0,
    verified: true,
    name: "Dr. Samira Rajapaksa",
    availability: "Next slot tomorrow",
    category: "online",
    bio: "Online consultation specialist for sports injuries and return-to-play plans.",
    location: {
      type: "Point",
      coordinates: [79.858, 6.921],
    },
  },
];

exports.getNearbyPhysios = async (longitude, latitude) => {
  const lng = Number(longitude);
  const lat = Number(latitude);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return fallbackPhysios;
  }

  const physios = await Physio.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        $maxDistance: 10000,
      },
    },
  }).lean();

  return physios.length > 0 ? physios : fallbackPhysios;
};

exports.submitPhysioVerification = async ({ userId, verificationData }) => {
  const user = await User.findById(userId);

  if (!user || user.role !== "physio") {
    throw new Error("Physio account required");
  }

  const documents = [];
  if (verificationData.medicalIdentity) {
    documents.push({
      documentType: "medical_identity",
      fileName: verificationData.medicalIdentityFileName || "medical-identity",
      data: verificationData.medicalIdentity,
    });
  }

  if (verificationData.clinicRegistrationDocument) {
    documents.push({
      documentType: "clinic_registration",
      fileName: verificationData.clinicRegistrationFileName || "clinic-registration",
      data: verificationData.clinicRegistrationDocument,
    });
  }

  const profileUpdates = {
    name: user.fullName,
    specialization: verificationData.specialization || "General Physiotherapy",
    experience: Number(verificationData.experience) || 2,
    consultationFee: Number(verificationData.consultationFee) || 2500,
    homeVisitRadius: Number(verificationData.homeVisitRadius) || 10,
    licenseNumber: verificationData.licenseNumber || "",
    clinicRegistrationNumber: verificationData.clinicRegistrationNumber || "",
    availability: verificationData.availability || "Available today",
    category: verificationData.category || "online",
    bio: verificationData.bio || "Verified physiotherapist on the PNSL platform",
    onlineConsultationEnabled: true,
    homeVisitEnabled: true,
    verificationDocuments: documents,
    verified: false,
  };

  if (verificationData.location && verificationData.location.coordinates) {
    profileUpdates.location = {
      type: "Point",
      coordinates: verificationData.location.coordinates,
    };
  }

  const physioProfile = await Physio.findOneAndUpdate(
    { user: userId },
    { $set: profileUpdates },
    { new: true, upsert: true }
  );

  await User.findByIdAndUpdate(userId, {
    $set: {
      verificationStatus: "submitted",
      verificationDocuments: documents,
    },
  });

  return { user, physioProfile };
};
