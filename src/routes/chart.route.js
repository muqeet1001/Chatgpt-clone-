const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth.middleware");
const { createChart } = require("../controllers/chart.controllers");

router.post("/", authenticateToken, createChart);

module.exports = router;
