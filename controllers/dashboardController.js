import MeasureActivity from "../models/MeasureActivity.js";
import ReduceAction from "../models/ReduceAction.js";
import OffsetTransaction from "../models/OffsetTransaction.js";
import ShareCredit from "../models/ShareCredit.js";

export const dashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const emissions = await MeasureActivity.find({ user: userId });
    const reductions = await ReduceAction.find({ user: userId });
    const offsets = await OffsetTransaction.find({ user: userId });
    const shares = await ShareCredit.find({ fromUser: userId });
    const sharesReceived = await ShareCredit.find({ 
      toUser: userId,
      status: "completed" 
    });

    const transactions = [
      ...emissions.map(e => ({
        _id: e._id,
        date: e.createdAt,
        type: "measure",
        description: `Emission (${e.activity_type})`,
        amount: -e.co2_generated,
      })),

      ...reductions.map(r => ({
        _id: r._id,
        date: r.createdAt,
        type: "reduce",
        description: r.action_type.replace("_", " "),
        amount: r.impact,
      })),

      ...offsets.map(o => ({
        _id: o._id,
        date: o.createdAt,
        type: "offset",
        description: "Carbon offset purchase",
        amount: o.credit_amount,
      })),

      ...shares.map(s => ({
        _id: s._id,
        date: s.createdAt,
        type: "share",
        description: `Shared to ${s.toUserEmail}`,
        amount: -s.creditsShared,
      })),
    ];

    transactions.sort((a, b) => b.date - a.date);

    res.json({
      current_balance: req.user.carbon_balance,
      total_emissions: emissions.reduce((s, e) => s + e.co2_generated, 0),
      total_reductions: reductions.reduce((s, r) => s + r.impact, 0),
      total_offsets: offsets.reduce((s, o) => s + o.credit_amount, 0),
      recent_transactions: transactions.slice(0, 5),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
