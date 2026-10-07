import { useState, useEffect } from 'react';

function Booking() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Train</h1>
      {trains.map((train) => (
        <div key={train._id} className="border rounded-lg p-6 mb-4 shadow-sm">
          <h2 className="text-xl font-bold">{train.name}</h2>
          <p className="text-gray-600">
            {train.departureStation} → {train.arrivalStation}
          </p>
          <p className="text-gray-600">Departs: {train.departureTime}</p>
        </div>
      ))}
    </div>
  );
}

export default Booking; 