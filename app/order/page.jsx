'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function OrderPage() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch cart products
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/account?get=cart");
        const data = await res.json();
        const flatProducts = data.map((item) => ({
          ...item.carts[0],
          productcount: item.productcount,
        }));
        setProducts(flatProducts);
      } catch (err) {
        console.error(err);
        setMessage('Error loading cart');
      }
    };
    fetchCart();
  }, []);

  // Update order products + total when cart loads
  useEffect(() => {
    const items = products.map((pro) => ({
      id: pro.productid,
      qty: pro.productcount,
    }));

    const total = products.reduce((acc, item) => {
      const price = item.price - (item.discount || 0);
      return acc + item.productcount * price;
    }, 0);

    setOrder({ products: items, total });
  }, [products]);

  // Handle Buy Now click
  const handlePay = async () => {
    if (!order.products.length) return;
    setLoading(true);

    try {
      const res = await fetch('/api/create-buy-link', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: order.products }),
      });

      const data = await res.json();

      if (data.url) {
        // Redirect immediately to 2Checkout
        window.location.href = data.url;
      } else {
        alert(data.error || "Error creating buy link");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 p-4">
      {/* Checkout button */}
      {products.length > 0 && (
        <button
          onClick={handlePay}
          disabled={loading}
          className={`w-full sm:w-[50%] mt-4 py-3 rounded-xl font-semibold text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
          }`}
        >
          {loading ? "Processing your order..." : "Click here to Buy Now"}
        </button>
      )}

      {/* Total display */}
      <div className="w-full text-xl font-bold text-center text-white bg-gradient-to-r from-teal-500 to-blue-700 py-2 rounded-lg mt-4">
        TOTAL: ${order.total.toFixed(2)}
      </div>

      {/* Cart items in grid */}
      <div className="w-full bg-gray-100 rounded-xl mt-4 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.length === 0 ? (
          <div className="text-gray-600 text-center py-6 col-span-full">Cart is empty</div>
        ) : (
          products.map((item, idx) => (
            <div key={`${item.productid}-${idx}`} className="bg-white p-3 rounded-lg shadow-md flex flex-col items-center">
              <Image
                src={`/${item.mainimage}`}
                alt={item.title}
                width={150}
                height={150}
                className="rounded-lg object-cover"
              />
              <div className="mt-2 text-center">
                <div className="font-semibold">{item.title}</div>
                <div className="text-gray-600">Qty: {item.productcount}</div>
                <div className="text-teal-600 font-bold text-lg">
                  ${(item.productcount * (item.price - (item.discount || 0))).toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {message && <div className="text-red-500 mt-4">{message}</div>}
    </div>
  );
}
