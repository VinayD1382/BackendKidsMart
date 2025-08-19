import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join("uploads", "paymentProofs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

router.post("/place-order", upload.single("paymentProof"), (req, res) => {
  const { name, email, amount, paymentMethod } = req.body;
  const proofPath = req.file ? `/uploads/paymentProofs/${req.file.filename}` : null;

  const order = {
    name,
    email,
    amount,
    paymentMethod,
    proof: proofPath,
    date: new Date()
  };

  console.log("Order received:", order);

  res.json({ success: true, message: "Order placed successfully!", order });
});

export default router;
