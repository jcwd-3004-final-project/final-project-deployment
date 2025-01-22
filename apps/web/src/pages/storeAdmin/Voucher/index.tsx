"use client";

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

// ------------------ Tipe Data ------------------
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

export default function VoucherPage() {
  // ------------------ STATE ------------------
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [voucherForm, setVoucherForm] = useState({
    code: "",
    discountType: "",
    value: 0,
    valueType: "",
    startDate: "",
    endDate: "",
    usageType: "",
    minPurchaseAmount: 0,
    maxDiscount: 0,
  });
  const [message, setMessage] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // ------------------ API FUNCTIONS ------------------
  const fetchVouchers = async () => {
    try {
      const res = await axios.get<Voucher[]>(
        "https://d29jci2p0msjlf.cloudfront.net/v1/api/discounts/vouchers"
      );
      // Filter voucher yang tidak memiliki prefix tertentu
      const filteredVouchers = res.data.filter(
        (voucher) =>
          !voucher.code.startsWith("REF-REDEEM") &&
          !voucher.code.startsWith("REF-BENEFIT")
      );
      setVouchers(filteredVouchers);
    } catch (err: any) {
      setErrorMsg(err.message || "Error fetching vouchers");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreateVoucher = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setErrorMsg("");
    try {
      await axios.post(
        "https://d29jci2p0msjlf.cloudfront.net/v1/api/discounts/vouchers",
        {
          ...voucherForm,
          value: Number(voucherForm.value),
          minPurchaseAmount: Number(voucherForm.minPurchaseAmount),
          maxDiscount: Number(voucherForm.maxDiscount),
          startDate: new Date(voucherForm.startDate).toISOString(),
          endDate: new Date(voucherForm.endDate).toISOString(),
        }
      );
      setMessage("Voucher created successfully!");
      setVoucherForm({
        code: "",
        discountType: "",
        value: 0,
        valueType: "",
        startDate: "",
        endDate: "",
        usageType: "",
        minPurchaseAmount: 0,
        maxDiscount: 0,
      });
      fetchVouchers();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Error creating voucher"
      );
    }
  };

  const handleDeleteVoucher = async (id: number) => {
    setMessage("");
    setErrorMsg("");
    try {
      await axios.delete(
        `https://d29jci2p0msjlf.cloudfront.net/v1/api/discounts/vouchers/${id}`
      );
      setMessage("Voucher deleted successfully!");
      fetchVouchers();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Error deleting voucher"
      );
    }
  };

  // ------------------ RENDER ------------------
  return (
    <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-6">
        Voucher Management
      </h1>

      {/* Tombol navigasi */}
      <div className="mb-6">
        <Link href="/storeAdmin">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Notifikasi */}
      {(message || errorMsg) && (
        <div
          className={`mb-6 p-4 rounded border-l-4 ${
            message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-700 border-green-600"
              : "bg-red-100 text-red-700 border-red-600"
          }`}
        >
          {message.toLowerCase().includes("success") ? (
            <FaCheckCircle className="inline mr-2" />
          ) : (
            <FaExclamationCircle className="inline mr-2" />
          )}
          {message || errorMsg}
        </div>
      )}

      {/* FORM: Create Voucher */}
      <div className="bg-white p-6 rounded shadow-md border border-green-200 mb-6">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">
          Create New Voucher
        </h2>
        <form onSubmit={handleCreateVoucher} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Code
            </label>
            <input
              type="text"
              required
              value={voucherForm.code}
              onChange={(e) =>
                setVoucherForm({ ...voucherForm, code: e.target.value })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Discount Type
            </label>
            <select
              required
              value={voucherForm.discountType}
              onChange={(e) =>
                setVoucherForm({ ...voucherForm, discountType: e.target.value })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            >
              <option value="">Select</option>
              <option value="MIN_PURCHASE_DISCOUNT">
                MIN_PURCHASE_DISCOUNT
              </option>
              <option value="PRODUCT_DISCOUNT">PRODUCT_DISCOUNT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Value{" "}
              {voucherForm.valueType === "PERCENTAGE" && <span>(% 0-100)</span>}
            </label>
            <input
              type="number"
              required
              min={0}
              max={voucherForm.valueType === "PERCENTAGE" ? 100 : undefined}
              value={voucherForm.value}
              onChange={(e) =>
                setVoucherForm({
                  ...voucherForm,
                  value: Number(e.target.value),
                })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Value Type
            </label>
            <select
              required
              value={voucherForm.valueType}
              onChange={(e) =>
                setVoucherForm({ ...voucherForm, valueType: e.target.value })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            >
              <option value="">Select</option>
              <option value="PERCENTAGE">PERCENTAGE</option>
              <option value="NOMINAL">NOMINAL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Usage Type
            </label>
            <select
              required
              value={voucherForm.usageType}
              onChange={(e) =>
                setVoucherForm({ ...voucherForm, usageType: e.target.value })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            >
              <option value="">Select</option>
              <option value="PRODUCT">PRODUCT</option>
              <option value="TOTAL_PURCHASE">TOTAL_PURCHASE</option>
              <option value="SHIPPING">SHIPPING</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Start Date
            </label>
            <input
              type="date"
              required
              value={voucherForm.startDate}
              onChange={(e) =>
                setVoucherForm({ ...voucherForm, startDate: e.target.value })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              End Date
            </label>
            <input
              type="date"
              required
              value={voucherForm.endDate}
              onChange={(e) =>
                setVoucherForm({ ...voucherForm, endDate: e.target.value })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Min Purchase Amount
            </label>
            <input
              type="number"
              value={voucherForm.minPurchaseAmount}
              onChange={(e) =>
                setVoucherForm({
                  ...voucherForm,
                  minPurchaseAmount: Number(e.target.value),
                })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-green-800 mb-1">
              Max Discount
            </label>
            <input
              type="number"
              value={voucherForm.maxDiscount}
              onChange={(e) =>
                setVoucherForm({
                  ...voucherForm,
                  maxDiscount: Number(e.target.value),
                })
              }
              className="w-full border rounded px-4 py-2 focus:ring focus:ring-green-200 focus:border-green-400"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full py-2 rounded bg-green-600 text-white font-medium hover:bg-green-700"
            >
              Create Voucher
            </button>
          </div>
        </form>
      </div>

      {/* LIST VOUCHERS */}
      <div className="bg-white p-6 rounded shadow-md border border-green-200">
        <h2 className="text-2xl font-semibold text-green-800 mb-4">
          List of Vouchers
        </h2>
        {vouchers.length === 0 ? (
          <p className="text-sm text-gray-500">No vouchers available.</p>
        ) : (
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-green-100 border-b">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Code</th>
                <th className="py-2 px-4 text-left">Discount Type</th>
                <th className="py-2 px-4 text-left">Value</th>
                <th className="py-2 px-4 text-left">Value Type</th>
                <th className="py-2 px-4 text-left">Usage Type</th>
                <th className="py-2 px-4 text-left">Start Date</th>
                <th className="py-2 px-4 text-left">End Date</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v.id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">{v.id}</td>
                  <td className="py-2 px-4">{v.code}</td>
                  <td className="py-2 px-4">{v.discountType}</td>
                  <td className="py-2 px-4">{v.value}</td>
                  <td className="py-2 px-4">{v.valueType}</td>
                  <td className="py-2 px-4">{v.usageType}</td>
                  <td className="py-2 px-4">{v.startDate.substring(0, 10)}</td>
                  <td className="py-2 px-4">{v.endDate.substring(0, 10)}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDeleteVoucher(v.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
