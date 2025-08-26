'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from "../components/Loading";

export default function CartPage() {
  const [products, setProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [notFoundMessage, setNotFoundMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(true);
  const [ refresh , setRefresh]=useState(true);
  const [loggedIn ,setLoggedIn]= useState(false);
  const [message , setMessage] = useState('');
  const router = useRouter();

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

  // GET CART ITEMS
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/account?get=cart");
        if (!res.ok) {
          setNotFound(true);
          setNotFoundMessage("Cart is empty.");
          setLoading(false);
          return;
        }
        const data = await res.json();
        const flatProducts = data.map(item => ({
          ...item.carts[0],
          productcount: item.productcount,
        }));

        setProducts(flatProducts);
      } catch (err) {
        setNotFound(true);
        setNotFoundMessage('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [refresh]);

  //  REMOVE PRODUCT FROM CART
  const handleRemove = async (e, productId) => {
    e.preventDefault(); 
    try {
      const res = await fetch("/api/account?remove=cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productid: productId }),
      });
      if (res.ok) {
        setProducts(prev => prev.filter(item => item.productid !== productId));
        router.refresh();
      } else {
        setMessage("Failed to remove from cart.");
      }
    } catch (err) {
      setMessage("internal server error")
    }
    setRefresh(!refresh);
  };

  //  REMOVE item Qt FROM CART
  const handleRemoveitem = async (productId) => {
    try {
      const res = await fetch("/api/account?remove=cartitem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productid: productId }),
      });
      const data= await res.json();
      if (res.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("internal server error")
    }
    setRefresh(!refresh);
  };

  // ADD TO CART
  const handleCartDialog = () => {
    setDialog(!dialog);
  };
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
      } catch (err) {
        setMessage("internal server error")
      }
    };

  // HANDLE INCREASE ITEMS QUANTITY  
  const handleAddMore=(productid)=>{
    HandleAddToCart(productid);
    setRefresh(!refresh);
  }

  //   // HANDLE REMOVE ITEMS QUANTITY
  const HandleremovefromCart = async (productid) => {
    try {
      const res = await fetch(`/api/account?remove=cartitem`, {
        method: 'DELETE',
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
      setMessage(res.message);
      router.refresh();
    } catch (err) {
      setMessage("internal server error")
    }
  };


  // TOTAL CART PRICE
  const cartTotal = products.reduce((acc, item) => {
    const price = item.price - item.discount;
    return acc + (item.productcount * price);
  }, 0);
  return (
    <>
    {loggedIn ?
    <main className="relative flex flex-wrap flex-col w-full gap-6 justify-start items-start my-2 bg-gray-200 rounded-xl p-4 md:p-6 lg:p-10">
      {loading ? (
        <div className="flex items-center justify-center  w-full bg-black py-10"><Loading/></div>
      ) : notFound ? (
        <div className="text-red-600 text-center  w-full py-10">{notFoundMessage}</div>
      ) : (
        products.map((item, idx) => (
          <div key={`${item.productid}-${idx}`} className="relative  bg-gray-300 w-full flex flex-col lg:flex-row justify-between items-center py-3 px-4">
            <div className="relative flex flex-row items-center  justify-start gap-4 md:gap-8 w-4/5 rounded-sm lg:w-1/3 bg-blue-950 border-b p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <Image src={`/${item.mainimage}`} alt={item.title} width={80} height={70} className="rounded-lg object-cover md:w-[120px] md:h-[120px]" />
              <div id="details" className="flex  flex-col gap-1">
                <div className="text-sm text-white">{(item.title)}</div>
              </div>
              <div className="rounded-lg absolute top-[-10px]  right-[-10px] w-[20px] h-[20px] bg-black text-white flex justify-center items-center hover:bg-black/50 text-lg p-1 " title="Add one more item to cart" onClick={()=>{handleAddMore(item.productid)}}>+</div>
              <div className="rounded-lg absolute bottom-[-10px] right-[-10px] w-[20px] h-[20px] bg-black text-white flex justify-center items-center hover:bg-black/50 text-lg p-1" title="remove item from cart" onClick={()=>{handleRemoveitem(item.productid)}}>-</div>
            </div>

            <div className="hidden lg:block lg:text-xl lg:underline  lg:mt-4 lg:mt-0">
              {"Items : "} <span className="text-xl  font-semibold">{item.productcount}</span>
            </div>

            <div className="bg-blue-700 rounded-xl   pr-4 w-full lg:w-[200px] h-auto lg:h-[120px] flex flex-col gap-3 items-center lg:items-end justify-center mt-4 lg:mt-0">
              <div className="text-white">
                <span className="text-lg  text-white">$</span>
                <span className="text-2xl  text-white">{item.price - item.discount}</span>
              </div>
              <div className="font-semibold  underline text-white">x {item.productcount}</div>
              <div className="text-lg text-white">
                {'Total : '}
                <span className="text-2xl  font-bold text-white">
                  <span className="text-lg text-white">$</span>{item.productcount * (item.price - item.discount)}
                </span>
              </div>
            </div>

            <div
              className="absolute top-[-12.5px] right-[-12.5px]  flex justify-center items-center rounded-full w-[25px] h-[25px] bg-black text-white hover:bg-black/50 transition-colors duration-150"
              onClick={(e) => handleRemove(e, item.productid)}
            >
              X
            </div>
          </div>
        ))
      )}

      {dialog ? (
        <div className="fixed  flex flex-col justify-end  items-center pt-3 left-3 z-30 w-[100px] h-[100px] md:w-[150px] md:h-[150px]   md:text-lg lg:w-[150px] lg:h-[150px] bg-black text-md lg:text-lg gap-2 text-white">
          <span className="underline">Cart Total</span>
          <span className="text-2xl">${cartTotal}</span>
          <div
            className="absolute top-[-15px] right-[-15px]  bg-blue-950 w-[30px] h-[30px] rounded-full flex justify-center items-center hover:bg-blue-500"
            onClick={handleCartDialog}
          >
            X
          </div>
          <Link href='/order' products={products} total={cartTotal} className="bg-white  text-black w-full h-[50px] text-md hover:text-white hover:bg-blue-700 text-center">
            order now
          </Link>
        </div>
      ) : (
        <button
          className="z-30 fixed left-0 w-[100px] h-[70px] bg-black  hover:bg-blue-700 text-white p-2 rounded-tr-lg rounded-br-lg"
          onClick={handleCartDialog}
        >
          Click here to Buy
        </button>
      )}
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
    </main>
    :
    <div className="flex justify-center p-10 items-start text-xl  text-red-500 bg-white h-screen w-full ">Please login / Register First</div>}
    </>
  );
}
