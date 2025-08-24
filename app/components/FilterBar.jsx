'use client';
import Image from 'next/image';

export default function FilterBar({ total, setOrder, setViewType }) {
  const handleSortChange = (e) => {
    const value = e.target.value;
    setOrder(value);
  };

  return (
    <div className="flex flex-wrap montserrat-font items-center justify-between p-2 w-full border mt-1 bg-white rounded-xl ">
      <p className="text-gray-700 font-bold montserrat-font underline italic">
        <span className="text-md no-underline  montserrat-font text-gray-900">{total}</span> Products
      </p>

      <div className="flex items-center gap-4">
        <label htmlFor="sort" className="text-md text-gray-700 montserrat-font italic underline">
          Sort by
        </label>
        <select
          id="sort"
          onChange={handleSortChange}
          className="border bg-gray-200 rounded  montserrat-font px-1 py-1 text-sm italic font-bold text-black"
        >
          <option value="pop" className='montserrat-font'>Popularity: High to Low</option>
          <option value="inc" className='montserrat-font'>Price: Low to High</option>
          <option value="a-z" className='montserrat-font'>Alphabetically, A–Z</option>
          <option value="z-a" className='montserrat-font'>Alphabetically, Z–A</option>
          <option value="dec" className='montserrat-font'>Price: High to Low</option>
          
        </select>

        <div className="flex items-center gap-2 montserrat-font">
          <button className="w-5 h-5 border bg-black montserrat-font" onClick={() => setViewType('grid')}>
            <Image
              src="/gridW.svg"
              alt="Grid View"
              width={20}
              height={20}
            />
          </button>
          <button className="w-5 h-5 border bg-black montserrat-font" onClick={() => setViewType('list')}>
            <Image
              src="/listW.svg"
              alt="List View"
              width={20}
              height={20}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
