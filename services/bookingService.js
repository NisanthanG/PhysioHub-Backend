const Booking = require("../models/Booking");
const Physio = require("../models/Physio");

exports.createBooking = async (bookingData) => {
  const physio = await Physio.findById(bookingData.physio);

  if (!physio) {
    throw new Error("Physio not found");
  }

  return Booking.create({
    ...bookingData,
    bookingType: bookingData.bookingType || "online",
    status: "pending",
    paymentStatus: "unpaid",
  });
};

exports.getBookingsForUser = async (userId, role) => {
  if (role === "physio") {
    const physio = await Physio.findOne({ user: userId });
    return physio ? Booking.find({ physio: physio._id }).populate("patient", "fullName email phoneNumber").sort({ date: 1 }) : [];
  }
  return Booking.find({ patient: userId }).populate("physio", "name specialization consultationFee").sort({ date: -1 });
};

exports.updateBookingStatus = async (bookingId, userId, nextStatus) => {
  const booking = await Booking.findById(bookingId).populate("physio");
  if (!booking) throw new Error("Booking not found");
  const physio = await Physio.findOne({ user: userId });
  if (!physio || String(booking.physio._id) !== String(physio._id)) throw new Error("Booking access denied");
  if (!["accepted", "cancelled", "completed"].includes(nextStatus)) throw new Error("Invalid booking status");
  booking.status = nextStatus;
  return booking.save();
};
