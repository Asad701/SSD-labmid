'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [APIkey, setAPIkey] = useState('')
  const [disabled, setDisabled] = useState(false) // ✅ only for disabling button

  const handleSubmit = async (e) => {
    e.preventDefault()
    setDisabled(true) // ✅ disable button immediately
    setError('')

    try {
      const response = await fetch(`/api/admin?apikey=${APIkey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      const result = await response.json()
      if (response.ok) {
        window.location.href = '/addProducts'
      } else {
        setError(result.message || 'Login failed')
        setDisabled(false) // ✅ re-enable if login failed
      }
    } catch (err) {
      setError('Server error. Please try again later.')
      setDisabled(false) // ✅ re-enable on error
    }
  }

  return (
    <main className="flex justify-center w-full items-center min-h-[70vh] h-screen py-16 px-4 bg-gradient-to-r from-teal-500 to-blue-700">
      <div className="bg-white p-10 w-[90%] rounded-2xl shadow-lg  max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🔐 Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter User-Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="montserrat-font px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="montserrat-font  px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Enter API Key"
            value={APIkey}
            onChange={(e) => setAPIkey(e.target.value)}
            required
            className="montserrat-font  px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-600 text-sm -mt-2">{error}</p>}
          <button
            type="submit"
            disabled={disabled} // ✅ disable here
            className={`montserrat-font py-3 font-semibold rounded-md transition 
              ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          >
            Login
          </button>
        </form>
      </div>
    </main>
  )
}
