import express from "express";
import User from "../model/Userlog.js";

const router = express.Router();

// Helper to merge carts (summing quantities for duplicates)
function mergeCarts(oldCart = [], newCart = []) {
  const map = new Map();

  oldCart.forEach((item) => {
    const key = item.productId || item.name;
    map.set(key, { ...item });
  });

  newCart.forEach((item) => {
    const key = item.productId || item.name;
    if (map.has(key)) {
      map.get(key).quantity += item.quantity;
    } else {
      map.set(key, { ...item });
    }
  });

  return Array.from(map.values());
}

// Register or update existing user and merge cart if user exists
router.post("/users", async (req, res) => {
  const { email, password, cart } = req.body;
  console.log("Register request received with cart:", cart);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    let user = await User.findOne({ email });

    if (user) {
      // User exists: merge carts and save
      user.cart = mergeCarts(user.cart, cart || []);
      await user.save();
      console.log("Existing user found, merged cart:", user.cart);
      return res.status(200).json(user);
    }

    // New user: create with provided cart
    user = new User({ email, password, cart: cart || [] });
    await user.save();
    console.log("New user created with cart:", user.cart);
    res.status(201).json(user);
  } catch (err) {
    console.error("Error in /users POST:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user by email (including cart)
router.get("/users/:email", async (req, res) => {
  const email = req.params.email.toLowerCase();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error in /users/:email GET:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update user's cart by merging with existing cart
router.post("/users/:email/cart", async (req, res) => {
  const email = req.params.email.toLowerCase();
  const newCart = req.body.cart;

  if (!Array.isArray(newCart)) {
    return res.status(400).json({ message: "Cart must be an array" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = mergeCarts(user.cart, newCart);
    await user.save();
    console.log("Cart merged and saved:", user.cart);
    res.json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    console.error("Error in /users/:email/cart POST:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
