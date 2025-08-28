'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Categorybar() {
  const [category, setCategory] = useState('');
  const [ListCat, setListCat] = useState([]);
  const router = useRouter();
  const scrollRef = useRef(null);

  const handleCategory = (cat) => {
    setCategory(cat);
    router.push(`/product?category=${encodeURIComponent(cat)}`);
  };

  const ScrollLeftHandle = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const ScrollRightHandle = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await fetch('/api/category');
        const list = await res.json();
        setListCat(list);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    getCategory();
  }, []);

  return (
    <div className="flex montserrat-font justify-center items-center gap-12 max-w-lvw  w-full bg-black p-2 mt-2 rounded-3xl mb-2  mr-2 ">
      {/* Left Arrow */}
      <div
        id="category-scroll-left"
        className="relative h-[40px] montserrat-font w-[40px] cursor-pointer hover:scale-110 transition-transform duration-300"
        onClick={ScrollLeftHandle}
      >
        <Image
          src="/arrow_backW.svg"
          fill
          alt="Scroll left"
          priority
        />
      </div>

      {/* Scrollable Category List */}
      <div
        ref={scrollRef}
        className="flex justify-start montserrat-font items-center w-[%0%] h-auto overflow-x-auto scrollbar-hide flex-nowrap gap-3 mt-2"
      >
        {ListCat.map((cat) => (
          <div
            key={cat.categoryid}
            onClick={() => handleCategory(cat.title)}
            className="flex flex-col montserrat-font items-center w-[70px] h-[85px] cursor-pointer text-white text-xs transition-transform transform hover:scale-105"
          >
            <div className="relative w-[40px] h-[40px] rounded-xl overflow-hidden">
              <Image
                src={`/${cat.image}`}
                fill
                alt={cat.title}
                className="object-cover montserrat-font"
              />
            </div>
            <span className="mt-1 text-center font-bold montserrat-font text-white hover:text-amber-300">
              {cat.title}
            </span>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <div
        id="category-scroll-right"
        className="relative h-[40px] w-[40px] cursor-pointer montserrat-font hover:scale-110 transition-transform duration-300"
        onClick={ScrollRightHandle}
      >
        <Image
          src="/arrow_forwardW.svg"
          fill
          alt="Scroll right"
          priority
        />
      </div>
    </div>
  );
}
