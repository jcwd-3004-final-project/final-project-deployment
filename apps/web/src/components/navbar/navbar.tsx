"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import { useCart } from "@/context/cartContext";
import { useUser } from "@/context/userContext"; 
import { SelectScrollable } from "../category";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  onSearchSubmit?: () => void;
}

export default function Navbar({
  onSearchChange,
  onCategoryChange,
  onSearchSubmit,
}: NavbarProps) {
  const router = useRouter();
  const { totalItems } = useCart();
  const { user, isLoggedIn, logout } = useUser(); // Make sure your userContext has a logout() function

  const [city, setCity] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // ---------------------------------------------------
  // 1) Real Geolocation -> City
  // ---------------------------------------------------
  useEffect(() => {
    if (!isLoggedIn) {
      setCity("");
      return;
    }
    // If user is logged in, get location -> city name
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Reverse geocode to get city name:
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await res.json();
            // You can pick any address field you like (city, county, state, etc.)
            const cityName =
              data.address?.city ||
              data.address?.town ||
              data.address?.state ||
              "Unknown City";
            setCity(cityName);
          } catch (err) {
            console.error("Error fetching city name:", err);
            setCity(""); 
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          setCity(""); 
        }
      );
    }
  }, [isLoggedIn]);

  // ---------------------------------------------------
  // 2) Handle search
  // ---------------------------------------------------
  const placeholders = ["Search for items...", "Try searching 'apples'"];
  const handleSearchSubmitLocal = (value: string) => {
    onSearchChange?.(value);
    onSearchSubmit?.();
  };
  const handleValueChange = (value: string) => {
    if (value === "") onSearchChange?.("");
  };
  const handleCategorySelect = (category: string) => onCategoryChange?.(category);

  // ---------------------------------------------------
  // 3) Auth links
  // ---------------------------------------------------
  const handleLoginClick = () => router.push("/auth/login");
  const handleSignUpClick = () => router.push("/auth/register");

  // ---------------------------------------------------
  // 4) Logout with SweetAlert
  // ---------------------------------------------------
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // The "logout" here should clear tokens, user context, etc.
        logout(); 
        router.push("/"); // or wherever you want to redirect
      }
    });
  };

  // ---------------------------------------------------
  // Render
  // ---------------------------------------------------
  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      {/* Top Row */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        {/* Logo */}
        <div
          className="text-lg font-bold flex items-center justify-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="/logo.png" alt="Logo" className="w-auto h-8" />
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 mx-4 max-w-lg">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onSubmit={handleSearchSubmitLocal}
            onValueChange={handleValueChange}
          />
        </div>

        {/* Right side (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* City location */}
          {city && <div className="text-gray-600">📍 {city}</div>}

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* My Cart */}
              <Link
                href="/cart"
                className="text-gray-700 hover:text-green-600 flex items-center"
              >
                🛒 My Cart ({totalItems})
              </Link>

              {/* User dropdown on hover */}
                <div
                  className="relative inline-block" // Make it an inline-block container
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <span className="text-gray-700 hover:text-green-600 cursor-pointer">
                    Hi, {user?.lastName || "User"}
                  </span>

                  {isDropdownOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-full  /* Positions dropdown just below the trigger */
                        w-40
                        bg-white
                        border
                        border-gray-200
                        rounded
                        shadow-md
                        z-10
                      "
                    >
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/purchase"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        My Purchase
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50"
              >
                Login
              </button>
              <button
                onClick={handleSignUpClick}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile burger icon */}
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
          {/* Mobile Search */}
          <div className="flex w-full max-w-full">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onSubmit={handleSearchSubmitLocal}
              onValueChange={handleValueChange}
            />
          </div>

          {/* City location */}
          {city && <div className="text-gray-600">📍 {city}</div>}

          {isLoggedIn ? (
            <>
              <Link
                href="/cart"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 My Cart ({totalItems})
              </Link>

              {/* Single link instead of hover dropdown in Mobile */}
              <Link
                href="/profile"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
              <Link
                href="/purchases"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                My Purchase
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  handleLoginClick();
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded hover:bg-green-50"
              >
                Login
              </button>
              <button
                onClick={() => {
                  handleSignUpClick();
                  setIsMenuOpen(false);
                }}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                Sign Up
              </button>
            </>
          )}

          <Link
            href="/"
            className="text-gray-700 font-medium hover:text-green-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/promotions"
            className="text-gray-700 font-medium hover:text-green-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Product
          </Link>
          <div className="flex items-center gap-2 bg-green-600 text-white rounded hover:bg-green-700">
            <SelectScrollable onCategorySelect={handleCategorySelect} />
          </div>
          <a
            href="tel:6287855294573"
            className="text-green-600 font-medium hover:underline"
          >
            📞 62-878-5529-4573
          </a>
        </div>
      )}

      {/* Bottom Row (Desktop) */}
      <div className="hidden md:flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2 bg-green-600 text-white rounded hover:bg-green-700">
          <SelectScrollable onCategorySelect={handleCategorySelect} />
        </div>
        <div className="flex gap-6">
          <Link href="/" className="text-gray-700 font-medium hover:text-green-600">
            Home
          </Link>
          <Link
            href="/promotions"
            className="text-gray-700 font-medium hover:text-green-600"
          >
            Promotions
          </Link>
        </div>
        <a href="tel:6287855294573" className="text-green-600 font-medium hover:underline">
          📞 62-878-5529-4573
        </a>
      </div>
    </nav>
  );
}