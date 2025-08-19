import express from "express";
import Contact from "../model/contact.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const cartItems = await Contact.find({ userId });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    res.status(200).json({ message: "Form submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, name, image, price } = req.body;

    let cartItem = await Contact.findOne({ userId, productId });
    if (cartItem) return res.json(cartItem);

    cartItem = new Cart({ userId, productId, name, image, price, quantity: 1 });
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  try {
    const { quantity } = req.body;

    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ message: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/remove/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
