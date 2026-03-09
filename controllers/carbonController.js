import MeasureActivity from "../models/MeasureActivity.js";
import ReduceAction from "../models/ReduceAction.js";
import User from "../models/User.js";
import OffsetTransaction from "../models/OffsetTransaction.js";
import ShareCredit from "../models/ShareCredit.js";

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
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { activityType, vehicleType, quantity, unit, description } = req.body;
    if (!activityType || !quantity || !unit) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emissionFactors = { car: 0.21, bike: 0.05, bus: 0.1 };
    const emission = activityType === "transport"
      ? Number(quantity) * (emissionFactors[vehicleType] ?? 0.2)
      : Number(quantity) * 0.1;

    const record = await MeasureActivity.create({
      user: req.user._id,
      activity_type: activityType,
      quantity: Number(quantity),
      unit,
      vehicle_type: vehicleType,
      description: description || "",
      co2_generated: emission,
    });

    req.user.carbon_balance = (req.user.carbon_balance || 0) - emission;
    await req.user.save();

    res.status(201).json({ message: "Emission calculated", emission: Number(emission.toFixed(2)), record });
  } catch (error) {
    console.error("recordMeasure error:", error);
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
  const { credit_amount, project_name, price } = req.body;

  if (!credit_amount || credit_amount <= 0) {
    return res.status(400).json({ message: "Invalid credit amount" });
  }

  const transaction = await OffsetTransaction.create({
    user: req.user._id,
    project_name,
    credit_amount,
    price,
    total_cost: credit_amount * price,
  });

  req.user.carbon_balance += credit_amount;
  await req.user.save();

  res.status(201).json({
    message: "Credits purchased",
    credits: credit_amount,
    new_balance: req.user.carbon_balance,
  });
};


export const getOffsetTransactions = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const offsets = await OffsetTransaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(offsets);
  } catch (error) {
    console.error("getOffsetTransactions error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const shareCredits = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { toUserEmail, creditsShared, message } = req.body;
    const credits = Number(creditsShared);

    // Validation
    if (!toUserEmail || !credits || credits <= 0) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    // Check sender's email
    if (req.user.email === toUserEmail) {
      return res.status(400).json({ message: "Cannot share credits to yourself" });
    }

    // Check if sender has enough credits
    if ((req.user.carbon_balance || 0) < credits) {
      return res.status(400).json({ 
        message: `Insufficient credits. You have ${req.user.carbon_balance || 0} credits available.` 
      });
    }

    // Find recipient by email
    const recipient = await User.findOne({ email: toUserEmail });

    if (!recipient) {
      return res.status(404).json({ 
        message: `User with email ${toUserEmail} not found. Please check the email address.` 
      });
    }

    // Create share record
    const shared = await ShareCredit.create({
      fromUser: req.user._id,
      toUserEmail: recipient.email, // ✅ Use recipient's actual email
      toUser: recipient._id,
      creditsShared: credits,
      message: message || "",
      status: "completed",
    });

    // Deduct credits from sender
    req.user.carbon_balance -= credits;
    await req.user.save();

    // Credit recipient
    recipient.carbon_balance = (recipient.carbon_balance || 0) + credits;
    await recipient.save();

    res.status(201).json({
      message: `Successfully shared ${credits} credits with ${recipient.name}`,
      shared,
      new_balance: req.user.carbon_balance,
    });
    
  } catch (error) {
    console.error("shareCredits error:", error);
    res.status(500).json({ message: error.message });
  }
};