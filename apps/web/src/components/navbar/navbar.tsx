"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "@/context/cartContext";
import { useUser } from "@/context/userContext"; // <-- Import your user context
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

  // Grab user info from context
  const { user, isLoggedIn } = useUser();

  const [location, setLocation] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Example location: set after 1 second if logged in
  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => setLocation("📍 Jakarta"), 1000);
    } else {
      setLocation("");
    }
  }, [isLoggedIn]);

  const placeholders = ["Search for items...", "Try searching 'apples'"];

  const handleSearchSubmitLocal = (value: string) => {
    onSearchChange?.(value);
    onSearchSubmit?.();
  };
  const handleValueChange = (value: string) => {
    if (value === "") onSearchChange?.("");
  };
  const handleCategorySelect = (category: string) => onCategoryChange?.(category);

  const handleLoginClick = () => router.push("/auth/login");
  const handleSignUpClick = () => router.push("/auth/register");

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        {/* Logo */}
        <div
          className="text-lg font-bold flex items-center cursor-pointer"
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
          {location && <div className="text-gray-600">{location}</div>}

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                href="/cart"
                className="text-gray-700 hover:text-green-600 flex items-center"
              >
                🛒 My Cart ({totalItems})
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-green-600">
                Hi {user?.lastName}
              </Link>
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
          <div className="flex w-full max-w-full">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onSubmit={handleSearchSubmitLocal}
              onValueChange={handleValueChange}
            />
          </div>
          {location && <div className="text-gray-600">{location}</div>}
          {isLoggedIn ? (
            <>
              <Link
                href="/cart"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 My Cart ({totalItems})
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Hi {user?.lastName}
              </Link>
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
            Promotions
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
