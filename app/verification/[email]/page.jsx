'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [registered, setRegistered] = useState(false);
  const [disabled, setDisabled] = useState(false); // ✅ new state
  const router = useRouter();
  
  // Use the useParams hook to get the email from the URL slug
  const params = useParams();
  const email = decodeURIComponent(params.email);

  useEffect(() => {
    if (registered) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [registered, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true); // ✅ disable on submit
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, email }),
      });

      const result = await response.json();

      if (response.ok) {
        setRegistered(true);
        setMessage('✅ Your account is verified!');
      } else {
        setMessage(result.error || 'Verification failed.');
        setDisabled(false); // ✅ re-enable if failed
      }
    } catch (err) {
      setMessage('Internal server error.');
      setDisabled(false); // ✅ re-enable on error
    }
  };

  return (
    <main className="montserrat-font flex justify-center items-center min-h-[90vh] bg-gradient-to-r from-teal-400 to-blue-900 px-4">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">🔐 Verify Your Email</h1>

        {registered ? (
          <p className="text-green-600 text-center text-lg font-semibold">
            🎉 {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {message && (
              <div className="text-center text-sm text-red-500 font-semibold">{message}</div>
            )}

            <button
              type="submit"
              disabled={disabled} // ✅ disable button
              className={`py-3 text-white font-semibold rounded-md transition 
                ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-700'}`}
            >
              Verify Code
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
