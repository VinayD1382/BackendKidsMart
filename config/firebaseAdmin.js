import admin from "firebase-admin";

let serviceAccount;

if (process.env.SERVICE_ACCOUNT) {
  // 🚀 Running on Render (env variable)
  serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
} else {
  // 🖥️ Running locally (from JSON file)
  serviceAccount = JSON.parse(
    fs.readFileSync("./serviceAccountKey.json", "utf8")
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;


