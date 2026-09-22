const router = require("express").Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");

const { createBooking, listBookings, updateStatus } = require("../controllers/bookingController");

router.get("/", auth, role("patient", "physio"), listBookings);
router.post("/", auth, role("patient"), createBooking);
router.patch("/:id/status", auth, role("physio"), updateStatus);

module.exports = router;