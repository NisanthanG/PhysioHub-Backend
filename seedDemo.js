const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");
const Physio = require("./models/Physio");
const Product = require("./models/Product");

dotenv.config();

const accounts = [
  { fullName: "PNSL Demo Patient", email: "patient@pnsl.test", role: "patient", phoneNumber: "0770000001", address: "Colombo 07" },
  { fullName: "Dr. Demo Physio", email: "physio@pnsl.test", role: "physio", phoneNumber: "0770000002", address: "Colombo 05" },
  { fullName: "PNSL Demo Admin", email: "admin@pnsl.test", role: "admin", phoneNumber: "0770000003", address: "PNSL HQ" },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = {};
  for (const account of accounts) {
    users[account.role] = await User.findOneAndUpdate(
      { email: account.email },
      { ...account, password, verificationStatus: account.role === "physio" ? "verified" : "verified" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  await Physio.findOneAndUpdate(
    { user: users.physio._id },
    { user: users.physio._id, name: users.physio.fullName, specialization: "Orthopedic Rehabilitation", experience: 8, consultationFee: 2500, homeVisitRadius: 10, verified: true, category: "home", availability: "Available today", bio: "Demo profile for home visits and online consultations.", location: { type: "Point", coordinates: [79.8612, 6.9271] } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const products = [
    { name: "Resistance Band Kit", description: "Progressive strength work for home rehabilitation.", price: 2500, stock: 25, category: "strength" },
    { name: "Recovery Foam Roller", description: "A firm roller for mobility and muscle release.", price: 3200, stock: 18, category: "mobility" },
    { name: "Therapy Balance Ball", description: "Support balance, coordination, and core control.", price: 1800, stock: 30, category: "balance" },
  ];
  for (const product of products) await Product.findOneAndUpdate({ name: product.name }, product, { upsert: true, new: true, setDefaultsOnInsert: true });
  console.log("Demo accounts and store products seeded.");
  console.log("Patient: patient@pnsl.test | Physio: physio@pnsl.test | Admin: admin@pnsl.test | Password: PNSLdemo123!");
  await mongoose.disconnect();
};

seed().catch((error) => { console.error(error); process.exit(1); });