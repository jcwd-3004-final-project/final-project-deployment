"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link"; // Import Link
import { SelectScrollable } from "./category";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useCart } from "@/context/cartContext"; // Pastikan useCart diimpor

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  onCategoryChange?: (category: string) => void;
  onSearchSubmit?: () => void;
}

function Navbar({
  onSearchChange,
  onCategoryChange,
  onSearchSubmit,
}: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();
  const { totalItems } = useCart(); // Menggunakan useCart untuk mendapatkan totalItems

  useEffect(() => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;
    setIsLoggedIn(!!accessToken);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        setLocation("📍 Jakarta");
      }, 1000);
    } else {
      setLocation("");
    }
  }, [isLoggedIn]);

  const handleSearchSubmit = (value: string) => {
    // Submit pencarian
    if (onSearchChange) {
      onSearchChange(value);
    }
    // Setelah pencarian dilakukan, scroll ke product-section
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  const handleValueChange = (value: string) => {
    // Jika input kosong, tampilkan semua produk kembali
    if (value === "" && onSearchChange) {
      onSearchChange("");
    }
  };

  const handleCategorySelect = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  const placeholders = [
    "Search for items...",
    "Try searching 'apples'",
    "Try searching 'bread'",
    "Find organic products...",
  ];

  const handleLoginClick = () => {
    router.push("/auth/login");
  };

  const handleSignUpClick = () => {
    router.push("/auth/register");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <div
          className="text-lg font-bold flex items-center justify-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <img src="/logo.png" alt="Logo" className="w-auto h-8" />
        </div>

        {/* Search Bar (Hidden on Small Devices) */}
        <div className="hidden md:flex flex-1 mx-4 max-w-lg">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onSubmit={handleSearchSubmit}
            onValueChange={handleValueChange}
          />
        </div>

        {/* Auth / Profile Section */}
        <div className="hidden md:flex items-center gap-4">
          {location && <div className="text-gray-600">{location}</div>}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {/* Menggunakan Link untuk My Cart */}
              <Link
                href="/cart"
                className="text-gray-700 cursor-pointer flex items-center hover:text-green-600"
              >
                🛒 My Cart ({totalItems})
              </Link>
              {/* Menggunakan Link untuk Profile */}
              <Link
                href="/profile"
                className="text-gray-700 cursor-pointer hover:text-green-600"
              >
                👤 Profile
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                Login
              </button>
              <button
                onClick={handleSignUpClick}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
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
          {/* Search Bar (Mobile) */}
          <div className="flex w-full max-w-full">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onSubmit={handleSearchSubmit}
              onValueChange={handleValueChange}
            />
          </div>

          {/* Location */}
          {location && <div className="text-gray-600">{location}</div>}

          {/* Auth / Profile Section */}
          {isLoggedIn ? (
            <>
              {/* Menggunakan Link untuk My Cart */}
              <Link
                href="/cart"
                className="text-gray-700 cursor-pointer flex items-center hover:text-green-600"
              >
                🛒 My Cart ({totalItems})
              </Link>
              {/* Menggunakan Link untuk Profile */}
              <Link
                href="/profile"
                className="text-gray-700 cursor-pointer hover:text-green-600"
              >
                👤 Profile
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50"
              >
                Login
              </button>
              <button
                onClick={handleSignUpClick}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Sign Up
              </button>
            </>
          )}

          {/* Nav Links */}

          <Link
            href="/"
            className="text-gray-700 font-medium hover:text-green-600"
          >
            Home
          </Link>
          <Link
            href="/promotions"
            className="text-gray-700 font-medium hover:text-green-600"
          >
            Product
          </Link>

          {/* Categories Button */}
          <div className="flex items-center justify-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <SelectScrollable onCategorySelect={handleCategorySelect} />
          </div>

          {/* Call Center */}
          <a
            href="tel:6287855294573"
            className="text-green-600 font-medium hover:underline"
          >
            📞 62-878-5529-4573
          </a>
        </div>
      )}

      {/* Bottom Section (Hidden on Small Devices) */}
      <div className="hidden md:flex items-center justify-between px-4 py-2">
        {/* Categories Button */}
        <div className="flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <SelectScrollable onCategorySelect={handleCategorySelect} />
        </div>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-gray-700 font-medium hover:text-green-600"
          >
            Home
          </Link>
          <Link
            href="/promotions"
            className="text-gray-700 font-medium hover:text-green-600"
          >
            Promotions
          </Link>
        </div>
        <a
          href="tel:6287855294573"
          className="text-green-600 font-medium hover:underline"
        >
          📞 62-878-5529-4573
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
