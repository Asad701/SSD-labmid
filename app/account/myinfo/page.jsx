'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function myInfoPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // GET USER DATA
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/account?get=user');
        const data = await res.json();
        if (res.ok) {
          const userData = Array.isArray(data) ? data[0] : data;
          setUser(userData);
        } else {
          setError(data.message || 'Failed to load user');
        }
      } catch (err) {
        setError('An error occurred while fetching user data.');
      }
    };
    fetchUser();
  }, []);

  // HANDLE GO BACK
  const handlegoBack =()=>{
    window.location.href ="/account";
  }

  // HANDLE LOGOUT
  const handleLogout = () => {
    document.cookie = 'logged_in=; max-age=0; path=/';
    document.cookie = 'token=; max-age=0; path=/';
    router.push('/');
  };


  // MISC
  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }
  if (!user) {
    return <div className="text-center mt-10 text-gray-700">Loading user info...</div>;
  }

  
  return (
    <div className="montserrat-font montserrat-font relative flex flex-col md:flex-row gap-5 px-2">
      {/* Main Profile */}
      <div className="montserrat-font flex flex-col items-center gap-4 w-full mt-10 p-4 rounded-xl bg-gray-200">
        <h1 className="montserrat-font text-xl md:text-2xl font-bold w-full py-2 mb-4 bg-black text-white text-center rounded-xl">My Profile</h1>

        {/* Avatar Box */}
        <div className="bg-black flex flex-col w-[80%] sm:w-[300px] h-auto py-6 gap-4 rounded-md items-center">
          <Image src={`/${user.avatar}`} alt="user image" width={150} height={150} className="object-contain rounded-xl" />
        </div>

        {/* Info Fields */}
        <div className="flex flex-col w-full items-center justify-center gap-5">
          <div className="bg-black w-[90%] sm:w-[70%] py-2 rounded-xl">
            <label className="flex justify-center text-white font-bold italic underline text-lg sm:text-2xl">USER ID:</label>
            <p className="flex justify-center text-white text-base sm:text-lg">{user.userid}</p>
          </div>

          <div className="bg-black w-[90%] sm:w-[70%] py-2 rounded-xl">
            <label className="flex justify-center text-white font-bold italic underline text-lg sm:text-2xl">NAME:</label>
            <p className="flex justify-center text-white text-base sm:text-lg">{user.fname + ' ' + user.lname}</p>
          </div>

          <div className="bg-black w-[90%] sm:w-[70%] py-2 rounded-xl">
            <label className="flex justify-center text-white font-bold italic underline text-lg sm:text-2xl">EMAIL:</label>
            <p className="flex justify-center text-white text-base sm:text-lg">{user.email}</p>
          </div>

          {user.country && (
            <div className="bg-black w-[90%] sm:w-[70%] py-2 rounded-xl">
              <label className="flex justify-center text-white font-bold italic underline text-lg sm:text-2xl">Country:</label>
              <p className="flex justify-center text-white text-base sm:text-lg">
                {
                  `${user.country ?? '*'}` 
                }
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 p-4 w-full flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link href="/account/edit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto flex justify-center items-center">
            Edit Info
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
        <div className=" flex justify-center items-center bg-black text-white rounded-xl px-2 w-[100px] h-[70px] hover:bg-blue-900 italic" onClick={handlegoBack}>Go Back</div>
      </div>
          
    </div>
  );
}
