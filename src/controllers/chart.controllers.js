const ChartModel = require("../models/chart.model");

async function createChart(req, res) {
  const { title } = req.body;
  const user = req.user;
  const chat = new ChartModel({
    user: user._id,
    title: title,
  });
  try {
    const savedChart = await chat.save();
    console.log(user.fullName);
    
    res
      .status(201)
      .json({ message: "Chart created successfully", chart: savedChart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { createChart: createChart };
