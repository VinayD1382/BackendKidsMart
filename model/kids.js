import mongoose from "mongoose";

const kidsschema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String
});

export default mongoose.model("Kids", kidsschema);
