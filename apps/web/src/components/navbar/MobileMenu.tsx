"use client";
import React from "react";
import Link from "next/link";
import { SelectScrollable } from "../category";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

interface MobileMenuProps {
  isLoggedIn: boolean;
  lastName: string;
  location: string;
  totalItems: number;
  handleLoginClick: () => void;
  handleSignUpClick: () => void;
  placeholders: string[];
  handleSearchSubmit: (value: string) => void;
  handleValueChange: (value: string) => void;
  handleCategorySelect: (category: string) => void;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileMenu({
  isLoggedIn,
  lastName,
  location,
  totalItems,
  handleLoginClick,
  handleSignUpClick,
  placeholders,
  handleSearchSubmit,
  handleValueChange,
  handleCategorySelect,
  setIsMenuOpen,
}: MobileMenuProps) {
  return (
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

      {/* Auth / Profile */}
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
            Hi {lastName}
          </Link>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              handleLoginClick();
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50"
          >
            Login
          </button>
          <button
            onClick={() => {
              handleSignUpClick();
              setIsMenuOpen(false);
            }}
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
        onClick={() => setIsMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        href="/product"
        className="text-gray-700 font-medium hover:text-green-600"
        onClick={() => setIsMenuOpen(false)}
      >
        Product
      </Link>

      {/* Categories */}
      <div className="flex items-center gap-2 bg-green-600 text-white rounded-md hover:bg-green-700">
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
  );
}
