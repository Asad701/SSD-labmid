'use client';
import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { SiEtsy, SiEbay } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="w-full mt-3 montserrat-font">
      {/* White Top Section */}
      <div className="bg-white text-black py-10 px-6 montserrat-font md:px-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4 montserrat-font">About Royal Fold</h3>
          <p className="text-gray-700">
            Royal Fold is your trusted creative partner for exquisite Damascus kitchen and pocket knives. We transform craftsmanship into timeless excellence.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-bold mb-4 montserrat-font">Contact</h3>
          <ul className="text-gray-700 space-y-2 montserrat-font">
            <li>👤 ROYAL FOLD TEAM</li>
            <li>
              ✉️ <a href="mailto:royalfold001@gmail.com" className="hover:underline hover:text-blue-700">royalfold001@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 montserrat-font">Quick Links</h3>
          <ul className="space-y-2 text-gray-700 montserrat-font">
            <li>
              <Link href="/" className="hover:text-blue-500 transition-colors duration-300 montserrat-font">Home</Link>
            </li>
            <li>
              <Link href="/aboutus" className="hover:text-blue-500 transition-colors duration-300 montserrat-font">About Us</Link>
            </li>
            <li>
              <Link href="/contactus" className="hover:text-blue-500 transition-colors duration-300 montserrat-font">Contact Us</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-blue-500 transition-colors duration-300 montserrat-font">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-xl font-bold mb-4 montserrat-font">Follow Us</h3>
          <div className="flex gap-4 text-gray-700 text-2xl montserrat-font">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors duration-300 montserrat-font"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-600 transition-colors duration-300 montserrat-font"
            >
              <FaInstagram />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors duration-300 montserrat-font"
            >
              <FaTwitter />
            </a>
            <a
              href="https://etsy.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors duration-300 montserrat-font"
            >
              <SiEtsy />
            </a>
            <a
              href="https://ebay.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-700 transition-colors duration-300 montserrat-font"
            >
              <SiEbay />
            </a>
          </div>
        </div>
      </div>

      {/* Black Bottom Section */}
      <div className="bg-black text-white py-4 flex justify-center items-center montserrat-font">
        <p className="text-sm text-gray-400 text-center montserrat-font">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-white">Royal Fold</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
