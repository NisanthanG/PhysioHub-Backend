const Product = require("../models/Product");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const requested = req.body.items || [];
    if (!requested.length || !req.body.shippingAddress) return res.status(400).json({ message: "Items and shipping address are required" });
    const products = await Product.find({ _id: { $in: requested.map((item) => item.product) }, active: true });
    const items = requested.map((item) => {
      const product = products.find((entry) => String(entry._id) === String(item.product));
      const quantity = Number(item.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || product.stock < quantity) throw new Error("Product unavailable or out of stock");
      return { product: product._id, name: product.name, quantity, price: product.price };
    });
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ user: req.user.id, items, total, shippingAddress: req.body.shippingAddress, paymentMethod: req.body.paymentMethod || "card", paymentStatus: req.body.paymentMethod === "card" ? "paid" : "pending" });
    await Promise.all(items.map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })));
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) { res.status(400).json({ message: error.message }); }
};

exports.listOrders = async (req, res) => res.json(await Order.find({ user: req.user.id }).sort({ createdAt: -1 }));