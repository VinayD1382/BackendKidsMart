import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";

// Routes imports
import userRoutes from "./Router/UserLogRouter.js";
import UserAuth from "./Router/UserAuthRouter.js";
<<<<<<< HEAD
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Load .env
dotenv.config();

// ✅ Import routes
=======
>>>>>>> a08e96b35f72f58dae8ec58a2200fff50ddb72a4
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

// Setup __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// CORS setup for Netlify frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://kidsmartshop.netlify.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing!");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Firebase Admin setup
if (!process.env.SERVICE_ACCOUNT) {
  console.error("❌ SERVICE_ACCOUNT env variable is missing!");
  process.exit(1);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
} catch (err) {
  console.error("❌ Failed to parse SERVICE_ACCOUNT JSON:", err);
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// JWT helper for admin
const allowedAdmins = ["+918884681382"];
function createJwtForUser(uid) {
  return jwt.sign({ uid, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1h"
  });
}

// Routes
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
app.use("/api/users", UserAuth);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
<<<<<<< HEAD

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);
=======
>>>>>>> a08e96b35f72f58dae8ec58a2200fff50ddb72a4

// Admin OTP verification
app.post("/admin/verify-otp", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded token:", decodedToken);

    if (decodedToken.phone_number === "+918884681382") {
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

// Admin phone-login
app.post("/api/admin/phone-login", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded token:", decodedToken);

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

// Render-ready port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




