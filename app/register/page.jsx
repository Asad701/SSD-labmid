'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country , setCountry] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [disabled, setDisabled] = useState(false) // ✅ new state
  const router = useRouter()

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!')
      return
    }
    setDisabled(true) // ✅ disable button when clicked
    try {
      const response = await fetch('/api/tempregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({fname,lname, email, password ,country}) 
      })
      const result = await response.json()
      if (response.ok) {
        window.location.href = `/login`
      } else {
        setMessage(result.message)
        setDisabled(false) // ✅ re-enable if failed
      }
    } catch (err) {
      setMessage('Internal server Error')
      setDisabled(false) // ✅ re-enable if error
    }
  }

  return (
    <main className=" p-4 montserrat-font flex justify-center items-center min-h-[90vh] bg-gradient-to-r from-teal-400 to-blue-900 px-4">
      <div className="montserrat-font bg-white p-10 rounded-xl w-[70%] py-4 shadow-2xl w-full max-w-md">
        <h1 className="montserrat-font text-3xl font-bold text-gray-800 text-center mb-6">📝 Register</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              required
              className="montserrat-font px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              required
              className="montserrat-font px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="montserrat-font px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
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
            <input
              type="password"
              placeholder="Retype Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="montserrat-font px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {message && (
              <div className="montserrat-font text-auto text-center w-full px-auto ">{message}</div>
            )}

            <button
              type="submit"
              disabled={disabled} // ✅ disable button here
              className={`montserrat-font py-3 text-white font-semibold rounded-md transition 
                ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-700'}`}
            >
              Register
            </button>
          </form>
      </div>
    </main>
  );
}
