import { useState, useEffect } from 'react';
import SeatPicker from '../components/SeatPicker';
import PaymentModal from '../components/PaymentModal';
import { destinations } from '../images';
import bannerImage from '../assets/banner-train.jpg';
import pageBackground from '../assets/page-background.jpg';
import logoVideo from '../assets/omari-logo.mp4';

function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Booking() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [searched, setSearched] = useState(false);
  const [formError, setFormError] = useState('');
  const [openTrainId, setOpenTrainId] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/trains')
      .then((res) => res.json())
      .then((data) => {
        setTrains(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch trains:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center py-16 text-xl">Loading trains...</p>;
  }

  const today = new Date().toLocaleDateString('en-CA');
  const fromOptions = [...new Set(trains.map((t) => t.departureStation))];
  const toOptions = [
    ...new Set(
      trains
        .filter((t) => !from || t.departureStation === from)
        .map((t) => t.arrivalStation)
    ),
  ];
  const visibleTrains = searched
    ? trains.filter((t) => t.departureStation === from && t.arrivalStation === to)
    : trains;

  function handleFromChange(e) {
    setFrom(e.target.value);
    setTo('');
    setSearched(false);
  }

  function handleTileClick(name) {
    if (fromOptions.includes(name)) {
      setFrom(name);
    } else {
      setTo(name);
    }
    setSearched(false);
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!from || !to || !date) {
      setFormError(
        'Please choose where you are travelling from, where to, and your departure date.'
      );
      return;
    }
    setFormError('');
    setOpenTrainId(null);
    setSelectedSeat(null);
    setSearched(true);
  }

  function handleClear() {
    setFrom('');
    setTo('');
    setDate('');
    setFormError('');
    setSearched(false);
    setOpenTrainId(null);
    setSelectedSeat(null);
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: '#1a1a1a',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${pageBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className="min-h-[14rem] py-8 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(127,29,29,0.6), rgba(0,0,0,0.5)), url(${bannerImage})`,
        }}
      >
        <div className="text-center px-4 flex flex-col items-center">
          <video
            src={logoVideo}
            autoPlay
            loop
            muted
            playsInline
            className="h-36 w-auto mb-3 rounded-xl shadow-lg"
          />
          <h1 className="text-4xl font-bold mb-2">Choose Your Train</h1>
          <p className="text-lg">Pick a destination and travel Kenya by rail</p>
        </div>
      </div>

      <div className="h-2 bg-orange-500"></div>

      <div className="max-w-5xl mx-auto px-4 pt-10">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-xl p-6 border-t-4 border-red-700"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Omari Rail Corporation: Online Booking
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
                From
              </span>
              <select
                value={from}
                onChange={handleFromChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 bg-white"
              >
                <option value="">Select...</option>
                {fromOptions.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
                To
              </span>
              <select
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setSearched(false);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 bg-white"
              >
                <option value="">Select...</option>
                {toOptions.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
                Departure Date
              </span>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSearched(false);
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 bg-white"
              />
            </label>

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg"
            >
              Search Trains
            </button>
          </div>

          {formError && <p className="mt-3 text-red-700 font-semibold">{formError}</p>}
        </form>
      </div>

      <div className="max-w-5xl mx-auto pt-12 px-4">
        <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg mb-8">
          Popular Destinations
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {destinations.map((place) => (
            <button
              type="button"
              key={place.name}
              onClick={() => handleTileClick(place.name)}
              className="relative w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)] rounded-2xl overflow-hidden border-4 border-white shadow-2xl text-left hover:scale-105 transition"
            >
              <img
                src={place.img}
                alt={place.name}
                className="w-full h-60 sm:h-64 lg:h-72 object-cover"
              />
              <div
                className="absolute inset-x-0 bottom-0 p-4"
                style={{
                  backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                }}
              >
                <p className="text-white text-xl font-bold">{place.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-12 pb-32 px-4">
        <div className="mb-6 text-center text-white drop-shadow-lg">
          <h2 className="text-2xl font-bold">
            {searched ? `${from} → ${to}` : 'Available Trains'}
          </h2>
          {searched && (
            <>
              <p className="mt-1">{formatDate(date)}</p>
              <button
                type="button"
                onClick={handleClear}
                className="mt-2 underline hover:text-orange-300"
              >
                Show all trains
              </button>
            </>
          )}
        </div>

        {visibleTrains.length === 0 && (
          <p className="text-center text-white text-lg drop-shadow-lg">
            No trains run on this route yet. Try another destination.
          </p>
        )}

        {visibleTrains.map((train) => (
          <div
            key={train._id}
            className="bg-white rounded-xl shadow-md border-l-8 border-red-700 p-6 mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{train.name}</h2>
              <span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full">
                {train.trainNumber}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-2xl font-bold">{train.departureTime}</p>
                <p className="text-gray-600">{train.departureStation}</p>
              </div>

              <div className="relative flex-1 h-10">
                <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-red-300"></div>
                <div className="train-trail absolute left-0 top-1/2 h-0.5 -mt-px bg-red-600"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-700"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-700"></div>
                <span className="moving-train text-2xl">🚆</span>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold">{train.arrivalTime}</p>
                <p className="text-gray-600">{train.arrivalStation}</p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() =>
                  setOpenTrainId(openTrainId === train._id ? null : train._id)
                }
                className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-lg font-semibold"
              >
                {openTrainId === train._id ? 'Hide Seats' : 'Select Seats'}
              </button>
            </div>

            {openTrainId === train._id && (
              <SeatPicker
                train={train}
                selectedSeat={selectedSeat}
                onSelect={setSelectedSeat}
              />
            )}
          </div>
        ))}
      </div>

      {selectedSeat && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t-4 border-orange-500 shadow-2xl px-6 py-4 flex justify-between items-center gap-4">
          <div>
            <p className="font-bold">
              {selectedSeat.train.name}: {selectedSeat.train.departureStation} →{' '}
              {selectedSeat.train.arrivalStation}
            </p>
            <p className="text-gray-600">
              {date && `${formatDate(date)} · `}Coach {selectedSeat.coach.coachNumber} ·
              Seat {selectedSeat.seat.seatNumber} · {selectedSeat.coach.coachClass} Class
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-2xl font-bold text-red-700">
              KES {selectedSeat.coach.fare}
            </p>
            <button
              onClick={() => setShowPayment(true)}
              className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {showPayment && selectedSeat && (
        <PaymentModal
          selection={selectedSeat}
          travelDate={date ? formatDate(date) : ''}
          onClose={() => setShowPayment(false)}
        />
      )}
    </div>
  );
}

export default Booking;