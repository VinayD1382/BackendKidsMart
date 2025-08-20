import admin from "firebase-admin";

// Parse SERVICE_ACCOUNT JSON from Render environment
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;



