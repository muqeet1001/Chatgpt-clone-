require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');

const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;