import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import { readFileSync } from "fs";
import jwt from "jsonwebtoken";
import userRoutes from "./Router/UserLogRouter.js";
import UserAuth from "./Router/UserAuthRouter.js";
// ✅ Setup for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Load .env
dotenv.config();

// ✅ Import routes
import kidsRoutes from "./Router/kidsrouter.js";
import Stationroute from "./Router/StationaryRouter.js";
import Toys from "./Router/ToysRouter.js";
import homeroute from "./Router/HomeRouter.js";
import contactroute from "./Router/ContactRouter.js";
import adminroutes from "./Router/adminRouter.js";
import cartRoutes from "./Router/CartRoutes.js";
import wishlistRoutes from "./Router/WishlistRouter.js";
import checkoutRouter from "./Router/CheckoutRouter.js";
import orderPays from "./Router/OrdersPay.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true
}));
app.use(express.json());

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://<user>:<pass>@cluster0.mongodb.net/MERNPRO";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/home", homeroute);
app.use("/api/kids", kidsRoutes);
app.use("/api/toys", Toys);
app.use("/api/stationary", Stationroute);
app.use("/api/contact", contactroute);
app.use("/api/admin", adminroutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api", checkoutRouter);
app.use("/api/orderp", orderPays);
app.use("/api", userRoutes);
app.use("/api/users",UserAuth);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}
const allowedAdmins = ["+918884681382"]; // Add more numbers if needed
function createJwtForUser(uid) {
  return jwt.sign({ uid, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
}
app.post("/admin/verify-otp", async (req, res) => {
  const { idToken } = req.body; // This should come from Firebase after OTP verification in frontend

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded token:", decodedToken);

    if (decodedToken.phone_number === "+918884681382") {
      // ✅ Create your JWT just like Google sign-in
      const token = jwt.sign({ uid: decodedToken.uid }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.json({ token });
    } else {
      return res.status(401).json({ error: "Unauthorized phone number" });
    }
  } catch (err) {
    console.error("OTP verification failed:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
});
app.post("/api/admin/phone-login", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken" });
  }

  try {
    // Verify token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    console.log("Decoded token:", decodedToken);

    // Check if phone number is in allowed list
    if (allowedAdmins.includes(decodedToken.phone_number)) {
      const yourJwt = createJwtForUser(decodedToken.uid);
      return res.json({ token: yourJwt });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
