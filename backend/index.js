require('dotenv').config();
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Train = require('./models/Train');
const Coach = require('./models/Coach');
const Seat = require('./models/Seat');
const Booking = require('./models/Booking');
const { initiateSTKPush } = require('./utils/mpesa');

const app = express();
const PORT = 5000;

// Sandbox test fares in KES. Put real prices here before launch.
const FARES = { Economy: 1, First: 2 };

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

function generateTicketNumber() {
  return `OMR-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

function normalizePhone(input) {
  const digits = String(input).replace(/\D/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
    return `254${digits}`;
  }
  return null;
}

app.get('/', (req, res) => {
  res.send('Omari Rail Corporation API is running');
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
            return {
              ...coach.toObject(),
              fare: FARES[coach.coachClass],
              seats,
            };
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

app.get('/booking/:ticketNumber', async (req, res) => {
  try {
    const booking = await Booking.findOne({ ticketNumber: req.params.ticketNumber })
      .populate('train')
      .populate('coach')
      .populate('seat');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      ticketNumber: booking.ticketNumber,
      status: booking.status,
      passengerName: booking.passengerName,
      amount: FARES[booking.coach.coachClass],
      paymentMethod: booking.paymentMethod,
      paymentReference: booking.paymentReference,
      paidAt: booking.paidAt,
      train: {
        name: booking.train.name,
        trainNumber: booking.train.trainNumber,
        departureStation: booking.train.departureStation,
        arrivalStation: booking.train.arrivalStation,
        departureTime: booking.train.departureTime,
        arrivalTime: booking.train.arrivalTime,
      },
      coachNumber: booking.coach.coachNumber,
      coachClass: booking.coach.coachClass,
      seatNumber: booking.seat.seatNumber,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/book', async (req, res) => {
  try {
    const { seatId, passengerName, phoneNumber } = req.body;

    if (!seatId || !passengerName || !phoneNumber) {
      return res.status(400).json({
        error: 'seatId, passengerName, and phoneNumber are required',
      });
    }

    if (!mongoose.isValidObjectId(seatId)) {
      return res.status(400).json({ error: 'Invalid seatId' });
    }

    const phone = normalizePhone(phoneNumber);
    if (!phone) {
      return res.status(400).json({
        error: 'Enter a valid Safaricom number, e.g. 0712345678',
      });
    }

    const seat = await Seat.findOneAndUpdate(
      { _id: seatId, isBooked: false },
      { isBooked: true },
      { returnDocument: 'after' }
    );

    if (!seat) {
      return res.status(409).json({ error: 'Seat is already booked or does not exist' });
    }

    const coach = await Coach.findById(seat.coach);
    const amount = FARES[coach.coachClass];
    const ticketNumber = generateTicketNumber();

    const booking = await Booking.create({
      train: coach.train,
      coach: coach._id,
      seat: seat._id,
      passengerName,
      ticketNumber,
      status: 'pending',
      paymentMethod: 'mpesa',
    });

    try {
      const stkResponse = await initiateSTKPush(phone, amount, ticketNumber);
      booking.checkoutRequestId = stkResponse.CheckoutRequestID;
      await booking.save();

      res.status(201).json({
        message: 'Payment prompt sent. Check your phone to complete payment.',
        ticketNumber: booking.ticketNumber,
        amount,
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

    if (!booking || booking.status !== 'pending') {
      console.log('Ignoring callback for', checkoutRequestId);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    if (resultCode === 0) {
      const items = callback.CallbackMetadata?.Item || [];
      const receipt = items.find((item) => item.Name === 'MpesaReceiptNumber')?.Value;

      booking.status = 'confirmed';
      booking.paidAt = new Date();
      if (receipt) booking.paymentReference = String(receipt);
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