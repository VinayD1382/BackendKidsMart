import express from "express";
import Kids from "../model/kids.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const kidsProducts = await Kids.find();
    res.json(kidsProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch kids products" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newKids = new Kids(req.body);
    await newKids.save();
    res.json({ message: "Kids product added", newKids });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add kids product" });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Kids.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Delete error:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Kids.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Product updated successfully", updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

