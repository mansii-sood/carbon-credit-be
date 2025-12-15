import MeasureActivity from "../models/MeasureActivity.js";
import ReduceAction from "../models/ReduceAction.js";
import OffsetTransaction from "../models/OffsetTransaction.js";

export const dashboardSummary = async (req, res) => {
  const emissions = await MeasureActivity.find({ user: req.user._id });
  const reductions = await ReduceAction.find({ user: req.user._id });
  const offsets = await OffsetTransaction.find({ user: req.user._id });

  res.json({
    current_balance: req.user.carbon_balance,
    total_emissions: emissions.length,
    total_reductions: reductions.length,
    total_offsets: offsets.length,
    recent_transactions: emissions.slice(-5),
  });
};
