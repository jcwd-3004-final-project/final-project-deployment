// pages/cart.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCart } from "@/context/cartContext";
import CartItem from "@/components/cartItem";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

// Tipe data Voucher (sesuai schema halaman voucher)
interface Voucher {
  id: number;
  code: string;
  discountType: string;
  value: number;
  valueType: string;
  startDate: string;
  endDate: string;
  usageType: string;
  minPurchaseAmount?: number;
  maxDiscount?: number;
  expiryDate?: string;
}

// Interface untuk Referral Information
interface ReferralInfo {
  id: number;
  referrerId: number;
  referralCode: string;
  usageCount: number;
  createdAt: string;
}

const CartPage = () => {
  const {
    cart,
    totalItems,
    totalPrice,
    totalAfterDiscount,
    setVoucherDiscount,
    setReferralDiscount,
  } = useCart();

  // State lokal untuk voucher dan referral
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [coupon, setCoupon] = useState("");
  const [localDiscount, setLocalDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [couponError, setCouponError] = useState("");
  const [referral, setReferral] = useState<ReferralInfo | null>(null);
  const [useReferral, setUseReferral] = useState<boolean>(false);

  // Fungsi format Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Fetch voucher dari backend
  const fetchVouchers = async () => {
    try {
      const res = await axios.get<Voucher[]>(
        "http://localhost:8000/v1/api/discounts/vouchers"
      );
      setVouchers(res.data);
    } catch (err: any) {
      console.error("Error fetching vouchers:", err);
    }
  };

  // Fetch referral info dari backend
  const fetchReferral = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await fetch("http://localhost:8000/v1/api/auth/referral-info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch referral information");
      }
      const result = await res.json();
      setReferral(result);
    } catch (err: any) {
      console.error("Error fetching referral:", err);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchReferral();
  }, []);

  // Handler untuk menerapkan voucher
  const handleApplyCoupon = () => {
    setCouponError("");
    setLocalDiscount(0);
    setAppliedVoucher(null);
    setVoucherDiscount(0); // Reset diskon voucher di Context

    // Cari voucher berdasarkan kode (case-insensitive)
    const voucher = vouchers.find(
      (v) => v.code.toUpperCase() === coupon.trim().toUpperCase()
    );
    if (!voucher) {
      setCouponError("Voucher tidak ditemukan.");
      return;
    }

    // Pengecekan tanggal berlaku
    const now = new Date();
    const startDate = new Date(voucher.startDate);
    const endDate = new Date(voucher.endDate);
    if (now < startDate || now > endDate) {
      setCouponError("Voucher sudah tidak berlaku.");
      return;
    }

    // Pengecekan pembelian minimal
    if (voucher.minPurchaseAmount && totalPrice < voucher.minPurchaseAmount) {
      setCouponError(
        `Minimal pembelian untuk menggunakan voucher ini adalah ${formatRupiah(
          voucher.minPurchaseAmount
        )}.`
      );
      return;
    }

    // Hitung diskon berdasarkan valueType
    let calculatedDiscount = 0;
    if (voucher.valueType === "PERCENTAGE") {
      calculatedDiscount = totalPrice * (voucher.value / 100);
      if (voucher.maxDiscount && calculatedDiscount > voucher.maxDiscount) {
        calculatedDiscount = voucher.maxDiscount;
      }
    } else if (voucher.valueType === "NOMINAL") {
      calculatedDiscount = voucher.value;
    }
    if (calculatedDiscount > totalPrice) {
      calculatedDiscount = totalPrice;
    }

    setLocalDiscount(calculatedDiscount);
    setAppliedVoucher(voucher);
    setVoucherDiscount(calculatedDiscount); // Update nilai diskon di Context
  };

  // Update nilai referral discount di Context saat opsi useReferral berubah atau data referral diterima
  useEffect(() => {
    const calculatedReferralDiscount =
      useReferral && referral ? referral.usageCount * 10000 : 0;
    setReferralDiscount(calculatedReferralDiscount);
  }, [useReferral, referral, setReferralDiscount]);

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

              {/* Total dan Informasi Belanja */}
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

              {/* Panel Voucher */}
              <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Apply Voucher
                </h2>
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter voucher code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {couponError && (
                  <p className="mt-2 text-red-500 text-sm">{couponError}</p>
                )}
                <button
                  onClick={handleApplyCoupon}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Panel Referral Info */}
              <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                {referral ? (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg text-gray-700">
                        Referral Points:{" "}
                        <span className="font-semibold">
                          {formatRupiah(referral.usageCount * 10000)}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={useReferral}
                          onChange={(e) => setUseReferral(e.target.checked)}
                          className="form-checkbox"
                        />
                        <span className="text-gray-700">Use Points</span>
                      </label>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Loading referral information...</p>
                )}
              </div>

              {/* Ringkasan Diskon & Total Bayar */}
              {(localDiscount > 0 || (referral && useReferral)) && (
                <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                  {localDiscount > 0 && appliedVoucher && (
                    <>
                      <p className="text-lg text-gray-700">
                        Voucher Applied:{" "}
                        <span className="font-semibold">
                          {appliedVoucher.code.toUpperCase()}
                        </span>
                      </p>
                      <p className="text-lg text-gray-700">
                        Voucher Discount:{" "}
                        <span className="font-semibold text-red-600">
                          - {formatRupiah(localDiscount)}
                        </span>
                      </p>
                    </>
                  )}
                  {referral &&
                    useReferral &&
                    referral.usageCount > 0 && (
                      <p className="text-lg text-gray-700">
                        Referral Discount:{" "}
                        <span className="font-semibold text-red-600">
                          - {formatRupiah(referral.usageCount * 10000)}
                        </span>
                      </p>
                    )}
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    Total Bayar: {formatRupiah(totalAfterDiscount)}
                  </p>
                </div>
              )}

              {/* Tombol Checkout */}
              <div className="flex justify-end mt-4">
                <Link href="/checkout">
                  <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>

            {/* Panel Lain: Misalnya, tombol “Continue Shopping” */}
            <div className="space-y-4">
              <Link href="/">
                <p className="block text-center bg-white text-green-600 py-3 px-6 rounded-lg shadow-md hover:bg-green-50 transition-colors">
                  🛍️ Continue Shopping
                </p>
              </Link>
            </div>
          </div>
        ) : (
          // Tampilan ketika cart kosong
          <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-100 p-4">
            <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-6 max-w-sm w-full">
              <Image
                src="/empty-cart.jpg"
                alt="Empty Cart"
                width={200}
                height={200}
                className="mb-6"
              />
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
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
