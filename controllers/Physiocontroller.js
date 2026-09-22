const { getNearbyPhysios, submitPhysioVerification } = require("../services/physioService");

exports.nearby = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;
    const physios = await getNearbyPhysios(longitude, latitude);
    res.json(physios);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch nearby physios" });
  }
};

exports.verify = async (req, res) => {
  try {
    const result = await submitPhysioVerification({
      userId: req.user.id,
      verificationData: req.body,
    });

    res.status(201).json({
      message: "Verification documents received successfully",
      user: result.user,
      physio: result.physioProfile,
    });
  } catch (error) {
    if (error.message === "Physio account required") {
      return res.status(403).json({ message: error.message });
    }

    res.status(500).json({ message: "Verification submission failed" });
  }
};