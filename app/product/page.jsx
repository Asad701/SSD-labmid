import Products from './Products';

export default async function ProductPage({ searchParams }) {
  const category = searchParams?.category || "";

  // 🚀 Fetch products server-side (no client-side fetching needed for first paint)
  const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`, {
    cache: 'no-store',
  });
  const products = await res.json();

  return <Products initialProducts={products} initialCategory={category} />;
}