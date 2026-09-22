const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/profileController");

router.use(auth);
router.get("/", controller.getProfile);
router.patch("/", controller.updateProfile);

module.exports = router;