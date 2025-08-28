import express from "express";
import {
  adminRegister,
  adminLogin,
  forgotPassword,
  verifyToken,
  resetPassword,
  googleLogin
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:adminId", resetPassword);
router.get("/verify-token", verifyToken);
router.post("/google-login", googleLogin); 

router.get("/verify", (req, res) => {
  res.json({ success: true, message: "Admin verified!" });
});
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
