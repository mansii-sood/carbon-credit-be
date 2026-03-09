import mongoose from "mongoose";

const shareSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  toUserEmail: { type: String, required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  creditsShared: { type: Number, required: true },
  message: { type: String },
  status: { type: String, enum: ["pending", "completed"], default: "completed" },
}, { timestamps: true });

export default mongoose.model("ShareCredit", shareSchema);
