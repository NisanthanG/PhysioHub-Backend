const router = require("express").Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { nearby, verify } = require("../controllers/physioController");

router.get("/nearby", nearby);
router.post("/verify", auth, role("physio"), verify);

module.exports = router;