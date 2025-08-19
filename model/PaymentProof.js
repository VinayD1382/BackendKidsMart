import mongoose from "mongoose";

const paymentProofSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Checkout",
    required: true,
  },
  fileName: String,      
  filePath: String,       
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const PaymentProof = mongoose.model("PaymentProof", paymentProofSchema);

export default PaymentProof;
