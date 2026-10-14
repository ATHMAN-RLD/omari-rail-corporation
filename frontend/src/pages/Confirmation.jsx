import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.png';

const API_URL = 'http://localhost:5000';
const POLL_EVERY_MS = 3000;
const GIVE_UP_AFTER_MS = 120000;

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="font-semibold text-gray-900 break-words">{value || '—'}</p>
    </div>
  );
}

function Message({ title, text, children, showLink = true }) {
  return (
    <div className="min-h-[60vh] bg-gray-100 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 text-center">
        {children}
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        {text && <p className="text-gray-600 mb-6">{text}</p>}
        {showLink && (
          <Link
            to="/booking"
            className="inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Booking
          </Link>
        )}
      </div>
    </div>
  );
}

function paymentLabel(method) {
  if (method === 'mpesa') return 'M-Pesa';
  if (method === 'card') return 'Visa / Mastercard';
  return '';
}

function formatPaidAt(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function Confirmation() {
  const [searchParams] = useSearchParams();
  const ticketNumber = searchParams.get('ticket');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(Boolean(ticketNumber));
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!ticketNumber) return;

    let stopped = false;
    let timer;
    const startedAt = Date.now();

    async function checkBooking() {
      try {
        const res = await fetch(
          `${API_URL}/booking/${encodeURIComponent(ticketNumber)}`
        );

        if (stopped) return;

        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (stopped) return;

        setBooking(data);
        setLoading(false);

        if (data.status === 'pending') {
          if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
            setTimedOut(true);
          } else {
            timer = setTimeout(checkBooking, POLL_EVERY_MS);
          }
        }
      } catch (err) {
        console.error('Failed to load booking:', err);
        if (!stopped) {
          setLoadError(true);
          setLoading(false);
        }
      }
    }

    checkBooking();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [ticketNumber]);

  if (!ticketNumber) {
    return (
      <Message
        title="No ticket selected"
        text="Book a seat first, and your ticket will appear here."
      />
    );
  }

  if (loading) {
    return <Message title="Loading your ticket..." showLink={false} />;
  }

  if (notFound) {
    return (
      <Message
        title="Ticket not found"
        text="We could not find a booking with that ticket number."
      />
    );
  }

  if (loadError || !booking) {
    return (
      <Message
        title="Could not load your ticket"
        text="Check your connection and refresh the page."
        showLink={false}
      />
    );
  }

  if (booking.status === 'pending') {
    return (
      <Message
        title={timedOut ? 'Still waiting for payment' : 'Waiting for your payment'}
        text={
          timedOut
            ? 'We have not received confirmation yet. If you entered your PIN, refresh this page in a minute.'
            : 'If you are paying by M-Pesa, check your phone and enter your PIN. This page updates by itself.'
        }
        showLink={timedOut}
      >
        {!timedOut && (
          <div className="h-12 w-12 mx-auto mb-4 border-4 border-red-200 border-t-red-700 rounded-full animate-spin"></div>
        )}
      </Message>
    );
  }

  if (booking.status === 'cancelled') {
    return (
      <Message
        title="Payment not completed"
        text="Your payment did not go through, so your seat was released. You can try again."
      />
    );
  }

  return (
    <div className="min-h-[60vh] bg-gray-100 py-10 px-4">
      <div className="ticket max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-red-700 text-white px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Omari Rail Corporation logo"
              className="h-14 w-14 rounded-full bg-white object-cover"
            />
            <div>
              <p className="text-xl font-bold">Omari Rail Corporation</p>
              <p className="text-sm text-red-100">E-Ticket / Boarding Pass</p>
            </div>
          </div>
          <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
            CONFIRMED
          </span>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="mb-6">
              <Field label="Passenger" value={booking.passengerName} />
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-3xl font-bold">{booking.train.departureTime}</p>
                <p className="text-gray-600">{booking.train.departureStation}</p>
              </div>
              <div className="flex-1 flex items-center">
                <div className="flex-1 border-t-2 border-dashed border-red-300"></div>
                <span className="px-2 text-red-700 text-xl">🚆</span>
                <div className="flex-1 border-t-2 border-dashed border-red-300"></div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{booking.train.arrivalTime}</p>
                <p className="text-gray-600">{booking.train.arrivalStation}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Train" value={booking.train.name} />
              <Field label="Coach" value={booking.coachNumber} />
              <Field label="Seat" value={booking.seatNumber} />
              <Field label="Class" value={booking.coachClass} />
            </div>
          </div>

          <div className="md:border-l-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center gap-2">
            <QRCodeSVG value={booking.ticketNumber} size={140} />
            <p className="font-mono font-bold text-lg">{booking.ticketNumber}</p>
            <p className="text-xs text-gray-500">Show this code at boarding</p>
          </div>
        </div>

        <div className="bg-gray-50 border-t px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <Field label="Payment method" value={paymentLabel(booking.paymentMethod)} />
          <Field label="Payment reference" value={booking.paymentReference} />
          <Field label="Amount paid" value={`KES ${booking.amount}`} />
          <Field label="Paid on" value={formatPaidAt(booking.paidAt)} />
        </div>
      </div>

      <div className="no-print max-w-3xl mx-auto mt-6 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => window.print()}
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Print / Save as PDF
        </button>
        <Link
          to="/booking"
          className="border border-red-700 text-red-700 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold"
        >
          Book Another Ticket
        </Link>
      </div>
    </div>
  );
}

export default Confirmation; 