'use client';
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ProductsGrid from "../components/ProductsGrid";
import FilterBar from "../components/FilterBar";
import NotFound from "../components/NotFound";
import Image from "next/image";

// 🚀 Lazy load AsideBar (only when needed)
const AsideBar = dynamic(() => import("../components/AsideBar"), { ssr: false });

export default function Products({ initialProducts, initialCategory }) {
  const [products, setProducts] = useState(initialProducts);
  const [cat, setCat] = useState(initialCategory);
  const [filters, setFilters] = useState({ category: initialCategory, maxPrice: 1449 });
  const [order, setOrder] = useState('inc');
  const [view, setView] = useState('grid');
  const [aside, setAside] = useState(true);

  // Apply filters and sorting client-side
  useEffect(() => {
    let filtered = [...initialProducts];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    filtered = filtered.filter(p => p.price - (p.discount || 0) <= filters.maxPrice);

    if (order === 'inc') filtered.sort((a, b) => a.price - b.price);
    else if (order === 'dec') filtered.sort((a, b) => b.price - a.price);
    else if (order === 'a-z') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (order === 'z-a') filtered.sort((a, b) => b.title.localeCompare(a.title));
    else if (order === 'pop') filtered.sort((a, b) => b.sellingcount - a.sellingcount);

    setProducts(filtered);
  }, [filters, order, initialProducts]);

  const handleAside = () => setAside(!aside);
  const handleOrder = (type) => setOrder(type);
  const handleView = (type) => setView(type);

  if (!products || products.length === 0) {
    return <NotFound />;
  }

  return (
    <main className="relative flex gap-2 w-full">
      {/* Desktop Sidebar */}
      {!aside && (
        <div className="hidden lg:block md:block lg:w-1/4 md:w-1/4">
          <AsideBar setFilters={setFilters} filters={filters} />
        </div>
      )}

      {/* Mobile Sidebar */}
      {!aside && (
        <div className="lg:hidden block w-screen z-15 absolute left-0 bg-gray-100">
          <button
            className="flex justify-center items-center w-[70px] bg-black p-2 rounded-full"
            onClick={handleAside}
          >
            <Image src="/closeW.svg" alt="filter" width={50} height={50} />
          </button>
          <AsideBar setFilters={setFilters} filters={filters} />
        </div>
      )}

      <div className="flex flex-col montserrat-font gap-1 justify-start w-full items-center">
        <div className="flex w-full">
          <button
            className="relative montserrat-font flex justify-center items-center w-[70px] bg-black text-white rounded-full"
            onClick={handleAside}
          >
            <Image src={aside ? '/filterW.svg' : '/filterCW.svg'} alt="filter" width={30} height={30} />
          </button>
          <FilterBar total={products.length} setOrder={handleOrder} setViewType={handleView} />
        </div>

        {products.length > 0 && (
          <ProductsGrid items={products} view={view} />
        )}
      </div>
    </main>
  );
}