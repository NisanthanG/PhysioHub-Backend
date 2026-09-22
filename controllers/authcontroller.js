const {
  registerUser,
  loginUser,
} = require("../services/authService");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json({ message: error.message });
    }

    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    if (error.message === "Invalid credentials") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Login failed" });
  }
};