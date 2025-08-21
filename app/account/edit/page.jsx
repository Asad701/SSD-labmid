'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function EditAccountPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('avatar');
  const [menuOpen, setMenuOpen] = useState(false);
  const [update , setUpdate] = useState(true);

  const [file, setFile] = useState(null);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [country, setCountry] = useState('');


  // Password fields
  const [pwd, setPwd] = useState('');
  const [confirmpwd, setConfirmPwd] = useState('');
  const[ prevpwd , setPrevPwd] = useState('');

  const router = useRouter();

  // RESET FORM
  const resetForm = () => {
    setFname('');
    setLname('');
    setNewEmail('');
    setConfirmEmail('');
    setCountry('');
    setFile(null);
    setMessage('');
    setPwd('');
    setConfirmPwd('');
    setPrevPwd('');
  };

  // SWITCH ACTION TYPE
  const switchSection = (section) => {
    resetForm();
    setActiveSection(section);
    if (window.innerWidth < 768) setMenuOpen(false);
  };

  // LOGOUT
  const handleLogout = () => {
    document.cookie = 'logged_in=; max-age=0; path=/';
    document.cookie = 'token=; max-age=0; path=/';
    window.location.href = '/login';
  };

  //HANDLE SUBMIT FORM
  const handleSubmit = async () => {
    const formData = new FormData();
    if (fname) formData.append('fname', fname);
    if (lname) formData.append('lname', lname);
    if (newEmail) formData.append('email', newEmail);
    if (file) formData.append('avatar', file);
    if (country) {
      formData.append('country', country);
    }
    setUpdate(!update);
    try {
      const res = await fetch('/api/account', {
        method: 'PATCH',
        body: formData,
      });
      const result = await res.json();
      if (result.ok) {
        setMessage('Updated successfully');
        const userRes = await fetch('/api/account');
        const updatedUser = await userRes.json();
        setUser(updatedUser);
        resetForm();
        
      } else {
        setMessage(result.message || 'Update failed');
      }
    } catch (err) {
      console.error('Error updating:', err);
      setMessage('Something went wrong.');
    }
  };

  //  GET USER 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/account?get=user');
        const data = await res.json();
        if (res.ok) setUser(data);
        else setError(data.message || 'Failed to load user data.');
      } catch {
        setError('Error fetching user data.');
      }
    };
    fetchUser();
  }, [update]);
  const handlegoBack =()=>{
    window.location.href ="/account";
  }
  // handle change password
  const handleChangePwd = async (e) => {
    e.preventDefault();

    if (pwd !== confirmpwd) {
      setMessage('Passwords do not match');
      setConfirmPwd('');
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prevpassword: prevpwd,
          newpassword: pwd,
        }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setPwd('');
        setPrevPwd('');
        setConfirmPwd('');
      }

    } catch (err) {
      console.error('Password Change Error:', err);
      setMessage('Internal server error');
    }
  };


  // MISC
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!user) return <div className="text-center mt-10 text-gray-700">Loading user info...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-5 px-2">
      {/* Sidebar menu */}

        <div className="py-7 px-4 mt-4 flex flex-col rounded-xl gap-3 w-full md:w-1/4 bg-blue-950 text-white">
          <button onClick={() => switchSection('avatar')} className="bg-blue-800 hover:bg-blue-700 py-3 rounded-full">Change Avatar</button>
          <button onClick={() => switchSection('name')} className="bg-blue-800 hover:bg-blue-700 py-3 rounded-full">My Name</button>
          <button onClick={() => switchSection('email')} className="bg-blue-800 hover:bg-blue-700 py-3 rounded-full">My Email</button>
          <button onClick={() => switchSection('country')} className="bg-blue-800 hover:bg-blue-700 py-3 rounded-full">Country</button>
          <button onClick={() => switchSection('password')} className="bg-red-700 hover:bg-red-600 py-3 rounded-full">Reset Password</button>
          <button onClick={handleLogout} className="bg-red-700 hover:bg-red-600 py-3 rounded-full">Logout</button>
          <button onClick={handlegoBack} className="bg-black hover:bg-black/70 text-white py-3 rounded-full">Go Back</button>
          
        </div>
      {/* Form Section */}
      <div className="relative flex flex-col pt-6 items-center gap-6 w-full mt-4 p-4 rounded-xl bg-gray-100">      
        {activeSection === 'avatar' && (
          <>
            <div className="bg-black p-4 rounded-2xl">
              <Image src={`/${user.avatar}`} alt="Avatar" width={150} height={150} className="rounded-2xl" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className=" file:bg-green-600 file:text-white file:rounded file:px-4 file:py-1 file:mr-4 border p-2 bg-blue-950 text-white rounded w-full sm:w-1/2"
            />
            <button onClick={handleSubmit} className="bg-blue-800 hover:bg-blue-600 py-2 px-6 text-white">Submit</button>
          </>
        )}

        {activeSection === 'name' && (
          <>
            <div className="text-3xl font-semibold text-white bg-black p-4 w-full text-center">
              Edit Name
            </div>
            <div className="text-xl lg:text-2xl w-[70%]  rounded-full sm:text-3xl font-semibold text-white bg-black p-4 text-center">
              {user.fname} {user.lname}
            </div>
            <input type="text" placeholder="First Name" value={fname} onChange={(e) => setFname(e.target.value)} className="p-3 border rounded bg-blue-950 text-white w-full sm:w-1/2" />
            <input type="text" placeholder="Last Name" value={lname} onChange={(e) => setLname(e.target.value)} className="p-3 border rounded bg-blue-950 text-white w-full sm:w-1/2" />
            <button onClick={handleSubmit} className="bg-blue-800 hover:bg-blue-600 py-2 px-6 text-white">Submit</button>
          </>
        )}

        {activeSection === 'email' && (
          <>
            <div className="text-2xl font-semibold text-white bg-black p-4 w-full text-center">
              Edit Email
            </div>
            <div className="text-xl ld:text-2xl font-semibold text-white bg-black p-4 rounded-full w-full text-center">
              {user.email}
            </div>
            <input type="email" placeholder="New Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="p-3 border rounded bg-blue-950 text-white w-full sm:w-1/2" />
            <input type="email" placeholder="Confirm Email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} className="p-3 border rounded bg-blue-950 text-white w-full sm:w-1/2" />
            <button onClick={handleSubmit} className="bg-blue-800 hover:bg-blue-600 py-2 px-6 text-white">Submit</button>
          </>
        )}

        {activeSection === 'country' && (
          <>
          <div className="text-2xl sm:text-3xl font-semibold text-white bg-black p-4 w-full text-center">
              Edit Country
          </div>
          <div className="text-xl lg:text-2xl font-semibold text-white bg-black p-4 rounded-full w-full text-center">
              {
                `Country : ${user.country ?? '*'}` 
              } 
          </div>    
            <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="p-3 border rounded bg-blue-950 text-white w-full sm:w-1/2" />
            <button onClick={handleSubmit} className="bg-blue-800 hover:bg-blue-600 py-2 px-6 text-white">Submit</button>
          </>
        )}

        {activeSection === 'password' && (
          <form  onSubmit={handleChangePwd}  className="max-w-md mx-auto p-6 bg-white shadow-md rounded-xl space-y-5">
            <h2 className="text-2xl font-bold text-gray-800 text-center">🔒 Change Password</h2>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Previous Password</label>
              <input
                type="password"
                placeholder="Enter Previous password"
                value={prevpwd}
                onChange={(e) => setPrevPwd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmpwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 transition duration-200 text-white font-semibold py-2 px-4 rounded-lg"
            >
              🔁 Change Password
            </button>
            
          </form>
        )}

        {message && <div className="text-auto text-center w-full px-auto ">{message}</div>}
      </div>
    </div>
  );
}
