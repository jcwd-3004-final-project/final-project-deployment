import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import clsx from "clsx";

// ------------------ Tipe Data ------------------
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
  expiryDate?: string; // opsional, jika schema mewajibkan
}

interface Referral {
  id: number;
  referralCode: string;
  referrerId: number;
  referredId?: number; // optional
}

interface Product {
  id: number;
  images: string[];
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
}

export default function PromoPage() {
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
    // expiryDate: "", // jika ingin user input expiryDate
  });

  // ------------------ INTEGRATE DISCOUNT/VOUCHER -> PRODUCT ------------------
  const [integrationForm, setIntegrationForm] = useState({
    discountId: 0,
    voucherId: 0,
    productId: 0,
  });

  const [message, setMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // ------------------ Fetch Products ------------------
  /**
   * Hanya bagian ini yang diperbaiki agar tidak error 
   * jika respons backend bukan array secara langsung.
   */
  const fetchProducts = async () => {
    try {
      // Misalkan respons backend: { success: true, data: { products: [...] } }
      // atau mungkin langsung [ {...}, {...} ]
      const res = await axios.get("http://localhost:8000/v1/api/products");
      console.log("Fetched products response:", res.data);

      // Contoh 1: Jika respons langsung array, cukup:
      // if (Array.isArray(res.data)) setProducts(res.data);
      // else setProducts([]);

      // Contoh 2 (lebih fleksibel):
      // Asumsi: { success: boolean, data: { products: array } }
      // Silakan sesuaikan dengan real format respons di backend.
      if (
        res.data && 
        res.data.success === true &&
        res.data.data &&
        Array.isArray(res.data.data.products)
      ) {
        setProducts(res.data.data.products);
      } else if (Array.isArray(res.data)) {
        // Jika ternyata res.data adalah array langsung
        setProducts(res.data);
      } else {
        // Fallback kalau format tidak sesuai
        console.error("Unexpected response format for products:", res.data);
        setProducts([]);
        setErrorMsg("Unexpected format for products (not an array).");
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setErrorMsg(err.message || "Error fetching products");
      // fallback ke array kosong agar .map tidak error
      setProducts([]);
    }
  };

  // ------------------ Fetch DISCOUNT ------------------
  const fetchDiscounts = async () => {
    try {
      const res = await axios.get<Discount[]>("http://localhost:8000/v1/api/discounts/discounts");
      setDiscounts(res.data);
    } catch (err: any) {
      setErrorMsg(err.message || "Error fetching discounts");
    }
  };

  // ------------------ Fetch VOUCHER ------------------
  const fetchVouchers = async () => {
    try {
      const res = await axios.get<Voucher[]>("http://localhost:8000/v1/api/discounts/vouchers");
      setVouchers(res.data);
    } catch (err: any) {
      setErrorMsg(err.message || "Error fetching vouchers");
    }
  };

  // ------------------ useEffect TAB ------------------
  useEffect(() => {
    if (activeTab === "discount") {
      fetchDiscounts();
    } else if (activeTab === "voucher") {
      fetchVouchers();
    } else if (activeTab === "integrate") {
      fetchProducts();
      fetchDiscounts();
      fetchVouchers();
    }
  }, [activeTab]);

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
      // Reset form
      setDiscountForm({
        type: "",
        value: 0,
        valueType: "",
        startDate: "",
        endDate: "",
        maxDiscount: 0,
        minPurchase: 0,
      });
      // Refresh discount list
      fetchDiscounts();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || "Error creating discount");
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
      setErrorMsg(err.response?.data?.error || err.message || "Error deleting discount");
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
      setErrorMsg(err.response?.data?.error || err.message || "Error creating voucher");
    }
  };


  // ------------------ HANDLER: INTEGRATION ------------------
  const handleAssignDiscountToProduct = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);

    try {
      const { discountId, productId } = integrationForm;
      await axios.post(`http://localhost:8000/v1/api/discounts/discounts/${discountId}/assign`, {
        productId: Number(productId),
      });
      setMessage(`Assigned discount ${discountId} to product ${productId}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || "Error assigning discount");
    }
  };

  const handleAssignVoucherToProduct = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrorMsg(null);

    try {
      const { voucherId, productId } = integrationForm;
      await axios.post(`http://localhost:8000/v1/api/discounts/vouchers/${voucherId}/assign`, {
        productId: Number(productId),
      });
      setMessage(`Assigned voucher ${voucherId} to product ${productId}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || "Error assigning voucher");
    }
  };

  // Helpers
  const handleTabSwitch = (tab: "discount" | "voucher" | "integrate") => {
    setMessage(null);
    setErrorMsg(null);
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow">
        <h1 className="text-3xl font-bold mb-4">Promo Management</h1>

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

        {/* Info message / error */}
        {message && <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">{message}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">{errorMsg}</div>}

        {/* TAB DISCOUNT */}
        {activeTab === "discount" && (
          <div>
            {/* CREATE DISCOUNT FORM */}
            <form onSubmit={handleCreateDiscount} className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block mb-1 font-medium">Type</label>
                <select
                  name="type"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.type}
                  onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="PRODUCT_DISCOUNT">PRODUCT_DISCOUNT</option>
                  <option value="BUY_ONE_GET_ONE">BUY_ONE_GET_ONE</option>
                  <option value="MIN_PURCHASE_DISCOUNT">MIN_PURCHASE_DISCOUNT</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Value</label>
                <input
                  type="number"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.value}
                  onChange={(e) => setDiscountForm({ ...discountForm, value: +e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Value Type</label>
                <select
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.valueType}
                  onChange={(e) => setDiscountForm({ ...discountForm, valueType: e.target.value })}
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
                  onChange={(e) => setDiscountForm({ ...discountForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.endDate}
                  onChange={(e) => setDiscountForm({ ...discountForm, endDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Max Discount</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.maxDiscount}
                  onChange={(e) => setDiscountForm({ ...discountForm, maxDiscount: +e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Min Purchase</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={discountForm.minPurchase}
                  onChange={(e) => setDiscountForm({ ...discountForm, minPurchase: +e.target.value })}
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
                      <td className="p-2 border">{d.startDate?.substring(0, 10)}</td>
                      <td className="p-2 border">{d.endDate?.substring(0, 10)}</td>
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
                  onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Discount Type</label>
                <select
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.discountType}
                  onChange={(e) => setVoucherForm({ ...voucherForm, discountType: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="MIN_PURCHASE_DISCOUNT">MIN_PURCHASE_DISCOUNT</option>
                  <option value="PRODUCT_DISCOUNT">PRODUCT_DISCOUNT</option>
                  {/* dsb, sesuai backend enum */}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Value</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.value}
                  onChange={(e) => setVoucherForm({ ...voucherForm, value: +e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Value Type</label>
                <select
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.valueType}
                  onChange={(e) => setVoucherForm({ ...voucherForm, valueType: e.target.value })}
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
                  onChange={(e) => setVoucherForm({ ...voucherForm, usageType: e.target.value })}
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
                  onChange={(e) => setVoucherForm({ ...voucherForm, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">End Date</label>
                <input
                  type="date"
                  required
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.endDate}
                  onChange={(e) => setVoucherForm({ ...voucherForm, endDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Min Purchase Amount</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.minPurchaseAmount}
                  onChange={(e) => setVoucherForm({ ...voucherForm, minPurchaseAmount: +e.target.value })}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Max Discount</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={voucherForm.maxDiscount}
                  onChange={(e) => setVoucherForm({ ...voucherForm, maxDiscount: +e.target.value })}
                />
              </div>
              {/* 
              <div>
                <label className="block mb-1 font-medium">Expiry Date</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded p-2 w-full"
                  // jika user mau input expiryDate
                  onChange={(e) => setVoucherForm({ ...voucherForm, expiryDate: e.target.value })}
                />
              </div>
              */}
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
                      <td className="p-2 border">{v.startDate?.substring(0, 10)}</td>
                      <td className="p-2 border">{v.endDate?.substring(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "integrate" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Assign Discount/Voucher to Product</h2>

            {/* Pilih product, discount, voucher pakai <select> */}
            {/* Products list */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Products</h3>
              <ul className="list-disc list-inside">
                {products.length === 0 ? (
                  <li className="text-gray-600">No products found.</li>
                ) : (
                  products.map((p) => (
                    <li key={p.id}>
                      {p.id} - {p.name} - Rp {p.price}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Discounts</h3>
              <ul className="list-disc list-inside">
                {discounts.length === 0 ? (
                  <li className="text-gray-600">No discounts found.</li>
                ) : (
                  discounts.map((d) => (
                    <li key={d.id}>
                      {d.id} - {d.type} - Value: {d.value}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Vouchers</h3>
              <ul className="list-disc list-inside">
                {vouchers.length === 0 ? (
                  <li className="text-gray-600">No vouchers found.</li>
                ) : (
                  vouchers.map((v) => (
                    <li key={v.id}>
                      {v.id} - {v.code} - {v.discountType}
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Form Assign Discount */}
            <form onSubmit={handleAssignDiscountToProduct} className="mb-4 grid grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Discount ID</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={integrationForm.discountId}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, discountId: +e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Product ID</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={integrationForm.productId}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, productId: +e.target.value })}
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
                  onChange={(e) => setIntegrationForm({ ...integrationForm, voucherId: +e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Product ID</label>
                <input
                  type="number"
                  className="border border-gray-300 rounded p-2 w-full"
                  value={integrationForm.productId}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, productId: +e.target.value })}
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
