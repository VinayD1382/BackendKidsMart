import express from "express";
import multer from "multer";
import path from "path";
import jwt from "jsonwebtoken";
import Checkout from "../model/Checkout.js";
import PaymentProof from "../model/PaymentProof.js";
import Kidswear from "../model/kids.js";
import Stationary from "../model/Stationary.js";
import Toys from "../model/toys.js";
import admin from "../config/firebaseAdmin.js";
import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: "rzp_test_RAduDXwwdhSAGm",       // from Razorpay Dashboard (Test Mode)
  key_secret: "gbTwkfbTnd3XV29WpBJSi4mv"
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "No ID token provided" });

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    if (email !== "vinaydraj1382@gmail.com") {
      return res.status(403).json({ message: "Unauthorized email" });
    }

    const token = jwt.sign(
      { email, role: "admin" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
});

router.post("/checkout", upload.single("paymentProof"), async (req, res) => {
  try {
    const cart = req.body.cart ? JSON.parse(req.body.cart) : [];
    const address = req.body.address ? JSON.parse(req.body.address) : {};
    const mode = req.body.paymentMethod || "Cash On Delivery";
    const email = req.body.email; 
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = new Checkout({
      email, 
      cart,
      totalPrice,
      mode,
      address,
    });

    const savedOrder = await newOrder.save();

    if (req.file) {
      const newProof = new PaymentProof({
        orderId: savedOrder._id,
        fileName: req.file.filename,
        filePath: req.file.path,
      });
      await newProof.save();
    }

    res.status(201).json({ message: "Order placed successfully", orderId: savedOrder._id });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

router.get("/checkout", async (req, res) => {
  try {
    const orders = await Checkout.find().sort({ createdAt: -1 }).lean();

    const ordersWithProof = await Promise.all(
      orders.map(async (order) => {
        const proof = await PaymentProof.findOne({ orderId: order._id }).lean();
        order.paymentProof = proof ? `/uploads/${proof.fileName}` : null;
        order.paymentVerified = proof?.verified || false;
        return order;
      })
    );

    res.status(200).json(ordersWithProof);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/payment-proof/:orderId", async (req, res) => {
  try {
    const paymentProof = await PaymentProof.findOne({ orderId: req.params.orderId });
    if (!paymentProof) {
      return res.status(404).json({ message: "Payment proof not found" });
    }
    res.status(200).json(paymentProof);
  } catch (error) {
    console.error("Error fetching payment proof:", error);
    res.status(500).json({ message: "Failed to fetch payment proof" });
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);

  try {
    const kidswear = await Kidswear.find({ name: { $regex: query, $options: "i" } });
    const stationary = await Stationary.find({ name: { $regex: query, $options: "i" } });
    const toys = await Toys.find({ name: { $regex: query, $options: "i" } });

    const results = [
      ...kidswear.map((item) => ({ ...item.toObject(), category: "kidswear" })),
      ...stationary.map((item) => ({ ...item.toObject(), category: "stationary" })),
      ...toys.map((item) => ({ ...item.toObject(), category: "toys" })),
    ];

    res.json(results);
  } catch (err) {
    console.error("Search error", err);
    res.status(500).send("Error searching products");
  }
});

router.patch("/checkout/:id/verify", async (req, res) => {
  try {
    const updatedOrder = await Checkout.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "Verified" },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Payment verified", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/checkout/orders/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const orders = await Checkout.find({ email }).lean();
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/checkout/:id/reject", async (req, res) => {
  try {
    const updatedOrder = await Checkout.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "Rejected" },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Payment rejected", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/checkout/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await Checkout.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});
router.post("/google-login", async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "No ID token provided" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    if (email !== "vinaydraj1382@gmail.com") {
      return res.status(403).json({ message: "Unauthorized email" });
    }

    const token = jwt.sign({ email, role: "admin" }, "your_jwt_secret", { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Google login failed" });
  }
});
router.get('/orders/:email', async (req, res) => {
  const email = req.params.email.toLowerCase();

  try {
    const orders = await Checkout.find({ email });
    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get checkout products for a specific user (by email)
router.get("/checkout/user/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Find orders where user email matches
    const userOrders = await Checkout.find({ email: email });

    if (userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: "order_rcptid_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating Razorpay order");
  }
});



export default router;
