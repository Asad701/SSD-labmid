"use client";

import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import ImageSlider from "./components/ImageSlider";
import PromoBanner from "./components/PromoBanner";
import LuxuryCollection from "./components/LuxuryCollection";
import TopComments from "./components/TopComments";
import Videos from "./components/Videos";
import Image from "next/image";
import Loading from "./components/Loading";
import MostSellings from "./components/MostSellings";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [disable , setDisable] = useState(false);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Check if cookies are enabled
  useEffect(() => {
    function cookiesEnabled() {
      try {
        document.cookie = "cookietest=1";
        const enabled = document.cookie.indexOf("cookietest=1") !== -1;
        // Clean up test cookie
        document.cookie =
          "cookietest=1; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return enabled;
      } catch (e) {
        return false;
      }
    }

    if (!cookiesEnabled()) {
      alert("Cookies are disabled in your browser. Some features may not work properly.");
    }
  }, []);

  // ✅ Comment Submit
  const handleCommentSubmit = async () => {
    if (!comment.trim() || !userName.trim() || !email.trim()) return;

    const payload = {
      comment: comment.trim(),
      userName: userName.trim(),
      userEmail: email.trim(),
    };

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok) {
      setComment("");
      setUserName("");
      setEmail("");
      setDisable(false);
    }
    setMessage(data.message);
  };
  useEffect(()=>{
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  })

  return (
    <>
      {loading ? (
        <div className="w-screen h-screen z-50 flex justify-center items-center bg-black">
          <Loading />
        </div>
      ) : (
        <>
          <Nav />
          <main>
            <ImageSlider/>
            <PromoBanner />
            <LuxuryCollection />
            <TopComments />
            <MostSellings />
            <Videos  />

            {/* Floating comment icon */}
            <Image
              src="/commentB.svg"
              alt="comments"
              width={75}
              height={75}
              className="rounded-2xl p-2 fixed bottom-4 right-4 z-25 flex justify-center items-center bg-white/80"
              onClick={() => setShowModal(true)}
            />

            {/* Comment Modal */}
            {showModal && (
              <>
                <div
                  className="fixed inset-0 w-70% h-auto bg-black/50 z-40"
                  onClick={() => setShowModal(false)}
                />
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 h-[400px] bg-gray-200 p-6 rounded-xl shadow-xl flex flex-col items-center gap-4">
                  <h2 className="text-lg font-bold">Leave Your Review Here</h2>
                  <h2 className="text-md text-green-500 font-bold">{message}</h2>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="text-md bg-white placeholder:text-gray-400 text-black rounded-lg py-2 px-10"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-md bg-white placeholder:text-gray-400 text-black rounded-lg py-2 px-10"
                  />
                  <textarea
                    rows={4}
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="text-md bg-white placeholder:text-gray-400 text-black rounded-lg py-2 px-10 w-full"
                  />
                  <Image
                    src="/closeB.svg"
                    alt="close"
                    width={30}
                    height={30}
                    className="bg-white hover:bg-red-500 absolute top-0 right-0 rounded-full"
                    onClick={() => setShowModal(false)}
                  />
                  <div className="w-full flex justify-evenly">
                    <button
                      onClick={() => setShowModal(false)}
                      className="mt-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={disable}
                      onClick={()=>{handleCommentSubmit(); setDisable(true);}}
                      className="mt-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </>
            )}
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
