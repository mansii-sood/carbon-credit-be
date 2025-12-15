import mongoose from "mongoose";

const offsetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    credit_amount: Number,
    project_id: String,
    price: Number,
  },
  { timestamps: true }
);

export default mongoose.model("OffsetTransaction", offsetSchema);
