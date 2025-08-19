import express from "express";
import Station from "../model/Stationary.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const StationProducts = await Station.find();
    res.json(StationProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch kids products" });
  }
});
router.post("/", async (req, res) => {
  const newstat = new Station(req.body);
  await newstat.save();
  res.json({ message: "Stationary product added", newstat });
});

router.delete("/:id", async (req, res) => {
  try {
    await Station.findByIdAndDelete(req.params.id);
    res.json({ message: "Toys product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Station.findByIdAndUpdate(
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
