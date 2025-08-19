import bcrypt from "bcryptjs";

const plain = "1234";
const hash = await bcrypt.hash(plain, 10);

const match = await bcrypt.compare("1234", hash); // ✅ true
const fail = await bcrypt.compare("wrong", hash); // ❌ false

console.log({ match, fail });
