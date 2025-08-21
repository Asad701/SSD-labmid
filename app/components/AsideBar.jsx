// AsideBar.jsx
'use client';

import { useEffect, useState } from 'react';

export default function AsideBar({ setFilters, filters }) {
  const [ListCat, setListCat] = useState([]);

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
    <aside className="rounded-sm h-full lmontserrat-font max-w-full p-4  bg-gray-100 ">
      <h1 className="font-bold text-3xl v underline text-center mb-10">Apply Filter</h1>

      <div className="mb-6">
        <h2 className="font-bold text-2xl montserrat-font italic underline mb-4">Price</h2>
        <input
          type="range"
          min={0}
          max={1449}
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev=>({...prev , maxPrice: Number(e.target.value)}))}
          className="w-full montserrat-font"
        />
        <div className="flex  montserrat-font justify-between text-sm text-indigo-950 mb-1">
          <span className='montserrat-font'>$0.00</span>
          <span className='montserrat-font'>${filters.maxPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-bold montserrat-font text-xl italic underline mb-4">Product type</h2>
        {ListCat.map((type, i) => (
          <label key={i} className="block m-2 montserrat-font text-gray-700">
            <input
              type="radio"
              name="category"
              checked={filters.category === type.title}
              onChange={() => setFilters(prev => ({ ...prev, category: type.title }))}
              className="mr-2 montserrat-font"
            />
            {type.title}
          </label>
        ))}
        <label className="block m-2 text-gray-700 montserrat-font">
          <input
            type="radio"
            name="category"
            checked={filters.category === ''}
            onChange={() => setFilters(prev => ({ ...prev, category: '' }))}
            className="mr-2 montserrat-font"
          />
          All
        </label>
      </div>
    </aside>
  );
}
