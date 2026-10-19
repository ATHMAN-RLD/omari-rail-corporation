import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mountainImage from '../assets/mountain.jpg';
import boardingImage from '../assets/boarding-place.jpg';

const API_URL = 'http://localhost:5000';

const values = [
  {
    icon: '🛡️',
    title: 'Safety first',
    text: 'Well-maintained trains and trained crews on every journey.',
  },
  {
    icon: '⏱️',
    title: 'On time',
    text: 'Clear schedules with departure and arrival times you can plan around.',
  },
  {
    icon: '💺',
    title: 'Comfort',
    text: 'Economy and First Class coaches with a seat reserved just for you.',
  },
  {
    icon: '📱',
    title: 'Easy booking',
    text: 'Pick your seat, pay with M-Pesa and print your ticket in minutes.',
  },
];

function Stat({ value, label }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      <p className="text-4xl font-bold text-red-700">{value}</p>
      <p className="text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function About() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/trains`)
      .then((res) => res.json())
      .then((trains) => {
        const stations = new Set();
        let seats = 0;

        trains.forEach((train) => {
          stations.add(train.departureStation);
          stations.add(train.arrivalStation);
          train.coaches.forEach((coach) => {
            seats += coach.seats.length;
          });
        });

        setStats({ trains: trains.length, stations: stations.size, seats });
      })
      .catch((err) => console.error('Failed to load network numbers:', err));
  }, []);

  return (
    <div className="bg-gray-100">
      <div
        className="h-72 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(127,29,29,0.65), rgba(0,0,0,0.55)), url(${mountainImage})`,
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold mb-3">About Omari Rail Corporation</h1>
          <p className="text-xl">Connecting Kenya, one journey at a time</p>
        </div>
      </div>

      <div className="h-2 bg-orange-500"></div>

      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our story</h2>
          <p className="text-gray-700 mb-4">
            Omari Rail Corporation was created around one idea: travelling by train in
            Kenya should be simple, comfortable and fair. From choosing your seat to
            paying with M-Pesa to holding a printable ticket, every step is designed to
            take minutes, not queues.
          </p>
          <p className="text-gray-700">
            Our trains link Nairobi with Mombasa, Kisumu, Malindi and Voi, passing some
            of the most beautiful scenery in East Africa.
          </p>
        </div>
        <img
          src={boardingImage}
          alt="Passengers boarding a train"
          className="rounded-2xl shadow-lg w-full h-80 object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-700">
          <h2 className="text-2xl font-bold mb-3">Our mission</h2>
          <p className="text-gray-700">
            To make rail travel in Kenya simple, safe and affordable for everyone, with
            booking and payment that take minutes.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-orange-500">
          <h2 className="text-2xl font-bold mb-3">Our vision</h2>
          <p className="text-gray-700">
            A Kenya where every town is a comfortable train ride away.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our network in numbers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Stat value={stats ? stats.trains : '—'} label="Trains in service" />
          <Stat value={stats ? stats.stations : '—'} label="Stations served" />
          <Stat value={stats ? stats.seats : '—'} label="Seats on offer" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-8">What we stand for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <p className="text-4xl mb-3">{item.icon}</p>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-700 text-white py-14 px-4 text-center">
        <h2 className="text-3xl font-bold mb-3">Ready for your next journey?</h2>
        <p className="text-red-100 mb-6">
          Choose your train, pick your seat and be on your way in minutes.
        </p>
        <Link
          to="/booking"
          className="inline-block bg-white text-red-700 hover:bg-red-50 font-bold px-8 py-3 rounded-lg"
        >
          Book a Ticket
        </Link>
      </div>
    </div>
  );
}

export default About;  