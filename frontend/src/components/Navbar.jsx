import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {
  return (
    <nav className="bg-red-700 text-white px-6 py-3 flex justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center gap-4">
        <div className="h-24 w-24 rounded-full overflow-hidden bg-white shadow-md flex-shrink-0">
          <img
            src={logo}
            alt="Omari Rail Corporation logo"
            className="h-full w-full object-cover"
          />
        </div>
        <span className="font-bold text-2xl">Omari Rail Corporation</span>
      </Link>
      <div className="flex gap-6 text-lg">
        <Link to="/" className="hover:text-red-200">Home</Link>
        <Link to="/booking" className="hover:text-red-200">Book a Ticket</Link>
        <Link to="/about" className="hover:text-red-200">About</Link>
        <Link to="/contact" className="hover:text-red-200">Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar; 