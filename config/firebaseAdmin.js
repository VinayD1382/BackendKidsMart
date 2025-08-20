import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let serviceAccount;

if (process.env.SERVICE_ACCOUNT_KEY) {
  // 🔥 On Render (ENV variable)
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
} else {
  // 💻 Local development (file)
  const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

