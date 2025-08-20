
import admin from "firebase-admin";

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

  // 🔑 Fix: replace \\n with real newlines in private_key
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
} catch (err) {
  console.error("Failed to load SERVICE_ACCOUNT:", err);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

