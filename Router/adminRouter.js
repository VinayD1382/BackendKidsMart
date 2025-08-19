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

export default router;
