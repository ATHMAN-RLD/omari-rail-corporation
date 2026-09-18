require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Train = require('./models/Train');
const Coach = require('./models/Coach');
const Seat = require('./models/Seat');
const Booking = require('./models/Booking');
const { initiateSTKPush } = require('./utils/mpesa');

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
    const { seatId, passengerName, phoneNumber, amount } = req.body;

    if (!seatId || !passengerName || !phoneNumber || !amount) {
      return res.status(400).json({
        error: 'seatId, passengerName, phoneNumber, and amount are required',
      });
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
      status: 'pending',
    });

    try {
      const stkResponse = await initiateSTKPush(phoneNumber, amount, ticketNumber);
      booking.checkoutRequestId = stkResponse.CheckoutRequestID;
      await booking.save();

      res.status(201).json({
        message: 'Payment prompt sent. Check your phone to complete payment.',
        ticketNumber: booking.ticketNumber,
        status: booking.status,
      });
    } catch (stkError) {
      seat.isBooked = false;
      await seat.save();
      await Booking.findByIdAndDelete(booking._id);

      res.status(502).json({
        error: 'Failed to initiate M-Pesa payment',
        details: stkError.response?.data,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/mpesa-callback', async (req, res) => {
  try {
    const callback = req.body.Body.stkCallback;
    const checkoutRequestId = callback.CheckoutRequestID;
    const resultCode = callback.ResultCode;

    const booking = await Booking.findOne({ checkoutRequestId });

    if (!booking) {
      console.log('No matching booking found for', checkoutRequestId);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    if (resultCode === 0) {
      booking.status = 'confirmed';
      await booking.save();
      console.log(`Booking ${booking.ticketNumber} confirmed via M-Pesa`);
    } else {
      booking.status = 'cancelled';
      await booking.save();
      await Seat.findByIdAndUpdate(booking.seat, { isBooked: false });
      console.log(`Booking ${booking.ticketNumber} cancelled — payment failed or was cancelled`);
    }

    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('Callback handling error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});  