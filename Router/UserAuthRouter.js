import express from "express";
import User from "../model/Userauth.js";   // your UserAuth schema
import Checkout from "../model/Checkout.js";  // your Checkout schema

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register new user
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password, // stored as plain text (for now)
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   POST /api/users/login
 * @desc    Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/users/:email
 * @desc    Get user details + orders
 */
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // get orders for this user
    const orders = await Checkout.find({ email });

    res.json({
      success: true,
      user: { id: user._id, email: user.email },
      orders,
    });
  } catch (error) {
    console.error("Error fetching user and orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/*
app.get("/api/orders/:email", async (req, res) => {
  const email = req.params.email;
  const orders = await Orders.find({ email });
  res.json(orders);
});*/
router.get("/orders/:email", async (req, res) => {
  try {
    const email = req.params.email.toLowerCase();
    const orders = await Checkout.find({ email });  // ✅ use Checkout

    res.json({ orders }); // ✅ wrap in object so frontend works
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
