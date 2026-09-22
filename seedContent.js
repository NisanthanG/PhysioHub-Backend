const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Physio = require("./models/Physio");
const Review = require("./models/Review");
const MedicalRecord = require("./models/MedicalRecord");

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Physio.deleteMany({});
  await Review.deleteMany({});
  await MedicalRecord.deleteMany({});

  const physios = await Physio.insertMany([
    {
      name: "Dr. Nirmala Silva",
      specialization: "Orthopedic & Geriatric Care",
      experience: 12,
      consultationFee: 2500,
      homeVisitRadius: 10,
      verified: true,
      rating: 4.9,
      availability: "Available today",
      category: "home",
      bio: "Specializes in mobility recovery and geriatric rehabilitation.",
      location: { type: "Point", coordinates: [79.8612, 6.9271] },
    },
    {
      name: "Dr. Ruwan Jayasuriya",
      specialization: "Neurological Rehabilitation",
      experience: 9,
      consultationFee: 3000,
      homeVisitRadius: 12,
      verified: true,
      rating: 4.8,
      availability: "Available this evening",
      category: "home",
      bio: "Focused on stroke recovery and neurological mobility support.",
      location: { type: "Point", coordinates: [79.8745, 6.9334] },
    },
    {
      name: "Dr. Samira Rajapaksa",
      specialization: "Sports & Orthopedic Physio",
      experience: 10,
      consultationFee: 2800,
      homeVisitRadius: 6,
      verified: true,
      rating: 5.0,
      availability: "Next slot tomorrow",
      category: "premium",
      bio: "Premier sports injury and performance recovery specialist.",
      location: { type: "Point", coordinates: [79.858, 6.921] },
    },
    {
      name: "Ms. Anita Jayawardena",
      specialization: "Post-surgery Rehabilitation",
      experience: 8,
      consultationFee: 2200,
      homeVisitRadius: 8,
      verified: true,
      rating: 4.7,
      availability: "Online now",
      category: "online",
      bio: "Supports post-operative recovery through guided remote sessions.",
      location: { type: "Point", coordinates: [79.865, 6.935] },
    },
  ]);

  await Review.insertMany([
    {
      patientName: "Dinesh Pathirana",
      physioName: "Dr. Nirmala Silva",
      rating: 5,
      review: "The home visit experience was smooth and incredibly helpful after my surgery.",
    },
    {
      patientName: "Priya Perumal",
      physioName: "Dr. Samira Rajapaksa",
      rating: 5,
      review: "I regained confidence quickly with a strong recovery plan and expert guidance.",
    },
    {
      patientName: "Ruwini Ilangakoon",
      physioName: "Ms. Anita Jayawardena",
      rating: 5,
      review: "My mother received excellent care and improved mobility through online sessions.",
    },
  ]);

  await MedicalRecord.insertMany([
    {
      patient: new mongoose.Types.ObjectId(),
      physio: physios[0]._id,
      title: "Post-operative knee recovery",
      diagnosis: "Mild mobility restriction after knee surgery",
      treatmentPlan: "Strengthening and mobility exercises with weekly monitoring",
      notes: "Patient reports improving pain levels.",
      status: "active",
    },
    {
      patient: new mongoose.Types.ObjectId(),
      physio: physios[2]._id,
      title: "Sports injury rehabilitation",
      diagnosis: "Ankle strain during training",
      treatmentPlan: "Progressive load management and recovery plan",
      notes: "Excellent compliance with exercises.",
      status: "follow-up",
    },
  ]);

  console.log("Seed data inserted successfully");
  await mongoose.disconnect();
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
