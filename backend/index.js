require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Train = require('./models/Train');

const app = express();
const PORT = 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Omari Rail Corporation API is running');
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});  