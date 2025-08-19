import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
   email: {
    type: String,
    required: true,  // you can make it required if needed
  },
  cart: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  totalPrice: Number,
  mode: {
    type: String,
    default: "Cash On Delivery",
  },
  address: {
    name: String,
    street: String,
    area: String,
    door: String,
    state: String,
    phone: String,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
}, { timestamps: true });


const Checkout = mongoose.model("Checkout", checkoutSchema);

export default Checkout;