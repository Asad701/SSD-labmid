// components/PaymentMethods.js
import Image from "next/image";

export default function PaymentMethods() {
  return (
    <div className="bg-white rounded-lg w-full shadow-md p-3 mx-auto mt-3">
      <h2 className="text-xl font-semibold text-gray-600 mb-4 text-center">
        Secure Payment Methods
      </h2>
      <div className="flex justify-center items-baseline gap-5 overflow-x-auto scrollbar-hide flex-wrap">
        {/* Visa */}
        <Image
          src="/payment-icons/visa.png"
          alt="Visa"
          width={60}
          height={40}
          className="object-contain rounded-lg"
        />
        {/* Mastercard */}
        <Image
          src="/payment-icons/mastercard.png"
          alt="Mastercard"
          width={60}
          height={40}
          className="object-contain rounded-lg"
        />
        {/* American Express */}
        <Image
          src="/payment-icons/amex.png"
          alt="American Express"
          width={60}
          height={40}
          className="object-contain rounded-lg"
        />
        {/* Discover */}
        <Image
          src="/payment-icons/discover.png"
          alt="Discover"
          width={60}
          height={40}
          className="object-contain rounded-lg"
        />
        {/* PayPal */}
        <Image
          src="/payment-icons/paypal.png"
          alt="PayPal"
          width={80}
          height={40}
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
