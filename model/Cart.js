import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  image: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  userId: { type: String, default: "guest" }
});

export default mongoose.model("Cart", cartSchema);
