const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  trainNumber: {
    type: String,
    required: true,
    unique: true,
  },
  departureStation: {
    type: String,
    required: true,
  },
  arrivalStation: {
    type: String,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Train', trainSchema);  