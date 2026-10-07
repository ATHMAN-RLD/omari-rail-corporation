function Footer() {
  return (
    <footer className="bg-red-900 text-white mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-3">About Omari Rail Corporation</h3>
          <p className="text-red-100 text-sm">
            Connecting Kenya by rail with fast, secure, and comfortable travel —
            book your journey in minutes.
          </p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">Connect With Us</h3>
          <p className="text-red-100 text-sm">0712 345 678</p>
          <p className="text-red-100 text-sm">info@omarirail.co.ke</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-3">Quick Links</h3>
          <ul className="text-red-100 text-sm space-y-1">
            <li><a href="/booking" className="hover:text-white">Book a Ticket</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-red-800 py-4 flex justify-center items-center gap-3">
        <div className="bg-white text-red-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
          OR
        </div>
        <p className="text-red-200 text-sm">© 2026 Omari Rail Corporation</p>
      </div>
    </footer>
  );
}

export default Footer; 