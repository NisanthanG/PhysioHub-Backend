const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const { createMeeting, getMyMeetings, getAvailableMeetings } = require("../controllers/zoomController");

router.post("/meetings", auth, role("physio"), createMeeting);
router.get("/meetings", auth, getMyMeetings);
router.get("/meetings/available", auth, getAvailableMeetings);

module.exports = router;
