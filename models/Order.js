const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, name: String, quantity: { type: Number, required: true, min: 1 }, price: { type: Number, required: true, min: 0 } }],
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["card", "cash_on_delivery"], default: "card" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status: { type: String, enum: ["placed", "processing", "shipped", "delivered", "cancelled"], default: "placed" },
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);