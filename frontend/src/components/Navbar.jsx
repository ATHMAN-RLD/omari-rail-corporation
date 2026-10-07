import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-red-700 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-3">
        <div className="bg-white text-red-700 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
          OR
        </div>
        <span className="font-bold text-xl">Omari Rail Corporation</span>
      </Link>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-red-200">Home</Link>
        <Link to="/booking" className="hover:text-red-200">Book a Ticket</Link>
        <Link to="/about" className="hover:text-red-200">About</Link>
        <Link to="/contact" className="hover:text-red-200">Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar; 