"use client";

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";

// ------------------ Tipe Data ------------------
interface Product {
  productId: number;
  name: string;
  stock: number;
}

interface Discount {
  id: number;
  type: string;
  value: number;
  valueType: string;
  startDate: string;
  endDate: string;
  maxDiscount?: number;
  minPurchase?: number;
}

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

// =================== HALAMAN PROMO ===================
export default function PromoPage() {
  // State untuk store & produk
  const [storeId, setStoreId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Active tab: discount, voucher, integration
  const [activeTab, setActiveTab] = useState<"discount" | "voucher" | "integrate">("discount");

  // ------------------ DISCOUNT STATE ------------------
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [discountForm, setDiscountForm] = useState({
    type: "",
    value: 0,
    valueType: "",
    startDate: "",
    endDate: "",
    maxDiscount: 0,
    minPurchase: 0,
  });

  // ------------------ VOUCHER STATE ------------------
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

  // ------------------ INTEGRATE (ASSIGN DISCOUNT/VOUCHER) ------------------
  const [integrationForm, setIntegrationForm] = useState({
    discountId: 0,
    voucherId: 0,
    productId: 0,
  });

  // ------------------ MESSAGES ------------------
  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Ambil store details untuk mendapatkan storeId (sama seperti halaman Store Admin)
  const fetchStoreDetails = async () => {
    try {

      const token = localStorage.getItem("accessToken");
      if (!token) {
        setErrorMsg("Access token missing. Please log in.");
        return;

      }
      const res = await fetch("http://localhost:8000/v1/api/store-admin/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch store details.");
      }
      setStoreId(data?.data?.store?.store_id);
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  // 2. Fetch produk berdasarkan storeId
  const fetchProducts = async (storeId: number) => {
    try {
      const res = await fetch(`http://localhost:8000/v1/api/stores/${storeId}/products`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch products");
      }
      const mappedProducts = data.storeProducts.map((item: any) => ({
        productId: item.product.id,
        name: item.product.name,
        stock: item.stock,
      }));
      setProducts(mappedProducts);
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  // 3. Fetch Discounts
  const fetchDiscounts = async () => {
    try {
      const res = await axios.get<Discount[]>("http://localhost:8000/v1/api/discounts/discounts");
      setDiscounts(res.data);
    } catch (err: any) {
      setErrorMsg(err.message || "Error fetching discounts");
    }
  };

  // 4. Fetch Vouchers
  const fetchVouchers = async () => {
    try {
      const res = await axios.get<Voucher[]>("http://localhost:8000/v1/api/discounts/vouchers");
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

  // useEffect untuk memanggil store details
  useEffect(() => {
    fetchStoreDetails();
  }, []);

  // Setelah storeId tersedia, fetch produk
  useEffect(() => {
    if (storeId) {
      fetchProducts(storeId);
    }
  }, [storeId]);

  // useEffect untuk memanggil data sesuai tab aktif
  useEffect(() => {
    if (activeTab === "discount") {
      fetchDiscounts();
    } else if (activeTab === "voucher") {
      fetchVouchers();
    } else if (activeTab === "integrate") {
      if (storeId) {
        fetchProducts(storeId);
      }
      fetchDiscounts();
      fetchVouchers();
    }
  }, [activeTab, storeId]);

  // ------------------ HANDLER: CREATE DISCOUNT ------------------
  const handleCreateDiscount = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);
    try {
      await axios.post("http://localhost:8000/v1/api/discounts/discounts", {
        ...discountForm,
        value: Number(discountForm.value),
        maxDiscount: Number(discountForm.maxDiscount),
        minPurchase: Number(discountForm.minPurchase),
      });
      setMessage("Discount created successfully");
      // Reset form discount
      setDiscountForm({
        type: "",
        value: 0,
        valueType: "",
        startDate: "",
        endDate: "",
        maxDiscount: 0,
        minPurchase: 0,
      });
      fetchDiscounts();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Error creating discount"
      );
    }
  };

  // ------------------ HANDLER: DELETE DISCOUNT ------------------
  const handleDeleteDiscount = async (id: number) => {
    setMessage(null);
    setErrorMsg(null);
    try {
      await axios.delete(`http://localhost:8000/v1/api/discounts/discounts/${id}`);
      setMessage("Discount deleted successfully");
      fetchDiscounts();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Error deleting discount"
      );
    }
  };

  // ------------------ HANDLER: CREATE VOUCHER ------------------
  const handleCreateVoucher = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);
    try {
      await axios.post("http://localhost:8000/v1/api/discounts/vouchers", {
        ...voucherForm,
        value: Number(voucherForm.value),
        minPurchaseAmount: Number(voucherForm.minPurchaseAmount),
        maxDiscount: Number(voucherForm.maxDiscount),
        startDate: new Date(voucherForm.startDate).toISOString(),
        endDate: new Date(voucherForm.endDate).toISOString(),
      });
      setMessage("Voucher created successfully");
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

  // ------------------ HANDLER: DELETE VOUCHER ------------------
  const handleDeleteVoucher = async (id: number) => {
    setMessage(null);
    setErrorMsg(null);
    try {
      await axios.delete(`http://localhost:8000/v1/api/discounts/vouchers/${id}`);
      setMessage("Voucher deleted successfully");
      fetchVouchers();
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Error deleting voucher"
      );
    }
  };

  // ------------------ HANDLER: ASSIGN DISCOUNT TO PRODUCT ------------------
  const handleAssignDiscountToProduct = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);
    try {
      const { discountId, productId } = integrationForm;
      await axios.post(
        `http://localhost:8000/v1/api/discounts/discounts/${discountId}/assign`,
        {
          productId: Number(productId),
        }
      );
      setMessage(`Assigned discount ${discountId} to product ${productId}`);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Error assigning discount"
      );
    }
  };

  // ------------------ HANDLER: ASSIGN VOUCHER TO PRODUCT ------------------
  const handleAssignVoucherToProduct = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);
    try {
      const { voucherId, productId } = integrationForm;
      await axios.post(
        `http://localhost:8000/v1/api/discounts/vouchers/${voucherId}/assign`,
        {
          productId: Number(productId),
        }
      );
      setMessage(`Assigned voucher ${voucherId} to product ${productId}`);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.error || err.message || "Error assigning voucher"
      );
    }
  };

  // ------------------ HANDLER: SWITCH TAB ------------------
  const handleTabSwitch = (tab: "discount" | "voucher" | "integrate") => {
    setMessage(null);
    setErrorMsg(null);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">Promo Management</h1>
        <div className="mb-4">
          <Link href="/storeAdmin">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Back
            </button>
          </Link>
        </div>

        {/* TABS */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTabSwitch("discount")}
            className={clsx(
              "px-4 py-2 rounded",
              activeTab === "discount" ? "bg-blue-500 text-white" : "bg-gray-200"
            )}
          >
            Discount
          </button>
          <button
            onClick={() => handleTabSwitch("voucher")}
            className={clsx(
              "px-4 py-2 rounded",
              activeTab === "voucher" ? "bg-blue-500 text-white" : "bg-gray-200"
            )}
          >
            Voucher
          </button>
          <button
            onClick={() => handleTabSwitch("integrate")}
            className={clsx(
              "px-4 py-2 rounded",
              activeTab === "integrate" ? "bg-blue-500 text-white" : "bg-gray-200"
            )}
          >
            Integrate Prod
          </button>
        </div>

        {/* Message / Error */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
            {errorMsg}
          </div>
        )}

        {/* TAB DISCOUNT */}
        {activeTab === "discount" && (
          <div>
            {/* CREATE DISCOUNT FORM */}
            <form onSubmit={handleCreateDiscount} className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-1 font-medium">Type</label>
                <select
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.type}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, type: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="PRODUCT_DISCOUNT">PRODUCT_DISCOUNT</option>
                  <option value="BUY_ONE_GET_ONE">BUY_ONE_GET_ONE</option>
                  <option value="MIN_PURCHASE_DISCOUNT">MIN_PURCHASE_DISCOUNT</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Value {discountForm.valueType === "PERCENTAGE" && <span>(% 0-100)</span>}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={discountForm.valueType === "PERCENTAGE" ? 100 : undefined}
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.value}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, value: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Value Type</label>
                <select
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.valueType}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, valueType: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="NOMINAL">NOMINAL</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Start Date</label>
                <input
                  type="date"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.startDate}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.endDate}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, endDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Max Discount</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.maxDiscount}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, maxDiscount: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Min Purchase</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.minPurchase}
                  onChange={(e) =>
                    setDiscountForm({ ...discountForm, minPurchase: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-span-2">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Create Discount
                </button>
              </div>
            </form>

            {/* LIST DISCOUNTS */}
            <h2 className="text-lg font-semibold mb-2">List of Discounts</h2>
            {discounts.length === 0 ? (
              <p className="text-gray-600">No discounts available.</p>
            ) : (
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Value</th>
                    <th className="p-2 border">ValueType</th>
                    <th className="p-2 border">StartDate</th>
                    <th className="p-2 border">EndDate</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {discounts.map((d) => (
                    <tr key={d.id}>
                      <td className="p-2 border">{d.id}</td>
                      <td className="p-2 border">{d.type}</td>
                      <td className="p-2 border">{d.value}</td>
                      <td className="p-2 border">{d.valueType}</td>
                      <td className="p-2 border">{d.startDate.substring(0, 10)}</td>
                      <td className="p-2 border">{d.endDate.substring(0, 10)}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDeleteDiscount(d.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
        )}

        {/* TAB VOUCHER */}
        {activeTab === "voucher" && (
          <div>
            {/* CREATE VOUCHER FORM */}
            <form onSubmit={handleCreateVoucher} className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-1 font-medium">Code</label>
                <input
                  type="text"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.code}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, code: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Discount Type</label>
                <select
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.discountType}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, discountType: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="MIN_PURCHASE_DISCOUNT">MIN_PURCHASE_DISCOUNT</option>
                  <option value="PRODUCT_DISCOUNT">PRODUCT_DISCOUNT</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Value {voucherForm.valueType === "PERCENTAGE" && <span>(% 0-100)</span>}
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  max={voucherForm.valueType === "PERCENTAGE" ? 100 : undefined}
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.value}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, value: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Value Type</label>
                <select
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.valueType}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, valueType: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="PERCENTAGE">PERCENTAGE</option>
                  <option value="NOMINAL">NOMINAL</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Usage Type</label>
                <select
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.usageType}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, usageType: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="PRODUCT">PRODUCT</option>
                  <option value="TOTAL_PURCHASE">TOTAL_PURCHASE</option>
                  <option value="SHIPPING">SHIPPING</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Start Date</label>
                <input
                  type="date"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.startDate}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, startDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.endDate}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, endDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Min Purchase Amount</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.minPurchaseAmount}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, minPurchaseAmount: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Max Discount</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.maxDiscount}
                  onChange={(e) =>
                    setVoucherForm({ ...voucherForm, maxDiscount: Number(e.target.value) })
                  }
                />
              </div>
              <div className="col-span-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Create Voucher
                </button>
              </div>
            </form>

            {/* LIST VOUCHERS */}
            <h2 className="text-lg font-semibold mb-2">List of Vouchers</h2>
            {vouchers.length === 0 ? (
              <p className="text-gray-600">No vouchers available.</p>
            ) : (
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Code</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Value</th>
                    <th className="p-2 border">ValueType</th>
                    <th className="p-2 border">UsageType</th>
                    <th className="p-2 border">StartDate</th>
                    <th className="p-2 border">EndDate</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((v) => (
                    <tr key={v.id}>
                      <td className="p-2 border">{v.id}</td>
                      <td className="p-2 border">{v.code}</td>
                      <td className="p-2 border">{v.discountType}</td>
                      <td className="p-2 border">{v.value}</td>
                      <td className="p-2 border">{v.valueType}</td>
                      <td className="p-2 border">{v.usageType}</td>
                      <td className="p-2 border">{v.startDate.substring(0, 10)}</td>
                      <td className="p-2 border">{v.endDate.substring(0, 10)}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDeleteVoucher(v.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
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
        )}

        {/* TAB INTEGRATE */}
        {activeTab === "integrate" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Assign Discount/Voucher to Product
            </h2>

            {/* Daftar Produk */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Products</h3>
              {products.length === 0 ? (
                <p className="text-gray-600">No products found.</p>
              ) : (
                <ul className="list-disc list-inside">
                  {products.map((p) => (
                    <li key={p.productId}>
                      {p.productId} - {p.name} - Stock: {p.stock}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Form Assign Discount */}
            <form onSubmit={handleAssignDiscountToProduct} className="mb-4 grid grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Discount ID</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={integrationForm.discountId}
                  onChange={(e) =>
                    setIntegrationForm({
                      ...integrationForm,
                      discountId: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Product ID</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={integrationForm.productId}
                  onChange={(e) =>
                    setIntegrationForm({
                      ...integrationForm,
                      productId: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-end">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Assign Discount
                </button>
              </div>
            </form>

            {/* Form Assign Voucher */}
            <form onSubmit={handleAssignVoucherToProduct} className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Voucher ID</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={integrationForm.voucherId}
                  onChange={(e) =>
                    setIntegrationForm({
                      ...integrationForm,
                      voucherId: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Product ID</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={integrationForm.productId}
                  onChange={(e) =>
                    setIntegrationForm({
                      ...integrationForm,
                      productId: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex items-end">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Assign Voucher
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
