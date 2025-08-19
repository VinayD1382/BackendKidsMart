import express from "express";
import home from "../model/home.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await home.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const product = new home(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await home.findByIdAndDelete(req.params.id);
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
    const updatedProduct = await Toys.findByIdAndUpdate(
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
