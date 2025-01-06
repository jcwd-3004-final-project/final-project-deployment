// pages/cart.tsx
import React from "react";
import { useCart } from "@/context/cartContext";
import CartItem from "@/components/cartItem";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import Image from "next/image"; // Untuk optimasi gambar jika diperlukan
import Link from "next/link"; // Untuk navigasi jika ingin menambahkan tombol lanjut belanja

const CartPage = () => {
  const { cart, totalItems, totalPrice } = useCart();

  // Fungsi untuk memformat angka ke Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Cart</h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daftar Item Keranjang */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Total dan Aksi */}
              <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-md mt-8">
                <div className="mb-4 md:mb-0">
                  <p className="text-lg font-medium text-gray-700">
                    Total Items:{" "}
                    <span className="font-semibold">{totalItems}</span>
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    Total: {formatRupiah(totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            {/* Ringkasan Pembelian atau Promo (Opsional) */}
            <div className="space-y-4">
              {/* Contoh Promo atau Ringkasan */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Apply Coupon
                </h2>
                <input
                  type="text"
                  placeholder="Enter your coupon code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors">
                  Apply
                </button>
              </div>

              {/* Tombol Lanjut Belanja */}
              <Link href="/">
                <p className="block text-center bg-white text-green-600 py-3 px-6 rounded-lg shadow-md hover:bg-green-50 transition-colors">
                  🛍️ Continue Shopping
                </p>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
              <Image
                src="https://i.pinimg.com/474x/81/c4/fc/81c4fc9a4c06cf57abf23606689f7426.jpg" // Pastikan Anda memiliki gambar ini di folder public
                alt="Empty Cart"
                width={200}
                height={200}
                className="mb-6"
              />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <button className="text-gray-600 text-center mb-6">
                Looks like you haven&apos;t added anything to your cart yet.
              </button>
              <Link href="/">
                <p className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200 shadow">
                  🛍️ Shop Now
                </p>
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
