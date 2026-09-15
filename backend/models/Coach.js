const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true,
  },
  coachNumber: {
    type: String,
    required: true,
  },
  coachClass: {
    type: String,
    enum: ['Economy', 'First'],
    required: true,
  },
});

module.exports = mongoose.model('Coach', coachSchema);  