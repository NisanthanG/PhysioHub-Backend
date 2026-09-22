const { createBooking, getBookingsForUser, updateBookingStatus } = require("../services/bookingService");

exports.listBookings = async (req, res) => {
  try { res.json(await getBookingsForUser(req.user.id, req.user.role)); }
  catch (error) { res.status(500).json({ message: "Failed to load bookings" }); }
};

exports.createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      patient: req.user.id,
    };

    if (!bookingData.physio) {
      return res.status(400).json({ message: "Physio ID is required for booking." });
    }

    const booking = await createBooking(bookingData);
    res.status(201).json({ message: "Appointment requested successfully", booking });
  } catch (error) {
    if (error.message === "Physio not found") {
      return res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Booking creation failed" });
  }
};

exports.updateStatus = async (req, res) => {
  try { res.json(await updateBookingStatus(req.params.id, req.user.id, req.body.status)); }
  catch (error) { res.status(error.message === "Booking not found" ? 404 : 403).json({ message: error.message }); }
};