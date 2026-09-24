import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div
        className="h-[500px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://placehold.co/1600x800/1a1a1a/ffffff?text=Railway+Photo+Placeholder')",
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

      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Why Ride With Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
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