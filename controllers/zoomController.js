const { createZoomMeeting, getUserZoomSessions, getAvailableZoomSessions } = require("../services/zoomService");

exports.createMeeting = async (req, res) => {
  try {
    const session = await createZoomMeeting({
      userId: req.user.id,
      bookingId: req.body.bookingId,
      topic: req.body.topic,
      startTime: req.body.startTime,
      duration: req.body.duration || 30,
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Zoom meeting creation failed", error: error.message });
  }
};

exports.getMyMeetings = async (req, res) => {
  try {
    const sessions = await getUserZoomSessions(req.user.id);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch meetings" });
  }
};

exports.getAvailableMeetings = async (req, res) => {
  try {
    const sessions = await getAvailableZoomSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch available meetings" });
  }
};
