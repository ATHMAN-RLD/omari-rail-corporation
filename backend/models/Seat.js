const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Seat', seatSchema);  