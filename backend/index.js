require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Train = require('./models/Train');
const Coach = require('./models/Coach');
const Seat = require('./models/Seat');
const Booking = require('./models/Booking');

const app = express();
const PORT = 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Omari Rail Corporation API is running');
});

app.get('/seed-coaches-seats', async (req, res) => {
  try {
    const train = await Train.findOne({ trainNumber: 'NR001' });
    if (!train) {
      return res.status(404).json({ error: 'Train not found. Run /seed-train first.' });
    }

    const coach1 = await Coach.create({
      train: train._id,
      coachNumber: 'A1',
      coachClass: 'Economy',
    });

    const coach2 = await Coach.create({
      train: train._id,
      coachNumber: 'B1',
      coachClass: 'First',
    });

    const seatsForCoach1 = await Seat.create([
      { coach: coach1._id, seatNumber: '1' },
      { coach: coach1._id, seatNumber: '2' },
      { coach: coach1._id, seatNumber: '3' },
    ]);

    const seatsForCoach2 = await Seat.create([
      { coach: coach2._id, seatNumber: '1' },
      { coach: coach2._id, seatNumber: '2' },
    ]);

    res.json({ train, coaches: [coach1, coach2], seats: [...seatsForCoach1, ...seatsForCoach2] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/trains', async (req, res) => {
  try {
    const trains = await Train.find();
    const trainsWithCoaches = await Promise.all(
      trains.map(async (train) => {
        const coaches = await Coach.find({ train: train._id });
        const coachesWithSeats = await Promise.all(
          coaches.map(async (coach) => {
            const seats = await Seat.find({ coach: coach._id });
            return { ...coach.toObject(), seats };
          })
        );
        return { ...train.toObject(), coaches: coachesWithSeats };
      })
    );
    res.json(trainsWithCoaches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/book', async (req, res) => {
  try {
    const { seatId, passengerName } = req.body;

    if (!seatId || !passengerName) {
      return res.status(400).json({ error: 'seatId and passengerName are required' });
    }

    const seat = await Seat.findOneAndUpdate(
      { _id: seatId, isBooked: false },
      { isBooked: true },
      { new: true }
    );

    if (!seat) {
      return res.status(409).json({ error: 'Seat is already booked or does not exist' });
    }

    const coach = await Coach.findById(seat.coach);
    const ticketNumber = `OMR-${Date.now()}`;

    const booking = await Booking.create({
      train: coach.train,
      coach: coach._id,
      seat: seat._id,
      passengerName,
      ticketNumber,
      status: 'confirmed',
    });

    res.status(201).json({
      ticketNumber: booking.ticketNumber,
      passengerName: booking.passengerName,
      coachNumber: coach.coachNumber,
      coachClass: coach.coachClass,
      seatNumber: seat.seatNumber,
      status: booking.status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});  