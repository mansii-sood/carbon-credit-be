import mongoose from "mongoose";

const reduceActionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action_type: {
      type: String,
      enum: [
        "solar_installation",
        "tree_planting",
        "recycling",
        "energy_efficiency",
      ],
    },
    impact: Number,
    unit: { type: String, default: "kg_co2" },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("ReduceAction", reduceActionSchema);
