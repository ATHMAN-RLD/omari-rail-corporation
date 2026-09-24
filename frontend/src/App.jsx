import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Confirmation from './pages/Confirmation';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 