const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const controller = require("../controllers/storeController");

router.post("/orders", auth, role("patient", "physio", "admin"), controller.createOrder);
router.get("/orders", auth, controller.listOrders);

module.exports = router;