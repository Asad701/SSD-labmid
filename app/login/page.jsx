'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [disabled, setDisabled] = useState(false) // ✅ new state

  // SUBMIT LOGIN FORM  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setDisabled(true) // ✅ disable immediately
    try {
      const response = await fetch('/api/login?user=user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      const result = await response.json()
      if (response.ok) {
        window.location.href = '/'
      } else {
        setMessage(result.message || 'Login failed')
        setDisabled(false) // ✅ re-enable if login fails
      }
    } catch (err) {
      setMessage('Server error. Please try again later.')
      setDisabled(false) // ✅ re-enable if server error
    }
  }

  return (
    <main className="montserrat-font flex justify-center w-full items-center min-h-[70vh] py-16 px-4 bg-gradient-to-r from-teal-500 to-blue-700">
      <div className="montserrat-font bg-white p-8 w-[80%] rounded-2xl shadow-lg max-w-md text-center">
        <h1 className="montserrat-font text-3xl font-bold text-gray-800 mb-6">🔐 Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="montserrat-font px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="montserrat-font px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {message && <p className="text-red-600 text-sm -mt-2">{message}</p>}
          <p className="montserrat-font mt-4 text-sm text-gray-600">
            Forget password{' '}
            <Link href="/resetPassword" className="montserrat-font text-blue-800 hover:underline font-medium hover:text-red-600">
              Click here
            </Link>
          </p>
          <button
            type="submit"
            disabled={disabled} // ✅ disable button
            className={`montserrat-font py-3 bg-gray-900 text-white font-semibold rounded-md transition 
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
          >
            Login
          </button>
        </form>
        <p className="montserrat-font mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="montserrat-font text-blue-800 hover:underline font-medium hover:text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </main>
  )
}
