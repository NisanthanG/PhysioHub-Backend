const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth",
require("./routes/authRoutes"));

app.use("/api/physios",
require("./routes/physioRoutes"));

app.use("/api/bookings",
require("./routes/bookingRoutes"));

app.use("/api/zoom",
require("./routes/zoomRoutes"));

app.use("/api/content",
require("./routes/contentRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/store", require("./routes/storeRoutes"));

module.exports = app;