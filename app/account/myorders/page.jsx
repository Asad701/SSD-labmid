'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Loading from '@/app/components/Loading';

export default function MyInfoPage() {
  const [orders, setOrders] = useState([]);
  const [shipped, setShipped] = useState([]);
  const [nShipped, setNShipped] = useState([]);
  const [message, setMessage] = useState('');
  const [select, setSelect] = useState('');
  const router = useRouter();

  // Fetch orders
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/account?get=orders');
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setMessage(data.message || 'Failed to load orders');
        }
      } catch (err) {
        setMessage('An error occurred while fetching user data.');
      }
    };
    fetchUser();
  }, []);

  // Separate orders into shipped & not shipped
  useEffect(() => {
    const shippedArr = [];
    const notShippedArr = [];

    orders.forEach((order) => {
      if (order.shipped) {
        shippedArr.push(order);
      } else {
        notShippedArr.push(order);
      }
    });

    setShipped(shippedArr);
    setNShipped(notShippedArr);
  }, [orders]);

  const handleShipped = (type) => {
    setSelect(type);
  };

  if (!orders.length && !message) {
    return <div className="w-full h-auto flex justify-center items-center p-8 bg-black"><Loading /></div>;
  }

  return (
    <main className='p-4 bg-white w-full flex flex-col gap-4 items-center justify-start min-h-screen'>
      <h1 className='w-full p-5 text-2xl bg-blue-700 text-white text-center rounded-full shadow'>
        Select Option
      </h1>

      <div className="w-full md:w-[60%] p-6 bg-blue-100 rounded-xl flex justify-evenly items-center shadow">
        <button
          className={`bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg px-6 py-3 ${select === 'shipped' ? 'ring-2 ring-white' : ''}`}
          onClick={() => handleShipped('shipped')}
        >
          Shipped Orders
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-600 transition text-white rounded-lg px-6 py-3 ${select === 'notshipped' ? 'ring-2 ring-white' : ''}`}
          onClick={() => handleShipped('notshipped')}
        >
          Not Shipped Yet
        </button>
      </div>

      <div className='flex flex-col gap-4 w-[95%] md:w-[85%] max-h-[600px] overflow-auto bg-blue-50 rounded-xl p-4 shadow-md'>
        {select === 'shipped' && shipped.length === 0 && (
          <div className="text-center text-blue-700 font-semibold text-lg p-6 bg-white rounded-xl shadow">
            🚚 You have no ( shipped orders ) yet!
          </div>
        )}
        {select === 'notshipped' && nShipped.length === 0 && (
          <div className="text-center text-blue-700 font-semibold text-lg p-6 bg-white rounded-xl shadow">
            📦 No pending shipments at the moment!
          </div>
        )}

        {select === 'shipped' && shipped.map((or, index) => (
          <OrderCard key={index} order={or} />
        ))}
        {select === 'notshipped' && nShipped.map((or, index) => (
          <OrderCard key={index} order={or} />
        ))}
      </div>
    </main>
  );
}

function OrderCard({ order }) {
  return (
    <div className='bg-white p-4 rounded-xl shadow-md flex flex-col gap-3 border border-blue-100'>
      <div className='text-blue-800 font-semibold text-lg'>🧾 Order Details</div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div><strong>Order ID:</strong> {order.orderid}</div>
        <div><strong>Total:</strong> ${order.orderprice}</div>
        <div><strong>Shipping Address:</strong> {order.shippingaddress}</div>
        {order.dhltracking && (
          <>
            <div><strong>DHL Tracking:</strong> {order.dhltracking}</div>
            <div><strong>Shipped At:</strong> {order.modifiedAt}</div>
          </>
        )}
      </div>

      <div className='text-blue-800 font-semibold mt-2 text-lg'>👤 User Info</div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
        <div><strong>User ID:</strong> {order.userid}</div>
        <div><strong>Name:</strong> {order.name}</div>
        <div><strong>Email:</strong> {order.email}</div>
        <div><strong>Contact:</strong> {order.contactno}</div>
      </div>

      <div className='text-blue-800 font-semibold mt-2 text-lg'>🛍️ Products</div>
      <div className='flex gap-4 overflow-x-auto scrollbar-hide'>
        {order.products.map((pro, i) => (
          <div key={i} className='flex gap-2 bg-blue-100 p-2 rounded-lg min-w-[180px] shadow'>
            <Image src={`/${pro.details.mainimage}`} width={50} height={60} alt='product' />
            <div className='flex flex-col text-sm'>
              <div><strong>{pro.title}</strong></div>
              <div>ID: {pro.pid}</div>
              <div>Qty: {pro.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
