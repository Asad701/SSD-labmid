'use client';

import Image from 'next/image';
import {useState } from 'react';

export default function ProductsGrid({ items, view}) {
  const [Fdisable , setFdisable] = useState({});
  const [Cdisable , setCdisable] = useState({});
  const [message , setMessage] = useState('');




  const HandleAddtoFav = async (productid) => {
    try {
      const res = await fetch(`/api/account?addto=fav`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productid }),
      });
      if(!res.ok){
        const data = await res.json();
        setMessage(data.message);
        return;
      }
      const data = await res.json();
      setMessage(data.message);
      setFdisable((prev)=>({...prev , [productid]:true}))
    } catch (err) {
      setMessage("Internal server error . TRY AGAIN LATER.");
    }
  };

  const HandleAddToCart = async (productid) => {
    try {
      const res = await fetch(`/api/account?addto=cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productid }),
      });
      if(!res.ok){
        const data = await res.json();
        setMessage(data.message);
        return;
      }
      const data = await res.json();
      setMessage(data.message);
      setCdisable((prev)=>({...prev , [productid]:true}))
    } catch (err) {
      setMessage("Internal server error . TRY AGAIN LATER.");
    }
  };

  const HandleInfo = (slug) => {
    window.location.href = `/product/${slug}`;
  };

  return (

    <div
      className={`relative montserrat-font w-full p-8 bg-gray-300 mt-2 ${
        view === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3'
          : 'flex w-full flex-col gap-6'
      }`}
    >
      {items.map((product, index) => (
        
        <div
          key={index}
          className={`montserrat-font group bg-white shadow rounded-md p-2 relative hover:bg-gray-50 transition-all duration-200 ${
            view === 'list' ? 'flex gap-4 items-center' : ''
          }`}
        >
          {/* Favorite Button */}
          <button
            disabled={Fdisable[product.productid]}
            className={`montserrat-font z-10 absolute right-0 top-0 w-[30px] h-[30px] flex justify-center items-center rounded-full transition-colors
                      ${Fdisable[product.productid] ? 'bg-red-600 text-white cursor-not-allowed' : 'bg-black  hover:bg-black/50 text-white'}`}
            onClick={() => HandleAddtoFav(product.productid)}
          >
            <Image
              src="/favoriteW.svg"
              alt="fav"
              width={20}
              height={20}
            />
          </button>

          {/* Add to Cart Button */}
          <button
            disabled={Cdisable.pid}
            className={`montserrat-font z-10 absolute left-0 top-0  w-[30px] h-[30px] flex justify-center items-center rounded-full transition-colors
                      ${Cdisable[product.productid] ? 'bg-red-600 text-white cursor-not-allowed' : 'bg-black  hover:bg-black/50 text-white'}`}
            onClick={() => HandleAddToCart(product.productid)}
          >
            <Image
              src="/add_shoppingW.svg"
              alt="addtocart"
              width={20}
              height={20}
            />
          </button>

          {/* Product Image */}
          <div
            className={`relative montserrat-font bg-gray-700 rounded-md overflow-hidden flex items-center justify-center ${
              view === 'grid' ? 'p-1 h-[200px] w-full' : 'w-40 h-40' 
            }`}
          >
            <img
              src={product.mainimage}
              alt={product.title}
              className="montserrat-font object-cover h-full w-full"
              onContextMenu={(e) => e.preventDefault()}
            />
            {product.discount > 0 && (
              <div className="montserrat-font z-10 absolute left-1 bottom-2 bg-gradient-to-r from-red-600 to-red-400 text-white text-sm p-1 rounded-full shadow-md font-bold animate-pulse">
              🔥 {Math.round((product.discount / product.price) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          {view === 'grid' ? <div className="montserrat-font text-green-500 italic text-center text-md mt-1">🆓 Delivery Free</div>:null}
          <div className={`mt-2 ${view === 'list' ? 'flex-1' : 'text-center'}`}>
            <h3 className="montserrat-font italic text-gray-700  mb-2 text-center line-clamp-2">
              {(product.title)}
            </h3>
            <div className="mb-2 text-center ">
              <span className="montserrat-font text-black italic text-md font-bold">Price: </span>
              <span className="montserrat-font line-through text-red-500 mr-2 text-lg">${product.price}</span>
              <span className="montserrat-font text-green-600 text-lg">
                ${product.price - product.discount}
              </span>
            </div>
            <div className="montserrat-font w-full flex justify-center mb-2">
              <button
                className="montserrat-font bg-blue-800 hover:bg-blue-600 text-white px-4 py-2 rounded-md italic w-[100px]"
                onClick={() => HandleInfo(product.title)}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      ))}
      {message && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-red-500 text-red-600  px-6 py-6 mx-0 rounded-lg flex items-center gap-4 z-50">
          <span>{message}</span>
          <button
            className="text-red-600 hover:text-red-800 font-bold text-lg"
            onClick={() => setMessage('')}
          >
            ✖
          </button>
        </div>
      )}

    </div>
  );
}
