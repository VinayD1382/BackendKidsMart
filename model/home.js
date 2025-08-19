import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  name: String,
  image: String,
  price: Number,
  description: String,
  category: String
});

export default mongoose.model("Home", homeSchema);
