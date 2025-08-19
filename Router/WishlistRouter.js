import express from "express";
import Wishlist from "../model/Wishlist.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  const items = await Wishlist.find({ userId });
  res.json(items);
});

router.post("/add", async (req, res) => {
  const { userId, productId, name, image, price } = req.body;

  if (!productId) return res.status(400).json({ error: "Product ID required" });

  let item = await Wishlist.findOne({ userId, productId });
  if (item) return res.json(item); 

  item = new Wishlist({ userId, productId, name, image, price });
  await item.save();
  res.json(item);
});

router.delete("/remove/:productId", async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;

  await Wishlist.findOneAndDelete({ userId, productId });
  res.json({ success: true });
});

export default router;
