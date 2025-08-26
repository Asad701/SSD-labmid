'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import ProductsGrid from '../components/ProductsGrid';
import AsideBar from '../components/AsideBar';
import FilterBar from '../components/FilterBar';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';
import Image from 'next/image';

export default function Product() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [notFoundState, setNotFoundState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aside, setAside] = useState(true);
  const [order, setOrder] = useState('inc');
  const [view, setView] = useState('grid');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const router = useRouter();

  const [filters, setFilters] = useState({
    category: '',
    maxPrice: 1449,
  });

  const nextPage = () => {
    if (page < Math.ceil(total / 12)) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  // Fetch products whenever filters.category or page changes
  useEffect(() => {
    const fetchData = async () => {
      let category = ""
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        category= params.get("category") || "";
      } 
      setLoading(true);
      setNotFoundState(false);

      try {
        const res = await fetch(
          `/api/products?category=${encodeURIComponent(filters.category || category || '')}&page=${encodeURIComponent(page)}`,
          { cache: 'no-store' }
        );
        const data = await res.json();

        if (Array.isArray(data.products) && data.products.length > 0) {
          setAllProducts(data.products);
          setTotal(data.total);
        } else {
          setAllProducts([]);
          setNotFoundState(true);
          
        }
      } catch (error) {
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // keep URL in sync with filters
    router.push(
      `/product?category=${encodeURIComponent(filters.category || '')}&page=${encodeURIComponent(page)}`,
      { scroll: false }
    );
  }, [filters.category, page, router]);

  // Apply price filter + sorting
  useEffect(() => {
    let filtered = [...allProducts];

    filtered = filtered.filter(
      (p) => p.price - (p.discount || 0) <= filters.maxPrice
    );

    if (order === 'inc') filtered.sort((a, b) => a.price - b.price);
    else if (order === 'dec') filtered.sort((a, b) => b.price - a.price);
    else if (order === 'a-z') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (order === 'z-a') filtered.sort((a, b) => b.title.localeCompare(a.title));
    else if (order === 'pop') filtered.sort((a, b) => b.sellingcount - a.sellingcount);

    setProducts(filtered);
  }, [filters.maxPrice, order, allProducts]);

  const handleAside = () => setAside(!aside);
  const handleOrder = (type) => setOrder(type);
  const handleView = (type) => setView(type);

  if (notFoundState && !loading) return <NotFound />;
  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-full bg-black">
        <Loading />
      </div>
    );

  return (
    <main className="relative flex gap-2 w-full">
      {/* AsideBar for large screens */}
      {!aside && (
        <div className="hidden lg:block md:block lg:w-1/4 md:w-1/4">
          <AsideBar setFilters={setFilters} filters={filters} />
        </div>
      )}

      {/* AsideBar as overlay for mobile */}
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
            <Image
              src={aside ? '/filterW.svg' : '/filterCW.svg'}
              alt="filter"
              width={30}
              height={30}
            />
          </button>
          <FilterBar
            total={products.length}
            setOrder={handleOrder}
            setViewType={handleView}
          />
        </div>

        {products.length > 0 && (
          <ProductsGrid items={products} view={view} />
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          {/* Prev Button */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <button
              disabled={page <= 1}
              onClick={prevPage}
              className="flex items-center px-4 py-2 rounded-2xl border border-gray-300 shadow-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </button>
          </motion.div>

          {/* Fancy Page Indicator */}
          <motion.div
            key={page} // animates when page changes
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg"
          >
            Page {page}
          </motion.div>

          {/* Next Button */}
          <motion.div whileTap={{ scale: 0.9 }}>
            <button
              disabled={page >= Math.ceil(total / 12)}
              onClick={nextPage}
              className="flex items-center px-4 py-2 rounded-2xl border border-gray-300 shadow-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
