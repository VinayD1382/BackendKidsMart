import admin from "firebase-admin";
import path from "path";
import { fileURLToPath } from "url";

// Support both local dev (file) and production (env var)
let serviceAccount;

if (process.env.SERVICE_ACCOUNT_KEY) {
  // 🔥 Render: Load from environment variable
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);
} else {
  // 💻 Local development: Load from file
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
  serviceAccount = JSON.parse(
    await import("fs").then(fs => fs.readFileSync(serviceAccountPath, "utf8"))
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;


export default admin;
