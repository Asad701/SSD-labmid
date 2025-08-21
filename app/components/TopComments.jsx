'use client';
import { useState, useEffect } from 'react';

export default function TopComments() {
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch("/api/misc", { cache: "no-store" });
        if (!res.ok) {
          setMessage("Error while getting comments");
          return;
        }
        const data = await res.json();
        setComments(data[0]?.comments || []);
      } catch (error) {
        setMessage("Error while fetching comments");
      }
    };
    getComments();
  }, []);

  return (
    <>
      {comments.length > 0 ? (
        <section className="montserrat-font w-full py-10 bg-gray-200 text-black px-4 md:px-12">
          <div className="montserrat-font max-w-7xl mx-auto flex flex-col gap-8">
            <h2 className="montserrat-font text-4xl font-extrabold text-center">Reviews</h2>
            <div className="montserrat-font flex gap-8 overflow-x-auto scrollbar-hide px-2">
              {comments.map((item, idx) => (
                <div
                  key={idx}
                  className="montserrat-font flex flex-col items-start justify-evenly min-w-[300px] min-h-[150px] bg-white rounded-2xl p-6"
                >
                  <p className="montserrat-font">“{item.comment}”</p>
                  <p className="montserrat-font font-semibold mt-2">– {item.userName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
