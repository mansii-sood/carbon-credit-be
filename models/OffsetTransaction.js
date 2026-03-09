import mongoose from "mongoose";

const offsetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project_name: { type: String, required: true },
  credit_amount: { type: Number, required: true },
  price: { type: Number, required: true },
  total_cost: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("OffsetTransaction", offsetSchema);
