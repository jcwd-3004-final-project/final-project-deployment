"use client";
import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

// Tipe data untuk Product
interface Product {
  productId: number;
  name: string;
  stock: number;
}

// Tipe data untuk Stock Log
interface StockLog {
  id: number; // ID dari log
  storeProductId: number; // ID produk terkait log (dari storeProduct)
  adjustmentType: "INCREASE" | "DECREASE"; // Tipe perubahan stok
  quantity: number; // Jumlah perubahan stok
  reason: string; // Alasan perubahan stok
  createdAt: string; // Tanggal perubahan
}

export default function AdminDashboardPage() {
  const [storeId, setStoreId] = useState<number | null>(null);

  // Data produk
  const [products, setProducts] = useState<Product[]>([]);

  // Untuk update stok
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [changeQuantity, setChangeQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>("");

  // Untuk menampilkan logs
  const [logs, setLogs] = useState<StockLog[]>([]);

  // UI state
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Contoh base URL sesuai rute backend
  const BASE_URL = "http://localhost:8000/v1/api/inventory";

  // Tambahkan state untuk menyimpan storeId

  // Ambil storeId dari endpoint
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken"); // Simpan token setelah login
        if (!token) {
          setMessage("Access token missing. Please log in.");
          return;
        }

        const res = await fetch(
          "http://localhost:8000/v1/api/store-admin/details",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Gunakan token untuk autentikasi
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch store details.");
        }

        // Set storeId dari respons API
        setStoreId(data?.data?.store?.store_id);
        setMessage("Store details fetched successfully!");
      } catch (error: any) {
        setMessage(error.message);
      }
    };

    fetchStoreDetails();
  }, []);

  // 2. Fetch products untuk storeId tertentu
  const fetchProducts = async (storeId: number) => {
    try {
      setLoading(true);
      setMessage("");

      // GET /stores/:storeId/products
      const res = await fetch(
        `http://localhost:8000/v1/api/stores/${storeId}/products`
      );
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
      setMessage("Products fetched successfully!");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Update stock untuk productId tertentu
  const handleUpdateStock = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeId || !selectedProductId) {
      setMessage("Please select a product first.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      // POST /stores/:storeId/products/:productId/stock
      const res = await fetch(
        `${BASE_URL}/stores/${storeId}/products/${selectedProductId}/stock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            changeQuantity,
            reason,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.message || "Failed to update stock");
      }

      setMessage("Stock updated successfully!");
      setChangeQuantity(0);
      setReason("");
      // Refresh products list to see new stock
      fetchProducts(storeId);
      // Juga bisa langsung fetch logs
      handleFetchLogs(selectedProductId);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Fetch logs untuk productId tertentu
  const handleFetchLogs = async (productId: number) => {
    if (!storeId || !productId) return;
    setLoading(true);
    setMessage("");

    try {
      // GET /stores/:storeId/products/:productId/logs
      const res = await fetch(
        `${BASE_URL}/stores/${storeId}/products/${productId}/logs`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch logs");
      }

      setLogs(data.data || []);
      setMessage("Logs fetched successfully!");
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Saat storeId tersedia, fetch daftar product
  useEffect(() => {
    if (storeId) {
      fetchProducts(storeId);
    }
  }, [storeId]);

  // Jika user memilih product, otomatis fetch logs
  useEffect(() => {
    if (selectedProductId > 0) {
      handleFetchLogs(selectedProductId);
    } else {
      setLogs([]);
    }
  }, [selectedProductId]);

  if (storeId === null) {
    return (
      <div className="min-h-screen bg-green-50 p-8">
        <h1 className="text-4xl font-bold text-green-800 mb-6">
          Store Admin Dashboard
        </h1>
        <p>Loading store details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-4xl font-bold text-green-800 mb-6">
        Store Admin Dashboard
      </h1>

      {/* Tombol halaman voucher */}
      <div className="mb-4">
        <Link href="/storeAdmin/Voucher">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Go to Voucher Page
          </button>
        </Link>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`mb-4 p-4 rounded border-l-4 ${
            message.includes("success")
              ? "bg-green-100 text-green-700 border-green-600"
              : "bg-red-100 text-red-700 border-red-600"
          }`}
        >
          {message.includes("success") ? (
            <FaCheckCircle className="inline mr-2" />
          ) : (
            <FaExclamationCircle className="inline mr-2" />
          )}
          {message}
        </div>
      )}

      {/* Daftar Product */}
      <div className="bg-white p-6 rounded shadow-md border border-green-200 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Products in Your Store
        </h2>
        {products.length === 0 ? (
          <p className="text-sm text-gray-500">
            No products found for this store.
          </p>
        ) : (
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-green-100 border-b">
                <th className="py-2 px-4 text-left text-green-800">
                  Product ID
                </th>
                <th className="py-2 px-4 text-left text-green-800">Name</th>
                <th className="py-2 px-4 text-left text-green-800">Stock</th>
                <th className="py-2 px-4 text-left text-green-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod.productId} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">{prod.productId}</td>
                  <td className="py-2 px-4">{prod.name}</td>
                  <td className="py-2 px-4">{prod.stock}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => setSelectedProductId(prod.productId)}
                      className="text-blue-600 underline"
                    >
                      View Logs
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Update Stock */}
      <form
        onSubmit={handleUpdateStock}
        className="bg-white p-6 rounded shadow-md border border-green-200 space-y-4 mb-6"
      >
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Update Stock
        </h2>

        {/* Pilih product ID dari dropdown agar tidak manual ketik */}
        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">
            Select Product
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            className="border rounded px-4 py-2 w-full focus:ring focus:ring-green-200 focus:border-green-400"
          >
            <option value={0}>-- Choose a Product --</option>
            {products.map((prod) => (
              <option key={prod.productId} value={prod.productId}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">
            Change Quantity
          </label>
          <input
            type="number"
            value={changeQuantity || ""}
            onChange={(e) => setChangeQuantity(Number(e.target.value))}
            className="border rounded px-4 py-2 w-full focus:ring focus:ring-green-200 focus:border-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-green-800 mb-1">
            Reason
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border rounded px-4 py-2 w-full focus:ring focus:ring-green-200 focus:border-green-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || selectedProductId === 0}
          className={`w-full py-2 rounded bg-green-600 text-white font-medium ${
            loading || selectedProductId === 0
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-green-700"
          }`}
        >
          {loading ? "Processing..." : "Update Stock"}
        </button>
      </form>

      {/* Logs Table */}
      <div className="bg-white p-6 rounded shadow-md border border-green-200">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Stock Logs
        </h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No logs for selected product.</p>
        ) : (
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-green-100 border-b">
                <th className="py-2 px-4 text-left text-green-800">Log ID</th>
                <th className="py-2 px-4 text-left text-green-800">
                  Product ID
                </th>
                <th className="py-2 px-4 text-left text-green-800">
                  Change Quantity
                </th>
                <th className="py-2 px-4 text-left text-green-800">Reason</th>
                <th className="py-2 px-4 text-left text-green-800">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">{log.id}</td>
                  <td className="py-2 px-4">{log.storeProductId}</td>
                  <td className="py-2 px-4">
                    {log.adjustmentType === "DECREASE" ? "-" : "+"}
                    {log.quantity}
                  </td>
                  <td className="py-2 px-4">{log.reason}</td>
                  <td className="py-2 px-4">
                    {new Date(log.createdAt).toLocaleString()}
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
