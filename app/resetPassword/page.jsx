'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [OK, setOK] = useState(false);
  const [disabled, setDisabled] = useState(false); // ✅ new state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true); // ✅ disable button after click
    try {
      const response = await fetch('/api/resetpwd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setOK(true);
        setMessage('✅ Code Sent to your Email !');
      } else {
        setMessage(result.message);
        setDisabled(false); // ✅ re-enable if failed
      }
    } catch (err) {
      setMessage('Internal server error.');
      setDisabled(false); // ✅ re-enable on error
    }
  };

  useEffect(() => {
    if (OK) {
      const timer = setTimeout(() => {
        router.push(`resetPassword/code/${email}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [OK, router, email]);

  return (
    <main className="montserrat-font flex justify-center items-center min-h-[90vh] bg-gradient-to-r from-teal-400 to-blue-900 px-4">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">🔐 Verify Your Email</h1>

        {OK ? (
          <p className="text-green-600 text-center text-lg font-semibold">
            🎉 {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {message && (
              <div className="text-center text-sm text-red-500 font-semibold">{message}</div>
            )}

            <button
              type="submit"
              disabled={disabled} // ✅ disable button here
              className={`py-3 text-white font-semibold rounded-md transition 
                ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-700'}`}
            >
              Submit
            </button>
            {disabled && <span className="text-sm text-green-500">Sending...</span>}

          </form>
        )}
      </div>
    </main>
  );
}
