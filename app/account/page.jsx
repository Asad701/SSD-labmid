'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // GET USER DATA
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/account?get=user');
        const data = await res.json();
        if (res.ok) {
          setUser(Array.isArray(data) ? data[0] : data);
        } else {
          setError(data.message || 'Failed to load user');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('An error occurred while fetching user data.');
      }
    };
    fetchUser();
  }, []);

  // HANDLE LOGOUT
  const handleLogout = () => {
    document.cookie = 'logged_in=; max-age=0; path=/';
    document.cookie = 'token=; max-age=0; path=/';
    router.push('/');
  };

  // HANDLE ACCOUNT DELETION REQUEST
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;
    if (!user?.userid) {
      setMessage("❌ User ID missing!");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/deleteAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: user.userid }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Deletion request processed. Check your email.");
      } else {
        setMessage("❌ " + (data.error || "Something went wrong."));
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }
  if (!user) {
    return <div className="text-center mt-10 text-gray-700">Loading user info...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-5 px-2">
      {/* Sidebar */}
      <div className="py-7 px-4 mt-4 flex flex-col rounded-xl gap-3 w-full md:w-1/3 bg-blue-800 text-white">
        <button className="montserrat-font bg-blue-600 hover:bg-blue-500 py-4 rounded-full" onClick={() => router.push("/account/myinfo")}>My Profile</button>
        <button className="montserrat-font bg-blue-600 hover:bg-blue-500 py-4 rounded-full" onClick={() => router.push("/cart")}>Your Cart</button>
        <button className="montserrat-font bg-blue-600 hover:bg-blue-500 py-4 rounded-full" onClick={() => router.push("/account/myorders")}>Orders</button>
        <button className="montserrat-font bg-blue-600 hover:bg-blue-500 py-4 rounded-full" onClick={() => router.push("/favs")}>Your Favourite</button>
        <Link href="/account/edit" className="montserrat-font bg-red-600 hover:bg-red-500 py-4 flex justify-center items-center rounded-full">
          Edit Info
        </Link>
        <button onClick={handleLogout} className="montserrat-font bg-red-600 hover:bg-red-500 py-4 rounded-full">Logout</button>
        <button onClick={handleDelete} className="montserrat-font bg-red-600 hover:bg-red-500 py-4 rounded-full">
          {loading ? "Processing..." : "Request Account Deletion"}
        </button>
      </div>

      {/* Main Profile */}
      <div className="montserrat-font flex flex-col items-center gap-4 w-full mt-4 p-4 rounded-xl bg-gray-200">
        <h1 className="montserrat-font text-xl md:text-2xl font-bold w-full py-2 mb-4 bg-black text-white text-center rounded-xl">My Profile</h1>
        <Image src={`/${user.avatar}`} alt="user image" width={200} height={200} className="rounded-full" />

        <div className="montserrat-font flex flex-col w-full items-center justify-center gap-5">
          <div className="montserrat-font bg-black w-[90%] sm:w-[70%] py-2 rounded-xl">
            <label className="montserrat-font flex justify-center text-white font-bold italic underline text-lg sm:text-2xl">USER ID</label>
            <p className="montserrat-font flex justify-center text-white text-base sm:text-lg">{user.userid}</p>
          </div>
          <div className="montserrat-font bg-black w-[90%] sm:w-[70%] py-2 rounded-xl">
            <label className="flex justify-center text-white font-bold italic underline text-lg sm:text-2xl">NAME</label>
            <p className="flex justify-center text-white text-base sm:text-lg">{user.fname + ' ' + user.lname}</p>
          </div>
          <div className="bg-black w-[90%] sm:w-[70%] py-2 rounded-xl">
            <label className="flex justify-center text-white font-bold italic underline text-lg sm:text-2xl">EMAIL</label>
            <p className="flex justify-center text-white text-base sm:text-lg">{user.email}</p>
          </div>
          <div className="bg-black w-[90%] sm:w-[70%] py-2 rounded-xl">
            <label className="flex justify-center text-white font-bold italic underline text-lg sm:text-2xl">COUNTRY</label>
            <p className="flex justify-center text-white text-base sm:text-lg">{user.country}</p>
          </div>
        </div>

        {message && (
          <p className="mt-4 text-center font-semibold text-sm text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}
