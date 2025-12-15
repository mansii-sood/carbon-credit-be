import MeasureActivity from "../models/MeasureActivity.js";
import ReduceAction from "../models/ReduceAction.js";
import User from "../models/User.js";
import OffsetTransaction from "../models/OffsetTransaction.js";

const calculateCO2 = (activity_type, quantity) => {
  const factors = {
    transport: 0.21,
    electricity: 0.82,
    waste: 0.5,
    manufacturing: 1.2,
  };
  return quantity * (factors[activity_type] || 0.5);
};

export const recordMeasure = async (req, res) => {
  try {
    const { activity_type, quantity, unit, vehicle_type, description } = req.body;

    const co2 = calculateCO2(activity_type, quantity);

    const activity = await MeasureActivity.create({
      user: req.user._id,
      activity_type,
      quantity,
      unit,
      vehicle_type,
      description,
      co2_generated: co2,
    });

    res.status(201).json({
      id: activity._id,
      co2_generated: co2,
      timestamp: activity.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recordReduction = async (req, res) => {
  try {
    const { action_type, impact, description } = req.body;

    const creditsEarned = impact; 

    await ReduceAction.create({
      user: req.user._id,
      action_type,
      impact,
      description,
    });

    req.user.carbon_balance += creditsEarned;
    await req.user.save();

    res.status(201).json({
      credits_earned: creditsEarned,
      new_balance: req.user.carbon_balance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const purchaseOffset = async (req, res) => {
  const { credit_amount, project_id, price } = req.body;

  const totalCost = credit_amount * price;

  const transaction = await OffsetTransaction.create({
    user: req.user._id,
    credit_amount,
    project_id,
    price,
  });

  req.user.carbon_balance += credit_amount;
  await req.user.save();

  res.status(201).json({
    transaction_id: transaction._id,
    credits_purchased: credit_amount,
    total_cost: totalCost,
    new_balance: req.user.carbon_balance,
  });
};