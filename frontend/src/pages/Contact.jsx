import { useState } from 'react';
import mombasaImage from '../assets/mombasa.jpg';

// EDIT THESE with your real details. The X values are deliberate placeholders.
const PHONE_DISPLAY = '07XX XXX XXX';
const PHONE_LINK = '+2547XXXXXXXX';
const WHATSAPP_NUMBER = '2547XXXXXXXX';
const EMAIL = 'info@omarirail.co.ke';
const INSTAGRAM_URL = 'https://www.instagram.com/';
const ADDRESS = 'Omari Rail Terminus, Nairobi, Kenya';
const HOURS = 'Every day, 6:00 AM to 10:00 PM';

const topics = ['General question', 'Booking help', 'Payment problem', 'Lost ticket'];

const infoCards = [
  { icon: '📞', title: 'Call us', detail: PHONE_DISPLAY, href: `tel:${PHONE_LINK}` },
  { icon: '✉️', title: 'Email us', detail: EMAIL, href: `mailto:${EMAIL}` },
  { icon: '📍', title: 'Visit us', detail: ADDRESS },
  { icon: '🕒', title: 'Opening hours', detail: HOURS },
];

const faqs = [
  {
    question: 'How do I get my ticket after paying?',
    answer:
      'As soon as your payment is confirmed, your ticket appears on the confirmation page. Use the Print / Save as PDF button, and keep your ticket number, which starts with OMR-.',
  },
  {
    question: 'Which payment methods do you accept?',
   answer: 'You can pay with M-Pesa. Card payments are coming soon.',
  },
  {
    question: 'I closed the page. How do I find my ticket?',
    answer:
      'Send us a WhatsApp message with your full name and your M-Pesa receipt number, and we will help you recover your ticket.',
  },
  {
    question: 'Can I change or cancel my booking?',
    answer:
      'Contact us on WhatsApp with your ticket number and we will help you as soon as we can.',
  },
];

const cardClass =
  'bg-white rounded-2xl shadow-lg p-6 text-center block hover:shadow-xl transition';
const fieldClass =
  'w-full border border-gray-300 rounded-lg px-3 py-3 bg-white focus:border-red-600';

function Contact() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState(topics[0]);
  const [ticket, setTicket] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const lines = [`Hello Omari Rail, my name is ${name.trim()}.`, `Topic: ${topic}`];
    if (ticket.trim()) {
      lines.push(`Ticket number: ${ticket.trim()}`);
    }
    lines.push('', message.trim());

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="bg-gray-100">
      <div
        className="h-72 bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(127,29,29,0.65), rgba(0,0,0,0.55)), url(${mombasaImage})`,
        }}
      >
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold mb-3">Contact Us</h1>
          <p className="text-xl">We are here to help you travel with confidence</p>
        </div>
      </div>

      <div className="h-2 bg-orange-500"></div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoCards.map((card) => {
            const content = (
              <>
                <p className="text-4xl mb-3">{card.icon}</p>
                <h2 className="font-bold text-lg mb-1">{card.title}</h2>
                <p className="text-gray-600 break-words">{card.detail}</p>
              </>
            );

            return card.href ? (
              <a key={card.title} href={card.href} className={cardClass}>
                {content}
              </a>
            ) : (
              <div key={card.title} className={cardClass}>
                {content}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border-t-4 border-red-700"
        >
          <h2 className="text-2xl font-bold mb-1">Send us a message</h2>
          <p className="text-gray-600 mb-6">
            Fill in the form and we will open WhatsApp with your message ready to send.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
                Your name
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
                Topic
              </span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={fieldClass}
              >
                {topics.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block mb-4">
            <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
              Ticket number (optional)
            </span>
            <input
              type="text"
              placeholder="OMR-XXXXXXXX"
              value={ticket}
              onChange={(e) => setTicket(e.target.value)}
              className={fieldClass}
            />
          </label>

          <label className="block mb-6">
            <span className="block text-xs font-bold uppercase tracking-wide text-gray-600 mb-1">
              Message
            </span>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={fieldClass}
            ></textarea>
          </label>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg"
          >
            Send on WhatsApp
          </button>
        </form>

        <aside className="bg-red-700 text-white rounded-2xl shadow-lg p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">Prefer to chat?</h2>
          <p className="text-red-100 mb-6">
            Message us straight away, or follow Omari Rail for news about new routes and
            offers.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-bold text-center px-6 py-3 rounded-lg mb-3"
          >
            💬 Chat on WhatsApp
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-red-50 text-red-700 font-bold text-center px-6 py-3 rounded-lg"
          >
            📸 Follow on Instagram
          </a>
        </aside>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-3xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details key={item.question} className="bg-white rounded-xl shadow p-5">
              <summary className="font-semibold cursor-pointer">{item.question}</summary>
              <p className="mt-3 text-gray-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;  