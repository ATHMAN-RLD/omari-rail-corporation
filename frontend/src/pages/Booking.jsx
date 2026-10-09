import { useState, useEffect } from 'react';
import SeatPicker from '../components/SeatPicker';
import bannerImage from '../assets/banner-train.jpg';
import pageBackground from '../assets/page-background.jpg';
import logoVideo from '../assets/omari-logo.mp4';

const destinations = [
  { name: 'Mombasa', img: 'https://placehold.co/400x300/aa0000/ffffff?text=Mombasa' },
  { name: 'Kisumu', img: 'https://placehold.co/400x300/166534/ffffff?text=Kisumu' },
  { name: 'Malindi', img: 'https://placehold.co/400x300/7f1d1d/ffffff?text=Malindi' },
  { name: 'Voi', img: 'https://placehold.co/400x300/1a1a1a/ffffff?text=Voi' },
];

function Booking() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTrainId, setOpenTrainId] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

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

      <div className="max-w-5xl mx-auto pt-12 px-4">
        <h2 className="text-2xl font-bold text-center text-white drop-shadow-lg mb-6">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {destinations.map((place) => (
            <div key={place.name} className="relative rounded-xl overflow-hidden shadow-md">
              <img src={place.img} alt={place.name} className="w-full h-36 object-cover" />
              <div
                className="absolute inset-x-0 bottom-0 p-3"
                style={{
                  backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                }}
              >
                <p className="text-white font-semibold">{place.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto pt-12 pb-32 px-4">
        <h2 className="text-2xl font-bold text-center text-white drop-shadow-lg mb-6">
          Available Trains
        </h2>
        {trains.map((train) => (
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
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t-4 border-orange-500 shadow-2xl px-6 py-4 flex justify-between items-center">
          <div>
            <p className="font-bold">
              {selectedSeat.train.name}: {selectedSeat.train.departureStation} →{' '}
              {selectedSeat.train.arrivalStation}
            </p>
            <p className="text-gray-600">
              Coach {selectedSeat.coach.coachNumber} · Seat {selectedSeat.seat.seatNumber} ·{' '}
              {selectedSeat.coach.coachClass} Class
            </p>
          </div>
          <button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold">
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
}

export default Booking; 