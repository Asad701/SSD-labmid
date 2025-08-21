'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

export default function FavouritesPage() {
  const [products, setProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedIn ,setLoggedIn]= useState(false);
  const [message, setMessage] = useState('')
  
  // VERIFY LOGIN
  useEffect(() => {
    const checkLoggedIn = () => {
      const cookieStr = document.cookie;
      const match = cookieStr
        .split("; ")
        .find((cookie) => cookie.startsWith("logged_in="));
      if (match && match.split("=")[1] === "true") {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    };
    checkLoggedIn();
    window.addEventListener("focus", checkLoggedIn);
    return () => window.removeEventListener("focus", checkLoggedIn);
  }, []);

  // GET FAV ITEMS
  useEffect(() => {
    const fetchFav = async () => {
      try {
        const res = await fetch("/api/account?get=fav");
        if (!res.ok) {
          setNotFound(true);
          setNotFoundMessage("Please add items to favourites");
          setLoading(false);
          return;
        }
        const data = await res.json();
        const flatProducts = data.flatMap(item => item.favs);
        setProducts(flatProducts);
      } catch (err) {
        setNotFound(true);
        setNotFoundMessage('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFav();
  }, []);

  // HANDLE ADD TO CART
  const HandleAddToCart = async (productid) => {
    try {
      const res = await fetch(`/api/account?addto=cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productid: productid })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message);
        return;
      }
      setMessage(data.message);
      handleRemove(productid);
      fetchFav();
    } catch (err) {
      message('internal server error');
    }
  };

  // HANDLE REMOVE FROM FAV
  const handleRemove = async (e, productId) => {
    e.preventDefault(); 
    try {
      const res = await fetch("/api/account?remove=fav", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productid: productId }),
      });
      if (res.ok) {
        setProducts(prev => prev.filter(item => item.productid !== productId));
      } else {
        setMessage("Failed to remove from favourites.");
      }
    } catch (err) {
      message('internal server error');
    }
  };

  // HANDLE MORE INFO / REDIRECTING TO SINGLE PRODUCT PAGE
  const handleMoreInfo= (slug)=>{
    window.location.href = `/product/{slug}`
  }

  return (
    <>
    {loggedIn ? 
    <main className="flex flex-wrap gap-6 justify-start items-start my-2 bg-gray-100 w-full h-full p-10">
      {loading ? (
        <div className=" text-center w-full py-10 text-green text-lg">Loading...</div>
      ) : notFound ? (
        <div className="text-red-600 text-lg text-center w-full py-10">{notFoundMessage}</div>
      ) : (
      <>
        {message ? <div className="w-full text-center py-2 text-white bg-black" >{message}</div> : null}
        {products.map((item,idx) => (
          <div key={`${item.slug}-${idx}`}>
            <div className=" relative flex flex-row items-center gap-8 w-[350px] h-[170px] bg-blue-950 p-4 border-b py-4 cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <Image
                src={`/${item.mainimage}`}
                alt={item.title}
                width={120}
                height={120}
                className="rounded object-cover"
              />
              <div id="details" className=" flex flex-col gap-2">
                <div className=" text-sm text-white">{(item.title).split("–")[0]}</div>
                <div className=" text-white">Rs. {item.price}</div>
                <button className="  text-white bg-black rounded-full w-full p-1 hover:bg-white hover:text-black" title="More details" onClick={()=>{handleMoreInfo(item.slug)}}>more info</button>
              </div>
              <button
                onClick={(e) => handleRemove(e, item.productid)}
                className="absolute top-[-12.5px] right-[-12.5px] flex justify-center items-center
                           rounded-full w-[25px] h-[25px] bg-black text-white  hover:bg-black/50 transition-colors duration-150"
                title="Remove from favourites"
              >
                X
              </button>
              <button
                onClick={() => HandleAddToCart(item.productid)}
                className="absolute top-[-12.5px] left-[-12.5px] flex justify-center items-center
                           rounded-full w-[25px] h-[25px] bg-black text-white text-3xl hover:bg-black/50  transition-colors duration-150"
                title="Add to cart"
              >
                +
              </button>
            </div>
          </div>  

        ))}
      </>  
      )}
    </main>
    :
    <div className="flex justify-center p-10 items-start text-xl text-red-500 bg-white h-screen w-full ">Please login / Register First</div>}
    </>
  );
}
