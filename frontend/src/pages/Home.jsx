import { Link } from 'react-router-dom';
import heroImage from '../assets/train-image.jpg';

function Home() {
  return (
    <div>
      <div
        className="h-[500px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${heroImage})`,
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold mb-4">Omari Rail Corporation</h1>
          <p className="text-xl mb-6">Travel Kenya by rail — booked in minutes</p>
          <Link
            to="/booking"
            className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded font-semibold text-lg"
          >
            Book a Ticket
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Why Ride With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Route Map', img: 'https://placehold.co/400x300/aa0000/ffffff?text=Route+Map' },
            { title: 'Onboard Comfort', img: 'https://placehold.co/400x300/aa0000/ffffff?text=Onboard+Comfort' },
            { title: 'Stations', img: 'https://placehold.co/400x300/aa0000/ffffff?text=Stations' },
            { title: 'Fares & Schedules', img: 'https://placehold.co/400x300/aa0000/ffffff?text=Fares' },
          ].map((item) => (
            <div key={item.title} className="rounded-lg overflow-hidden shadow-md">
              <img src={item.img} alt={item.title} className="w-full h-40 object-cover" />
              <p className="text-center font-semibold py-3">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-3">Personalized Service</h2>
          <p className="text-gray-600">
            Experience a journey where every detail is tailor-made for you —
            attentive staff, comfortable seating, and a smooth ride from start to finish.
          </p>
        </div>
        <img
          src="https://placehold.co/600x400/aa0000/ffffff?text=Onboard+Staff"
          alt="Onboard staff"
          className="rounded-lg shadow-md"
        />
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img
          src="https://placehold.co/600x400/aa0000/ffffff?text=Scenic+Route"
          alt="Scenic route"
          className="rounded-lg shadow-md md:order-1 order-2"
        />
        <div className="md:order-2 order-1">
          <h2 className="text-2xl font-bold mb-3">Magnificent Scenery</h2>
          <p className="text-gray-600">
            Watch Kenya's landscapes unfold outside your window — every journey
            is as much about the view as the destination.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-xl mb-2">Fast Booking</h3>
            <p className="text-gray-600">Reserve your seat online in under a minute.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2">Secure Payment</h3>
            <p className="text-gray-600">Pay with M-Pesa or your Visa/Mastercard.</p>
          </div>
          <div>
            <h3 className="font-semibold text-xl mb-2">Real Tickets</h3>
            <p className="text-gray-600">Get your coach, seat, and class instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;  