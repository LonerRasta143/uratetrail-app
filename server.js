const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

