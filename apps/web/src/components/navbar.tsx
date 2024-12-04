"use server";
import React, { useState, useEffect } from "react";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle login state
  const [location, setLocation] = useState(""); // Dynamic location
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For top menu (burger menu)

  // Simulate fetching location after login
  useEffect(() => {
    if (isLoggedIn) {
      // Simulate an API call
      setTimeout(() => {
        setLocation("📍 Jakarta");
      }, 1000); // Mocking delay
    } else {
      setLocation(""); // Clear location when logged out
    }
  }, [isLoggedIn]);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      {/* Top Section */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        {/* Brand */}
        <div className="text-lg font-bold text-green-600">PESANAJA</div>

        {/* Search Bar (Hidden on Small Devices) */}
        <div className="hidden md:flex flex-1 mx-4 max-w-lg">
          <input
            type="text"
            placeholder="Search for items..."
            className="flex-1 px-4 text-black py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button className="px-4 py-2 bg-green-600 text-black rounded-r-md hover:bg-green-700">
            🔍
          </button>
        </div>

        {/* Auth / Profile Section */}
        <div className="hidden md:flex items-center gap-4">
          {location && <div className="text-gray-600">{location}</div>}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="text-gray-700 cursor-pointer">🛒 My Cart</div>
              <div className="text-gray-700 cursor-pointer">👤 Profile</div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLoggedIn(true)}
                className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                Login
              </button>
              <button className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Burger Menu Toggle (Visible on Small Devices) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-gray-600 focus:outline-none md:hidden"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 py-2 bg-gray-50 border-b">
          {/* Search Bar */}
          <div className="flex">
            <input
              type="text"
              placeholder="Search for items..."
              className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700">
              🔍
            </button>
          </div>

          {/* Location */}
          {location && <div className="text-gray-600">{location}</div>}

          {/* Auth / Profile Section */}
          {isLoggedIn ? (
            <>
              <div className="text-gray-700 cursor-pointer">🛒 My Cart</div>
              <div className="text-gray-700 cursor-pointer">👤 Profile</div>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsLoggedIn(true)}
                className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                Login
              </button>
              <button className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700">
                Sign Up
              </button>
            </>
          )}

          {/* Nav Links */}
          <a href="#" className="text-gray-700 font-medium hover:text-green-600">
            Home
          </a>
          <a href="#" className="text-gray-700 font-medium hover:text-green-600">
            Promotions
          </a>

          {/* Categories Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            📋 Browse All Categories
          </button>

          {/* Call Center */}
          <a href="tel:6287855294573" className="text-green-600 font-medium hover:underline">
            📞 62-878-5529-4573
          </a>
        </div>
      )}

      {/* Bottom Section (Hidden on Small Devices) */}
      <div className="hidden md:flex items-center justify-between px-4 py-2">
        {/* Categories Button */}
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          📋 Browse All Categories
        </button>

        {/* Nav Links */}
        <div className="flex gap-6">
          <a href="#" className="text-gray-700 font-medium hover:text-green-600">
            Home
          </a>
          <a href="#" className="text-gray-700 font-medium hover:text-green-600">
            Promotions
          </a>
        </div>

        {/* Call Center */}
        <a href="tel:6287855294573" className="text-green-600 font-medium hover:underline">
          📞 62-878-5529-4573
        </a>
      </div>
    </nav>
  );
}

export default Navbar;