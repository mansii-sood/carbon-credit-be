import mongoose from "mongoose";

const measureActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activity_type: {
      type: String,
      enum: ["transport", "electricity", "waste", "manufacturing"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["km", "kwh", "kg", "liters"],
      required: true,
    },
    vehicle_type: String,
    description: String,
    co2_generated: Number,
  },
  { timestamps: true }
);

export default mongoose.model("MeasureActivity", measureActivitySchema);
