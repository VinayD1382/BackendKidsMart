import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [productSchema],  // Cart with same product structure as checkoutSchema
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;
