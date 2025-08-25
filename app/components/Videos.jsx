'use client';
import { useState, useEffect } from 'react';

export default function Videos() {
  const [art, setArt] = useState([]);

  useEffect(() => {
    const getVideos = async () => { 
      const res = await fetch("/api/misc");
      const data = await res.json();
      setArt(data[0]?.videos || []);
    };
    getVideos();
  }, []);

  return (
    <section className="montserrat-font py-8 bg-black text-white">
      <div className="montserrat-font max-w-7xl mx-auto">
        <h2 className="montserrat-font text-4xl text-center font-extrabold">Our Art Work</h2>
        <div className="montserrat-font flex justify-start items-end gap-10 shadow p-10 overflow-x-auto scrollbar-hide">
          {art.map((url, idx) =>
            url ? (
              <div key={idx} className="montserrat-font relative min-w-[300px] min-h-[200px] w-screen h-[200px] lg:h-[300px] bg-white rounded-xl">
                <video
                  className="w-full h-full object-cover rounded-xl"
                  muted
                  playsInline
                  loop
                  onClick={(e) => (e.currentTarget.muted = !e.currentTarget.muted)}
                  onMouseOver={async (e) => {
                    try {
                      await e.currentTarget.play();
                    } catch (err) {
                      console.warn("Play interrupted", err);
                    }
                  }}
                  onMouseOut={(e) => e.currentTarget.pause()}
                >
                  <source src={`/${url}`} type="video/mp4" />
                </video>
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
