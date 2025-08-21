'use client';
import { useState } from 'react';

export default function CardModal({ onClose, onConfirm }) {
  const [card, setCard] = useState({
    number: '', name: '', expiry: '', cvv: ''
  });

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handleConfirm = () => {
    if (!card.number || !card.name || !card.expiry || !card.cvv) {
      alert('Please fill all fields.');
      return;
    }
    onConfirm(card);
  };

  return (
    <div className="fixed montserrat-font inset-0 bg-gradient-to-r from-teal-500 to-blue-700 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white montserrat-font rounded-lg p-6 w-[400px] space-y-4 shadow-xl relative">
        <h2 className="text-xl montserrat-font font-bold text-black">Enter Card Details</h2>
        <input
          name="number"
          onChange={handleChange}
          placeholder="Card Number"
          className="p-2 w-full montserrat-font rounded-lg bg-blue-100 text-black"
        />
        <input
          name="name"
          onChange={handleChange}
          placeholder="Card Holder Name"
          className="p-2 w-full montserrat-font rounded-lg bg-blue-100 text-black"
        />
        <input
          name="expiry"
          onChange={handleChange}
          placeholder="MM/YY"
          className="p-2 w-full montserrat-font rounded-lg bg-blue-100 text-black"
        />
        <input
          name="cvv"
          onChange={handleChange}
          placeholder="CVV"
          className="p-2 w-full montserrat-font rounded-lg bg-blue-100 text-black"
        />
        <div className="flex montserrat-font justify-between pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border hover:bg-red-500 rounded montserrat-font text-black hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white montserrat-font px-4 py-2 rounded hover:bg-blue-400"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
