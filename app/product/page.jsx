'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductsGrid from '../components/ProductsGrid';
import AsideBar from '../components/AsideBar';
import FilterBar from '../components/FilterBar';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';
import Image from 'next/image';

export default function Product() {
  const [cat, setCat] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [notFoundState, setNotFoundState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aside, setAside] = useState(true);
  const [order, setOrder] = useState('inc');
  const [view, setView] = useState('grid');
  const router = useRouter();
  const [filters, setFilters] = useState({
    category: '',
    maxPrice: 1449,
  });

  // Read category from URL on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("category") || "";
      setCat(category);
      setFilters((prev) => ({ ...prev, category }));
    }
  }, [router]); 


  // Fetch products whenever category changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setNotFoundState(false);
      

      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(cat || '')}`, { cache: 'no-store' });
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setAllProducts(data);
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
  }, [cat]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.category) {
      router.push(`/product?category=${encodeURIComponent(filters.category)}`, { scroll: false });
    }

    filtered = filtered.filter(p => p.price - (p.discount || 0) <= filters.maxPrice);

    if (order === 'inc') filtered.sort((a, b) => a.price - b.price);
    else if (order === 'dec') filtered.sort((a, b) => b.price - a.price);
    else if (order === 'a-z') filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (order === 'z-a') filtered.sort((a, b) => b.title.localeCompare(a.title));
    else if (order === 'pop') filtered.sort((a, b) => b.sellingcount - a.sellingcount);

    setProducts(filtered);
  }, [filters, order, allProducts]);

  const handleAside = () => setAside(!aside);
  const handleOrder = (type) => setOrder(type);
  const handleView = (type) => setView(type);

  if (notFoundState && !loading) return <NotFound />;
  if (loading) return <div className="flex items-center justify-center w-full h-full bg-black"><Loading /></div>;

  return (
    <main className="relative flex gap-2 w-full">
      {!aside && (
        <div className="hidden lg:block md:block lg:w-1/4 md:w-1/4">
          <AsideBar setFilters={setFilters} filters={filters} />
        </div>
      )}
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
