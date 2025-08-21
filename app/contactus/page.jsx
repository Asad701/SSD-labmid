'use client';
import { useState } from 'react';
import Loading from '../components/Loading';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ disable button by setting loading true

    try {
      const res = await fetch('/api/contactUs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('Thank you to contact Us');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus(data.status);
      }
    } catch (err) {
      setStatus('internal server error');
    } finally {
      setLoading(false); // ✅ re-enable button after request completes
    }
  };

  if (loading) {
    return (
      <div className="w-full h-auto p-4 z-40 bg-black flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Contact Us</h2>
        {status && <h2 className="text-center text-md text-green-600 mt-2">{status}</h2>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleNameChange}
              required
              className="mt-1 w-full border border-gray-300 bg-blue-100 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
              className="mt-1 w-full border border-gray-300 bg-blue-100 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              rows="4"
              value={message}
              onChange={handleMessageChange}
              required
              className="mt-1 w-full border border-gray-300 bg-blue-100 rounded-md px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading} // ✅ disable while submitting
            className={`w-full py-2 px-4 rounded text-white transition 
              ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
