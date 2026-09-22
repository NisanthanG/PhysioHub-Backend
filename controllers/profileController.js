const User = require("../models/User");
const Physio = require("../models/Physio");

exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password").lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  const physio = user.role === "physio" ? await Physio.findOne({ user: user._id }).lean() : null;
  res.json({ user, physio });
};

exports.updateProfile = async (req, res) => {
  const allowed = (({ fullName, phoneNumber, address }) => ({ fullName, phoneNumber, address }))(req.body);
  const user = await User.findByIdAndUpdate(req.user.id, allowed, { new: true, runValidators: true }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  let physio = null;
  if (user.role === "physio") {
    const fields = (({ specialization, experience, consultationFee, bio, availability, homeVisitEnabled, onlineConsultationEnabled }) => ({ specialization, experience, consultationFee, bio, availability, homeVisitEnabled, onlineConsultationEnabled }))(req.body);
    physio = await Physio.findOneAndUpdate({ user: user._id }, fields, { new: true, runValidators: true });
  }
  res.json({ user, physio });
};