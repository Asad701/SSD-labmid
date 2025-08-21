'use client'

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [verified, setVerified] = useState(false);
  const [disabled, setDisabled] = useState(false); // ✅ disable state
  const router = useRouter();
  
  // Get email from URL slug
  const params = useParams();
  const email = decodeURIComponent(params.email);

  // Redirect after verification
  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => {
        router.push(`/resetPassword/code/password/${email}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [verified, router, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true); // ✅ disable button while request is in progress
    setMessage(''); // clear previous messages

    try {
      const response = await fetch('/api/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, email }),
      });

      const result = await response.json();

      if (response.ok) {
        setVerified(true);
        setMessage('✅ Your account is verified!');
      } else {
        setMessage(result.error || 'Verification failed.');
        setDisabled(false); // ✅ re-enable button if verification fails
      }
    } catch (err) {
      setMessage('Internal server error.');
      setDisabled(false); // ✅ re-enable button on error
    }
  };

  return (
    <main className="montserrat-font flex justify-center items-center min-h-[90vh] bg-gradient-to-r from-teal-400 to-blue-900 px-4">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">🔐 Verify Your Email</h1>

        {verified ? (
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
              <div className={`text-center text-sm font-semibold ${verified ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={disabled} // ✅ disable during request
              className={`py-3 font-semibold rounded-md transition 
                ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-800 text-white hover:bg-blue-700'}`}
            >
              {disabled ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
