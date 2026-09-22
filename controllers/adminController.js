const adminService = require("../services/adminService");

exports.dashboard = async (req, res) => {
  try { res.json(await adminService.getDashboard()); }
  catch (error) { res.status(500).json({ message: "Failed to load admin dashboard" }); }
};

exports.reviewPhysio = async (req, res) => {
  try {
    const physio = await adminService.reviewPhysio(req.params.id, req.body.verified === true);
    res.json({ message: physio.verified ? "Physiotherapist verified" : "Physiotherapist rejected", physio });
  } catch (error) { res.status(error.message === "Physio not found" ? 404 : 500).json({ message: error.message }); }
};

exports.createProduct = async (req, res) => {
  try { res.status(201).json(await adminService.createProduct(req.body)); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

exports.updateProduct = async (req, res) => {
  try { res.json(await adminService.updateProduct(req.params.id, req.body)); }
  catch (error) { res.status(400).json({ message: error.message }); }
};

exports.deleteProduct = async (req, res) => {
  try { await adminService.deleteProduct(req.params.id); res.status(204).send(); }
  catch (error) { res.status(400).json({ message: error.message }); }
};