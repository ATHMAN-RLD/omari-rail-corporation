import { Link } from 'react-router-dom';
import heroImage from '../assets/train-image.jpg';
import { featureCards, sectionImages, stepImages } from '../images';

const steps = [
  {
    title: 'Fast Booking',
    text: 'Reserve your seat online in under a minute.',
    img: stepImages.fastBooking,
  },
  {
    title: 'Secure Payment',
    text: 'Pay securely with M-Pesa.',
    img: stepImages.securePayment,
  },
  {
    title: 'Real Tickets',
    text: 'Get your coach, seat, and class instantly.',
    img: stepImages.realTickets,
  },
];

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
          {featureCards.map((item) => (
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
          src={sectionImages.onboardStaff}
          alt="Onboard staff"
          className="rounded-lg shadow-md w-full h-72 object-cover"
        />
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <img
          src={sectionImages.scenicRoute}
          alt="Scenic route"
          className="rounded-lg shadow-md w-full h-72 object-cover md:order-1 order-2"
        />
        <div className="md:order-2 order-1">
          <h2 className="text-2xl font-bold mb-3">Magnificent Scenery</h2>
          <p className="text-gray-600">
            Watch Kenya's landscapes unfold outside your window — every journey
            is as much about the view as the destination.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.title} className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <img src={step.img} alt={step.title} className="w-full h-52 object-cover" />
              <div className="p-6 text-center">
                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;  