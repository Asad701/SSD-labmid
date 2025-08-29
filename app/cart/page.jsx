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
  const [refresh, setRefresh] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // VERIFY LOGIN
  useEffect(() => {
    const checkLoggedIn = () => {
      const cookieStr = document.cookie;
      const match = cookieStr
        .split("; ")
        .find((cookie) => cookie.startsWith("logged_in="));
      setLoggedIn(match?.split("=")[1] === "true");
    };
    checkLoggedIn();
    window.addEventListener("focus", checkLoggedIn);
    return () => window.removeEventListener("focus", checkLoggedIn);
  }, []);

  // FETCH CART ITEMS
  useEffect(() => {
    const fetchCart = async () => {
      if (!loggedIn) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/account?get=cart");
        if (!res.ok) {
          setNotFound(true);
          setNotFoundMessage("Cart is empty.");
          setProducts([]);
          return;
        }
        const data = await res.json();
        const flatProducts = data.map(item => ({
          ...item.carts[0],
          productcount: item.productcount,
        }));
        setProducts(flatProducts);
        setNotFound(false);
        setNotFoundMessage('');
      } catch (err) {
        setNotFound(true);
        setNotFoundMessage('Error: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [refresh, loggedIn]);

  // REMOVE PRODUCT FROM CART
  const handleRemove = async (e, productId) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/account?remove=cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productid: productId }),
      });
      if (res.ok) {
        setRefresh(prev => !prev);
        router.refresh();
      }
    } catch {
      // fail silently
    }
  };

  // REMOVE ONE ITEM QUANTITY
  const handleRemoveitem = async (productId) => {
    try {
      const res = await fetch("/api/account?remove=cartitem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productid: productId }),
      });
      if (res.ok) {
        setRefresh(prev => !prev);
      }
    } catch {
      // fail silently
    }
  };

  // ADD ONE MORE ITEM TO CART
  const handleAddMore = async (productid) => {
    try {
      const res = await fetch(`/api/account?addto=cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productid }),
      });
      if (res.ok) {
        setRefresh(prev => !prev);
      }
    } catch {
      // fail silently
    }
  };

  // CALCULATE TOTAL PRICE WITH DISCOUNT
  const cartTotal = products.reduce((acc, item) => {
    const unitPrice = item.price - item.discount;
    let discountPercent = 0;
    if (item.productcount >= 3 && item.productcount <= 4) discountPercent = 0.40;
    else if (item.productcount >= 5) discountPercent = 0.50;

    const totalBeforeDiscount = unitPrice * item.productcount;
    const additionalDiscount = totalBeforeDiscount * discountPercent;
    return acc + (totalBeforeDiscount - additionalDiscount);
  }, 0);

  return (
    <>
      {loggedIn ? (
        <main className="relative flex flex-col gap-6 w-full my-2 bg-gray-200 rounded-xl p-4 md:p-6 lg:p-10">

          {loading ? (
            <div className="flex items-center justify-center w-full bg-black py-10"><Loading /></div>
          ) : notFound ? (
            <div className="text-red-600 text-center w-full py-10">{notFoundMessage}</div>
          ) : (
            products.map((item, idx) => {
              const unitPrice = item.price - item.discount;
              let discountPercent = 0;
              if (item.productcount >= 3 && item.productcount <= 4) discountPercent = 0.40;
              else if (item.productcount >= 5) discountPercent = 0.50;

              const totalBeforeDiscount = unitPrice * item.productcount;
              const additionalDiscount = totalBeforeDiscount * discountPercent;
              const totalAfterDiscount = totalBeforeDiscount - additionalDiscount;

              return (
                <div
                  key={`${item.productid}-${idx}`}
                  className="relative flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-300 w-full py-4 px-4 rounded-md"
                >
                  <div className="flex items-center gap-4 w-full lg:w-1/3 bg-blue-950 p-3 rounded-md cursor-pointer hover:shadow-lg transition-shadow duration-200">
                    <Image
                      src={`/${item.mainimage}`}
                      alt={item.title}
                      width={100}
                      height={90}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex flex-col gap-1 text-white flex-1">
                      <div className="text-base font-semibold line-clamp-2">{item.title}</div>
                    </div>

                    <button
                      aria-label="Add one more item"
                      onClick={() => handleAddMore(item.productid)}
                      className="bg-black text-white rounded-full w-7 h-7 flex justify-center items-center hover:bg-black/70 transition-colors"
                    >
                      +
                    </button>

                    <button
                      aria-label="Remove one item"
                      onClick={() => handleRemoveitem(item.productid)}
                      className="bg-black text-white rounded-full w-7 h-7 flex justify-center items-center hover:bg-black/70 transition-colors"
                    >
                      -
                    </button>
                  </div>

                  <div className="text-lg font-semibold w-full lg:w-auto text-center lg:text-left">
                    Items: <span className="text-xl">{item.productcount}</span>
                  </div>

                  <div className="bg-blue-700 rounded-xl p-4 w-full lg:w-[300px] flex flex-col gap-2 items-center lg:items-end ">
                    <div className="text-white text-lg">
                      Unit Price: ${unitPrice.toFixed(2)}
                    </div>
                    <div className="font-semibold underline text-white">
                      x {item.productcount}
                    </div>

                    {discountPercent > 0 && (
                      <div className="text-white font-semibold">
                        Additional discount: ${additionalDiscount.toFixed(2)}
                      </div>
                    )}

                    <div className="text-2xl font-bold text-white">
                      Total: ${totalAfterDiscount.toFixed(2)}
                    </div>
                  </div>

                  <button
                    aria-label="Remove product from cart"
                    onClick={(e) => handleRemove(e, item.productid)}
                    className="absolute top-2 right-2 bg-black text-white rounded-full w-6 h-6 flex justify-center items-center hover:bg-black/70 transition-colors"
                  >
                    &times;
                  </button>
                </div>
              );
            })
          )}

          {!dialog ? (
            <div className="fixed flex flex-col justify-center items-center gap-2 bottom-5 left-5 z-30 w-[150px] h-[150px] md:w-[250px] md:h-[200px] bg-black text-white rounded-xl p-8">
              <span className="underline text-lg">Cart Total</span>
              <span className="text-3xl font-bold">${cartTotal.toFixed(2)}</span>
              <button
                aria-label="Close cart summary"
                className="absolute top-[-15px] right-[-15px] text-xl bg-blue-500 w-[40px] h-[40px] rounded-full flex justify-center items-center hover:bg-blue-900 transition-colors"
                onClick={() => setDialog(!dialog)}
              >
                &times;
              </button>
              <Link
                href="/order"
                className="bg-white text-black w-full py-2 text-center rounded-md hover:bg-blue-700 hover:text-white transition-colors"
              >
                Order Now
              </Link>
            </div>
          ) : (
            <button
              className="fixed left-5 z-30 w-[120px] h-[50px] bg-black hover:bg-blue-700 text-white rounded-tr-lg rounded-br-lg"
              onClick={() => setDialog(!dialog )}
            >
              Click here to total
            </button>
          )}

        </main>
      ) : (
        <div className="flex justify-center items-center text-xl text-red-500 bg-white h-screen w-full p-10">
          Please login / Register First
        </div>
      )}
    </>
  );
}
