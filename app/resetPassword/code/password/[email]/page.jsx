'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function VerifyPage() {
  const [pwd, setPwd] = useState('');
  const [Cpwd, setCPwd] = useState('');
  const [message, setMessage] = useState('');
  const [OK, setOK] = useState(false);
  const router = useRouter();

  // Get email from URL slug
  const params = useParams();
  const email = decodeURIComponent(params.email);

  // Redirect after success
  useEffect(() => {
    if (OK) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [OK, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pwd !== Cpwd) {
      setMessage('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('/api/resetpwd', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd }), // ✅ Fixed key name
      });

      const result = await response.json();

      if (response.ok) {
        setOK(true);
        setMessage(result.message);
      } else {
        setMessage(result.message || result.error || 'Something went wrong.');
      }
    } catch (err) {
      setMessage('Internal server error.');
    }
  };

  return (
    <main className="montserrat-font flex justify-center items-center min-h-[90vh] bg-gradient-to-r from-teal-400 to-blue-900 px-4">
      <div className="bg-white p-10 rounded-xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">🔐 Reset Your Password</h1>

        {OK ? (
          <p className="text-green-600 text-center text-lg font-semibold">
            🎉 {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter new password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={Cpwd}
              onChange={(e) => setCPwd(e.target.value)}
              required
              className="px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {message && (
              <div className={`text-center text-sm font-semibold ${OK ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="py-3 bg-blue-800 text-white font-semibold rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
