import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  image: String,
  price: Number,
  userId: { type: String, required: true }
});

export default mongoose.model("Wishlist", wishlistSchema);
