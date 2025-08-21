'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const getImages = async () => {
      const res = await fetch("/api/misc");
      const data = await res.json();
      setImages(data[0]?.images || []);
    };
    getImages();
  }, []);

  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="relative w-[90%] h-[300px] lg:h-[450px] md:h-[350px] mx-auto mt-6 overflow-hidden rounded-lg ">
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((src, idx) =>
          src ? (
            <div key={idx} className="w-full h-full relative flex-shrink-0">
              <Image
                src={src.startsWith("/") ? src : `/${src}`}
                alt={`Slide ${idx + 1}`}
                fill
                className="object-cover montserrat-font"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          ) : null
        )}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full ${current === idx ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setCurrent(idx)}
            onContextMenu={(e) => e.preventDefault()}
          />
        ))}
      </div>
    </div>
  );
}
