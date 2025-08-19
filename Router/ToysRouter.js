import express from "express";
import Toys from "../model/toys.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const toys = await Toys.find();
    res.json(toys);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch toys" });
  }
});
router.post("/", async (req, res) => {
  try {
    const newToy = new Toys({
      ...req.body,
      category: "toys"  
    });
    await newToy.save();
    res.status(201).json({ message: "Toy product added", newToy });
  } catch (err) {
    res.status(500).json({ error: "Failed to add toy" });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Toys.findByIdAndDelete(req.params.id);
    res.json({ message: "Toys product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
