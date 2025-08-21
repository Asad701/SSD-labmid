"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Categorybar from "./Catagorybar";

export default function Nav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState(true);
  const [favcount, setFavCount] = useState(0);
  const [cartcount, setCartCount] = useState(0);
  const router = useRouter();
  const [ size , setSize] = useState('small')
  const [ menu , setMenu] = useState(true)

  // WINDOW SIZE
  useEffect(()=>{
    const windowResizer = ()=>{
      if(window.innerWidth < 640){
        setSize('small')
      }
      else{
        setSize('lg')
      }
    }
    windowResizer();
    window.addEventListener('resize' ,windowResizer );
    return ()=>{
      window.removeEventListener('resize' ,windowResizer );
    }
  },[])

  // HANDLE SEARCH
  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/product/${search}`);
    }
  };
  
  // HANDLE CATEGORY
  const HandleCategory =()=>{
    setCat(!cat)
  }

  // CHECK LOGIN
  useEffect(() => {
    const checkLoggedIn = () => {
      const cookieStr = document.cookie;
      const match = cookieStr
        .split("; ")
        .find((cookie) => cookie.startsWith("logged_in="));
      if (match && match.split("=")[1] === "true") {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    };
    checkLoggedIn();
    window.addEventListener("focus", checkLoggedIn);
    return () => window.removeEventListener("focus", checkLoggedIn);
  }, []);

  
  // FETCH FAVOURITES
  useEffect(() => {
    const fetchFav = async () => {
      try {
        const res = await fetch("/api/account?get=fav");
        if (!res.ok) throw new Error("Failed to fetch cart");
          const data = await res.json();
          const flatProducts = data.flatMap(item => item.favs);
          setFavCount(flatProducts.length);
      } catch (err) {
          console.log(err);
      }
    };
    if(loggedIn) fetchFav();
  }, [loggedIn]);

  // FETCH CART
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/account?get=cart");
        if (!res.ok) throw new Error("Failed to fetch cart");

        const data = await res.json();

        // Sum all productcount values from each item
        const total = data.reduce((acc, item) => acc + (item.productcount || 0), 0);

        setCartCount(total);
      } catch (err) {
        console.error("Cart fetch error:", err);
      }
    };

    if(loggedIn) fetchCart();
  }, [loggedIn]);

 
  // HANDLE MENU
  const handleMenu=()=>{
    setMenu(!menu);
  }

  return (
    <>
      <pre className="montserrat-font flex justify-center bg-gray-900 font-normal text-white text-sm p-[10px]">
        Welcome to our site {" - "}
        <Link
          href="/"
          className=" montserrat-font font-bold hover:text-amber-300 ml-1"
        >
          home page
        </Link>
      </pre>
      <div className="montserrat-font flex justify-center bg-white text-black text-sm py-1" >💥 FREE Shipping on ALL Orders — No Minimum Required! 🚚✨</div>

      <nav className="montserrat-font sticky top-0 z-20 bg-black flex flex-col md:flex-row justify-evenly items-center w-full h-auto py-1 px-4 gap-1 md:gap-0">
        <div className=" montserrat-font relative w-[150px] h-[120px]">
          <Image src="/logo.png" fill alt="Logo"/>
        </div>

        <div className="montserrat-font flex items-center w-[80%] sm:w-[70%] md:w-[40%] h-[40px] bg-amber-50 rounded overflow-hidden">
          <input
            type="text"
            className="montserrat-font flex-1 h-full px-3 text-sm text-black bg-gray-100 outline-none font-sans"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            className="montserrat-font w-[40px] h-full bg-black flex items-center justify-center"
            onClick={handleSearch}
          >
            <Image
              src="/searchW.svg"
              width={30}
              height={30}
              alt="Search"
            />
          </button>
        </div>
      {size === 'lg' ? 
        <div className="montserrat-font flex flex-row gap-6 justify-center items-center rounded-xl p-4">
          {loggedIn ? (
            <Link
              href="/account"
              className="montserrat-font relative flex flex-col items-center gap-1 justify-center transform hover:scale-110"
            >
              <Image
                src="/accountW.svg"
                alt="Account"
                width={40}
                height={40}
              />
              <span className="montserrat-font text-amber-50 text-sm italic">Account</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="montserrat-font flex flex-col items-center gap-1 justify-center transform hover:scale-110"
            >
              <Image
                src="/accountW.svg"
                alt="Sign In"
                width={40}
                height={40}
              />
              <span className="montserrat-font text-amber-50 text-sm italic">Login</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="montserrat-font flex flex-col items-center gap-1 justify-center transform hover:scale-110"
          >
            <div className="relative w-[35px] h-[35px]" >
              <Image
                src="/shoppingCW.svg"
                alt="Cart"
                fill
                className="montserrat-font object-cover"
              />
              {(cartcount !==0 && loggedIn) ?
              <div id='cartcount' className="montserrat-font absolute top-[-5px] right-[-5px] bg-red-500 rounded-full w-[20px] h-[20px] flex justify-center items-center text-white">{cartcount}</div>:null}
            </div>

            <span className="montserrat-font text-amber-50 text-sm italic">Cart</span>
          </Link>
          <Link
            href="/favs"
            className="montserrat-font flex flex-col items-center gap-1 justify-center transform hover:scale-110"
          >

            <div className="montserrat-font relative w-[35px] h-[35px]" >
              <Image
                src="/favoriteW.svg"
                alt="favourite"
                fill
                className="object-cover montserrat-font "
              />
              {(favcount !==0 && loggedIn) ?
                <div id='favcount' className="montserrat-font absolute top-[-5px] right-[-5px] bg-red-500 rounded-full w-[20px] h-[20px] flex justify-center items-center text-white">{favcount}</div>:null}
            </div>
            <span className="montserrat-font text-amber-50 text-sm italic">Favourites</span>
          </Link>
          <Link
            href="/product"
            className="flex flex-col montserrat-font  items-center gap-1 justify-center transform hover:scale-110"
          >

            <div className="montserrat-font relative w-[35px] h-[35px]" >
              <Image
                src="/menuW.svg"
                alt="favourite"
                fill
                className="montserrat-font object-cover"
              />
            </div>
            <span className="montserrat-font text-amber-50 text-sm italic">Products</span>
          </Link>
        </div>
      :  <>
        (<Image src={menu ? `/menuW.svg` : `/closeW.svg`} width={50} height={50} alt="nav buttons" className="bg-black" onClick={handleMenu}/>
         {!menu ? 
          (<div className="montserrat-font w-screen h-screen bg-white text-black z-45 p-5">
            {loggedIn ? (
                <Link  href="/account"  className="flex items-center w-full border-b py-4 justify-evenly items-center" onClick={()=>{setMenu(!menu)}}>
                  <div className="montserrat-font text-black text-lg">Account</div>
                </Link>
              ) : (
                <Link  href="/login"  className=" montserrat-font flex items-center w-full border-b py-4 justify-evenly items-center" onClick={()=>{setMenu(!menu)}}>
                  <div className="montserrat-font text-black text-lg ">Login</div>
                </Link>
              )}

                <Link  href="/cart"  className="montserrat-font flex items-center w-full border-b py-4 justify-evenly items-center" onClick={()=>{setMenu(!menu)}}>
                  <div className="montserrat-font text-black text-lg text-semibold hover:text-bold ">Cart</div>
                </Link>
                <Link  href="/favs"  className="montserrat-font flex items-center w-full border-b py-4 justify-evenly items-center" onClick={()=>{setMenu(!menu)}}>
                  <div className="montserrat-font text-black text-lg text-semibold hover:text-bold">Favourites</div>
                </Link>
                <Link  href="/product"  className="montserrat-font flex items-center w-full border-b py-4 justify-evenly items-center" onClick={()=>{setMenu(!menu)}}>
                  <div className="text-black text-lg text-semibold hover:text-bold">Products</div>
                </Link>
                <Link  href="/aboutus"  className="montserrat-font flex items-center w-full border-b py-4 justify-evenly items-center" onClick={()=>{setMenu(!menu)}}>
                  <div className="text-black text-lg text-semibold hover:text-bold">About Us</div>
                </Link>
                <Link  href="/contactus"  className="montserrat-font flex items-center w-full border-b py-4 justify-evenly items-center " onClick={()=>{setMenu(!menu)}}>
                  <div className="text-black text-lg text-semibold hover:text-bold">Contact Us</div>
                </Link>
                <Link  href="/privacy"  className="montserrat-font flex items-center w-full border-b py-4 justify-evenly items-center " onClick={()=>{setMenu(!menu)}}>
                  <div className="text-black text-lg text-semibold hover:text-bold">Privacy Policy</div>
                </Link>
          </div>):null} )  
      </>    
      }  
      </nav>
      <div className="bg-black text-white flex justify-center items-center rounded-full my-2 p-2 w-full block lg:hidden md:hidden" onClick={HandleCategory}>
        {cat ?  "Show Categories" : "Hide Categories"}
      </div>    
      {cat ? 
        <></>:
        <div className="lg:hidden md:hidden block"><Categorybar/></div>
      }
      <div className="hidden md:block lg:block lg:mt-2 md:mt-2">
        <Categorybar/>
      </div>
    </>
  );
}
