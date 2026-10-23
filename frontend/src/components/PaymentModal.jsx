import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000';

function PaymentModal({ selection, travelDate, onClose }) {
  const { train, coach, seat } = selection;
  const navigate = useNavigate();

  const [passengerName, setPassengerName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seatId: seat._id,
          passengerName: passengerName.trim(),
          phoneNumber: phone,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      navigate(`/confirmation?ticket=${data.ticketNumber}`);
    } catch (err) {
      console.error('Booking request failed:', err);
      setError('Could not reach the server. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="bg-red-700 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-xl font-bold">Complete Your Booking</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-3xl leading-none hover:text-red-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-5 text-sm">
            <p className="font-bold text-base">{train.name}</p>
            <p className="text-gray-600">
              {train.departureStation} {train.departureTime} → {train.arrivalStation}{' '}
              {train.arrivalTime}
            </p>
            <p className="text-gray-600">
              {travelDate && `${travelDate} · `}Coach {coach.coachNumber} · Seat{' '}
              {seat.seatNumber} · {coach.coachClass} Class
            </p>
            <p className="mt-2 text-lg font-bold text-red-700">Total: KES {coach.fare}</p>
          </div>

          <div className="border-2 border-green-600 bg-green-50 text-green-800 rounded-lg py-3 text-center font-semibold mb-5">
            Pay with M-Pesa
          </div>

          <label className="block mb-4">
            <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
              Passenger full name
            </span>
            <input
              type="text"
              required
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3"
            />
          </label>

          <label className="block mb-2">
            <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
              M-Pesa phone number
            </span>
            <input
              type="tel"
              inputMode="tel"
              required
              placeholder="0712 345 678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3"
            />
          </label>

          <p className="text-sm text-gray-500 mb-4">
            You will get a prompt on your phone to enter your M-Pesa PIN.
          </p>

          {error && <p className="mb-4 text-red-700 font-semibold">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg font-bold"
            >
              {submitting ? 'Processing...' : `Pay KES ${coach.fare} with M-Pesa`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal; 