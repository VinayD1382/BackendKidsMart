import express from "express";
import Cart from "../model/Cart.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const cartItems = await Cart.find({ userId });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete('/clear', async (req, res) => {
  const { userId } = req.body;
  try {
    await Cart.deleteMany({ userId });
    res.status(200).send("Cart cleared");
  } catch (err) {
    res.status(500).send("Error clearing cart");
  }
});

router.post("/add", async (req, res) => {
  try {
    const { userId, productId, name, image, price } = req.body;

    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      return res.json(cartItem); 
    }

    cartItem = new Cart({ userId, productId, name, image, price, quantity: 1 });
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  try {
    const { userId, productId, change } = req.body;

    const cartItem = await Cart.findOne({ userId, productId });
    if (!cartItem) return res.status(404).json({ message: "Item not found" });

    cartItem.quantity += change;

    if (cartItem.quantity <= 0) {
      await Cart.deleteOne({ _id: cartItem._id });
    } else {
      await cartItem.save();
    }

    const updatedCart = await Cart.find({ userId });
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/remove/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body;

    const deletedItem = await Cart.findOneAndDelete({ userId, productId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    const updatedCart = await Cart.find({ userId });
    res.json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
