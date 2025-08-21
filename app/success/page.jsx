"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderRef = params.get("orderRef"); 

    if (!orderRef) {
      setError("Missing order reference");
      setLoading(false);
      return;
    }

    fetch(`/api/orders/verify?orderRef=${orderRef}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.paymentVerified) {
          setOrder(data.order);
        } else {
          setError(data.error || "Payment verification failed");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="w-full h-full bg-black flex items-center justify-center"><Loading/></div>;
  if (error) return <p className="text-red-600">❌ {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-green-600 text-xl font-bold">✅ Payment Successful</h1>
      <p>Thank you, {order?.customerName || "Customer"}!</p>
      <p>
        Total Paid: <strong>{order?.total}</strong> {order?.currency}
      </p>

      <h2 className="mt-4 font-semibold">Your Items:</h2>
      <ul className="list-disc pl-6">
        {order?.items?.map((item, i) => (
          <li key={i}>
            {item.name} × {item.quantity} — {item.price} {order?.currency}
          </li>
        ))}
      </ul>
    </div>
  );
}
