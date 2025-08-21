'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LuxuryCollection() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/luxuryproducts', {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const items = await res.json();
        setProducts(items);
      } catch (error) {
        console.error('Error fetching luxury products:', error.message);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="montserrat-font z-10 w-full px-4 py-10 mt-4">
      <div className=" montserrat-font flex justify-between items-center mb-6">
        <h2 className=" montserrat-font text-3xl font-bold text-gray-900">Premium Collection</h2>
      </div>
      <div className=" montserrat-font flex justify-start p-1 overflow-x-auto gap-6 scrollbar-hide">
        {Array.isArray(products) && products.map((product, idx) => (
          <Link
            key={`${product.slug}-${idx}`}
            href={`/product/${product.title}`}
            className=" montserrat-font min-w-[240px] w-[240px] h-[300px] bg-white p-4 flex-shrink-0 transform hover:scale-110 hover:z-15"
          >
            <div className="montserrat-font relative w-[200px] h-[160px] mb-4 overflow-hidden">
              <Image
                src={product.mainimage ? `/${product.mainimage}` : '/logo.png'}

                alt={product.title || 'Product Image'}
                layout="fill"
                objectFit="cover"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
            <h3 className=" montserrat-font text-lg font-bold italic text-gray-900 line-clamp-2">
              {(product.title)}
            </h3>
            <p className=" montserrat-font text-l text-gray-700 italic ">
              Price: <span className=" montserrat-font text-xl text-green-600">${product.price - product.discount}</span>
            </p>
          </Link>
        ))}
      </div>
      <div className=" montserrat-font flex justify-between items-center mb-6">
        <Link href="/product" className=" montserrat-font text-black underline font-medium hover:text-amber-600 pt-2">
          View all products
        </Link>
      </div>
    </section>
  );
}
