import express from "express";
import User from "../model/Userauth.js";  // adjust path as needed
import Checkout from '../model/Checkout.js';  // your Checkout schema
import bcrypt from 'bcrypt';

const router = express.Router();

// Register new user (POST /api/users)
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      password, // storing plain password (not recommended!)
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully.", userId: newUser._id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(409).json({ message: "User already exists." });

    const newUser = new User({ email: email.toLowerCase(), password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully.", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user and orders by email
router.get("/:email", async (req, res) => {
  const email = req.params.email.toLowerCase();
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await Checkout.find({ email });

    return res.json({ user: { email: user.email, id: user._id }, orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user by email (GET /api/users/:email)
router.get('/:email', async (req, res) => {
  const email = req.params.email.toLowerCase();

  try {
    // Check if user exists in UserAuth
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all orders/products from Checkout for this user
    const orders = await Checkout.find({ email });

    // Return the orders (products) in response
    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching user products:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(409).json({ message: "User already exists." });

    // Hash password before saving for security (bcrypt)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password." });

    // Login success
    res.status(200).json({ message: "Login successful.", email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
