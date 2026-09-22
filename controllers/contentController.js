const Physio = require("../models/Physio");
const Review = require("../models/Review");
const MedicalRecord = require("../models/MedicalRecord");
const Product = require("../models/Product");

const fallbackPhysios = [
  {
    _id: "seed-home-1",
    name: "Dr. Nirmala Silva",
    specialization: "Orthopedic & Geriatric Care",
    consultationFee: 2500,
    rating: 4.9,
    verified: true,
    availability: "Available today",
    category: "home",
    bio: "Specialist in geriatric mobility and post-op rehabilitation.",
  },
  {
    _id: "seed-home-2",
    name: "Dr. Ruwan Jayasuriya",
    specialization: "Neurological Rehabilitation",
    consultationFee: 3000,
    rating: 4.8,
    verified: true,
    availability: "Available this evening",
    category: "premium",
    bio: "Focused on stroke recovery and neurological mobility programmes.",
  },
];

exports.getContent = async (req, res) => {
  try {
    const [physiosFromDB, products] = await Promise.all([
      Physio.find({ verified: true }).lean(),
      Product.find({ active: true }).sort({ createdAt: -1 }).lean(),
    ]);
    const reviews = await Review.find({}).sort({ createdAt: -1 }).limit(6).lean();
    const medicalRecords = await MedicalRecord.find({}).sort({ createdAt: -1 }).limit(10).lean();

    const physios = physiosFromDB.length > 0 ? physiosFromDB : fallbackPhysios;

    res.json({ physios, reviews, medicalRecords, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load content" });
  }
};
