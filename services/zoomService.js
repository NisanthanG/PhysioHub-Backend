const axios = require("axios");
const ZoomSession = require("../models/ZoomSession");

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;

const getZoomAccessToken = async () => {
  const response = await axios.post(
    "https://zoom.us/oauth/token",
    null,
    {
      params: {
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID,
      },
      auth: {
        username: ZOOM_CLIENT_ID,
        password: ZOOM_CLIENT_SECRET,
      },
    }
  );

  return response.data.access_token;
};

exports.createZoomMeeting = async ({ userId, bookingId, topic, startTime, duration = 30 }) => {
  const accessToken = await getZoomAccessToken();

  const response = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic,
      type: 2,
      start_time: new Date(startTime).toISOString(),
      duration,
      timezone: "UTC",
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        waiting_room: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const session = await ZoomSession.create({
    user: userId,
    booking: bookingId,
    topic,
    zoomMeetingId: response.data.id,
    joinUrl: response.data.join_url,
    startUrl: response.data.start_url,
    password: response.data.password,
    duration,
    startTime,
    status: "scheduled",
  });

  return session;
};

exports.getUserZoomSessions = async (userId) => {
  return ZoomSession.find({ user: userId }).sort({ startTime: 1 });
};

exports.getAvailableZoomSessions = async () => {
  const now = new Date();
  return ZoomSession.find({
    status: { $in: ["scheduled", "active"] },
    startTime: { $gte: now },
  })
    .sort({ startTime: 1 })
    .populate("user", "fullName role");
};
