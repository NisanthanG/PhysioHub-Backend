const User = require("../models/User");
const Physio = require("../models/Physio");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (userData) => {
  const fullName = userData.fullName || userData.name || userData.fullname;
  const email = userData.email;
  const password = userData.password;
  const suppliedRole = userData.role || userData.userType || "patient";

  let role = suppliedRole;
  if (role === "physiotherapist") {
    role = "physio";
  }

  const validRoles = ["patient", "physio", "admin"];
  if (!validRoles.includes(role)) {
    role = "patient";
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
    phoneNumber: userData.phoneNumber,
    address: userData.address,
    verificationStatus: role === "physio" ? "pending_submission" : "verified",
  });

  if (role === "physio") {
    await Physio.create({
      user: user._id,
      name: fullName,
      specialization: userData.specialization || "General Physiotherapy",
      experience: userData.experience || 2,
      consultationFee: userData.consultationFee || 2500,
      homeVisitRadius: userData.homeVisitRadius || 10,
      licenseNumber: userData.licenseNumber || "",
      clinicRegistrationNumber: userData.clinicRegistrationNumber || "",
      availability: userData.availability || "Available today",
      category: userData.category || "online",
      bio: userData.bio || "Newly registered physiotherapist",
      location: userData.location || {
        type: "Point",
        coordinates: [79.8612, 6.9271],
      },
    });
  }

  return user;
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );

  return { token, user };
};
