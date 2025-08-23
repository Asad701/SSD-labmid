'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import LuxuryCollection from '@/app/components/LuxuryCollection';
import Loading from '@/app/components/Loading';
import NotFound from '@/app/components/NotFound';
import PaymentMethods from '@/app/components/PaymentMethods';

export default function ProductPage() {
  const pathname = usePathname();
  const PATH = pathname.split('/').filter(Boolean);
  const [disable, setDisable] = useState(false);

  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [main, setMain] = useState('');
  const [gallery, setGallery] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Comments
  const [reviews, setReviews] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Description
  const [showDescription, setShowDescription] = useState(false);

  // Check login
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const loggedInCookie = document.cookie.includes('logged_in=true');
      setIsLoggedIn(loggedInCookie);
    }
  }, []);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const res = await fetch(`/api/products?search=${slug}`, { cache: 'no-store' });
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        if (!data.length) setNotFound(true);
        else {
          setProduct(data[0]);
          setMain(data[0].mainimage);
          setGallery(data[0].gallery);
          fetchReviews(data[0].productid);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Fetch reviews
  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`/api/comments?get=${productId}`);
      if (!res.ok) return;
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  // Add to cart
  const handleAddToCart = async (productid) => {
    try {
      const res = await fetch(`/api/account?addto=cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productid })
      });
      const data = await res.json();
      alert(data.message || 'Added to cart');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Update handleCommentSubmit
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setDisable(true); // Disable button immediately
    const payload = { productid: product.productid, comment: commentText.trim() };
    if (!isLoggedIn) {
      if (!userName.trim() || !userEmail.trim()) {
        setDisable(false); // Re-enable if validation fails
        return;
      }
      payload.userName = userName.trim();
      payload.userEmail = userEmail.trim();
    }
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setCommentText('');
        setUserName('');
        setUserEmail('');
        setCommentSuccess(true);
        fetchReviews(product.productid);
        setTimeout(() => setCommentSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDisable(false); // Re-enable after request finishes
    }
  };

  // View cart
  const handleViewCart = () => window.location.href = '/cart';

  // Image swap
  const handleImageClick = (img) => {
    setMain(img);
    const newGallery = gallery.filter((image) => image !== img);
    newGallery.unshift(main);
    setGallery(newGallery);
  };

  // Large preview
  const handlePreviewImage = () => setPreviewImage(main);

  if (loading) return <div className="flex items-center justify-center bg-black"><Loading /></div>;
  if (notFound) return <NotFound />;

  const discountedPrice = product.price - product.discount;

  return (
    <div className="flex flex-col w-full justify-center items-center gap-5 bg-white">
      {/* Breadcrumb */}
      <div className="text-sm gap-2 p-2 flex flex-row w-full justify-center items-center mt-4">
        <Link href="/" className="montserrat-font text-red-500 text-md hover:underline hover:text-blue-500">Home</Link>
        {PATH.map((slug, i) => {
          const href = '/' + PATH.slice(0, i + 1).join('/');
          const isLast = i === PATH.length - 1;
          return (
            <span key={i} className="montserrat-font flex items-center gap-2 text-red-500 text-md">
              <span>{'>'}</span>
              {isLast ? <span className="text-red-500">{decodeURIComponent(slug)}</span> :
                <Link href={href} className="hover:underline hover:text-blue-500">{decodeURIComponent(slug)}</Link>}
            </span>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold montserrat-font mb-4 block md:hidden lg:hidden">{product.title}</h1>
        <div className="flex flex-col md:flex-row lg:flex-row md:justify-evenly lg:justify-evenly gap-7">

          {/* Images */}
          <div className="flex flex-col w-full">
            <div className="relative w-full">
              <Image src={`/${main}`} alt={product.title} width={500} height={500} className="rounded-lg object-contain w-full p-2" onClick={handlePreviewImage} onContextMenu={(e) => e.preventDefault()} />
              {product.discount > 0 &&
                <div className="absolute top-0 left-0 bg-gradient-to-r from-red-600 to-red-400 text-white p-2 rounded-full font-bold animate-pulse">
                  🔥 {Math.round((product.discount / product.price) * 100)}% OFF
                </div>
              }
            </div>
            <div className="flex gap-1 p-2 w-full overflow-auto">
              {gallery.map((img, i) => (
                <Image key={i} src={`/${img}`} alt={`Gallery ${i}`} width={80} height={80} className="rounded-sm border object-cover" onClick={() => handleImageClick(img)} onContextMenu={(e) => e.preventDefault()} />
              ))}
            </div>
          </div>

          {/* Large Preview */}
          {previewImage &&
            <div className="fixed top-0 left-0 w-screen h-screen z-50 flex justify-center items-center bg-black bg-opacity-70" onClick={() => setPreviewImage('')}>
              <Image src={`/${main}`} alt={product.title} fill className="object-contain" onContextMenu={(e) => e.preventDefault()}/>
              <div className="absolute top-5 right-5 w-12 h-12 flex justify-center items-center rounded-full bg-white p-3 hover:bg-white/70" >
                <Image src="/closefullB.svg" width={30} height={30} alt="Close" onContextMenu={(e) => e.preventDefault()}/>
              </div>
            </div>
          }

          {/* Details */}
          <div className="flex flex-col p-2 w-full mt-4 gap-4">
            <h1 className="text-3xl font-bold montserrat-font hidden md:block lg:block">{product.title}</h1>
            <h3 className="montserrat-font">Product-ID: {product.productid}</h3>
            <div className="text-lg font-semibold montserrat-font">
              Price: <span className="line-through text-xl text-red-500 mr-2">${product.price}</span>
              <span className="text-green-600 text-2xl">${discountedPrice}</span>
            </div>
            <div className="text-md font-semibold montserrat-font">
              Additional Discount: <span className="text-green-500 text-sm">{"15% (for products > 2)"}</span>
            </div>

            {/* Tags */}
            <div>
              <span className="font-medium montserrat-font">Tags:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.tags.map((tag, i) => (
                  <span key={i} className="montserrat-font text-xs bg-gray-200 px-2 py-1 rounded">#{tag}</span>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col  gap-2 w-full mt-2">
              <button className="bg-blue-950 text-white flex-1 pl-10 pr-10 pt-2 pb-2 rounded hover:bg-blue-800 transition" onClick={() => handleAddToCart(product.productid)}>Add to Cart</button>
              <button className="bg-blue-950 text-white flex-1 pl-10 pr-10 pt-2 pb-2 rounded hover:bg-blue-800 transition" onClick={handleViewCart}>View Cart</button>
            </div>

            {/* Payment Methods */}
            <div className="mt-4 w-full">
              <PaymentMethods />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-3 w-full">
          <button onClick={() => setShowDescription(!showDescription)} className="w-full text-left font-semibold text-2xl text-blue-800 flex justify-between">
            Product Description <span className="text-3xl">{showDescription ? '▲' : '▼'}</span>
          </button>
          {showDescription && (
            <div className="bg-blue-100 p-2 rounded-lg my-2">
              <pre className="montserrat-font text-sm md:text-lg text-gray-700 whitespace-pre-wrap">{product.description}</pre>
              <div className="text-lg text-center font-semibold montserrat-font mt-2">
                Package Size: <span className="text-green-500">{product.dimension}</span>
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="border-t pt-4 mt-4 w-full">
          <button onClick={() => setShowComments(!showComments)} className="w-full text-left font-semibold text-2xl text-blue-800 flex justify-between">
            Customer Reviews {reviews.length !== 0 && <>( {reviews.length}  )</>} <span className="text-3xl">{showComments ? '▲' : '▼'}</span>
          </button>
          {showComments && (
            <div className="mt-6 flex flex-col justify-center items-center space-y-4">
              {/* Input for non-logged users */}
              {!isLoggedIn && (
                <>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your name" className="w-[70%] p-2  rounded-sm bg-blue-100 montserrat-font border-2 border-blue-500" />
                  <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Your email" className="w-[70%] p-2  rounded-sm bg-blue-100 montserrat-font border-2 border-blue-500" />
                </>
              )}
              <textarea rows={4} value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write your review..." className="w-[70%] p-2  bg-blue-100 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 montserrat-font border-2 border-blue-500" />
              <button  onClick={handleCommentSubmit}  disabled={disable}   className={`bg-blue-900 w-[70%] text-white px-2 py-2 rounded hover:bg-blue-800 transition montserrat-font ${disable ? 'opacity-50 cursor-not-allowed' : ''}`}>
                Submit Review
              </button>
              {commentSuccess && <p className="text-green-600 text-sm">Review submitted successfully!</p>}

              {/* Display reviews */}
              <div className="w-[70%] mt-4">
                {reviews.length === 0 && <p>No reviews yet.</p>}
                {reviews.map((r, i) => (
                  <div key={i} className="px-5 py-2 mb-2 bg-gray-100 rounded-md">
                    <p className="text-lg">"  {r.comment} "</p>
                    <p className="text-sm text-end">{r.userName || 'Anonymous'}</p>
                    
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Luxury Collection */}
      <div className="bg-gray-200 rounded-2xl w-full mt-10">
        <LuxuryCollection />
      </div>
    </div>
  );
}
