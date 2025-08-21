'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PromoBanner() {
  const [promo, setPromo] = useState({});

  useEffect(() => {
    const getPromo = async () => {
      const res = await fetch("/api/misc");
      const data = await res.json();
      setPromo(data[0]?.promo || {});
    };
    getPromo();
  }, []);

  return (
    <div className=" montserrat-font  w-full h-[150px] lg:h-[250px]  bg-black text-white flex items-center justify-evenly lg:px-16 px-8 py-4 rounded-full  mt-4">
      <div className=" montserrat-font  flex-1 text-center md:text-left">
        <h2 className=" montserrat-font lg:text-3xl text-lg  font-bold">
          🎉 Get upto <span className="montserrat-font  text-xl text-yellow-400">{promo.percentage}% OFF</span>
        </h2>
        <p className='montserrat-font lg:text-lg text-sm'>on all premium sets – Limited time offer!</p>
      </div>
      <div className="fmontserrat-font  relative w-[75px] h-[75px] lg:w-[200px] lg:h-[150px]">
        <Image
          src={`/${promo.image}`}
          alt="Promo"
          fill
          className="object-cover rounded-xl"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}
