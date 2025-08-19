import mongoose from "mongoose";

const toyschema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  category: String
});

export default mongoose.model("Toy", toyschema);
