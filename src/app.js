require('dotenv').config();

// src/app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const authRoutes = require('./routes/auth.route');
const bcrypt = require('bcrypt');
const chartRoutes = require('./routes/chart.route');
const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/charts', chartRoutes);

module.exports = app;