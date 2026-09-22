const User = require("../models/User");
const Physio = require("../models/Physio");
const Booking = require("../models/Booking");
const Product = require("../models/Product");
const Order = require("../models/Order");

exports.getDashboard = async () => {
  const [users, physios, bookings, products, orders] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }).lean(),
    Physio.find().populate("user", "email verificationStatus").sort({ createdAt: -1 }).lean(),
    Booking.find().populate("patient", "fullName email").populate("physio", "name").sort({ createdAt: -1 }).lean(),
    Product.find().sort({ createdAt: -1 }).lean(),
    Order.find().populate("user", "fullName email").sort({ createdAt: -1 }).lean(),
  ]);
  return { users, physios, bookings, products, orders };
};

exports.reviewPhysio = async (physioId, verified) => {
  const physio = await Physio.findByIdAndUpdate(physioId, { verified }, { new: true });
  if (!physio) throw new Error("Physio not found");
  await User.findByIdAndUpdate(physio.user, { verificationStatus: verified ? "verified" : "rejected" });
  return physio;
};

exports.createProduct = (data) => Product.create(data);
exports.updateProduct = (id, data) => Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
exports.deleteProduct = (id) => Product.findByIdAndDelete(id);