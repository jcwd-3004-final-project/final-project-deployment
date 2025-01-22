"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

// Tipe data untuk Product (di menu Inventory)
interface Product {
  productId: number;
  name: string;
  stock: number;
}

// Tipe data untuk Stock Log
interface StockLog {
  id: number;
  storeProductId: number;
  adjustmentType: "INCREASE" | "DECREASE";
  quantity: number;
  reason: string;
  createdAt: string;
}

// Tipe data untuk item di dalam pesanan
interface OrderItem {
  productName: string;
  quantity: number;
}

// Tipe data untuk Order
interface Order {
  id: number;
  orderId: string;
  status: string;
  paymentProofUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  // Tambahkan array items di sini
  items?: OrderItem[];
}

export default function AdminDashboardPage() {
  const [storeId, setStoreId] = useState<number | null>(null);

  // Data produk
  const [products, setProducts] = useState<Product[]>([]);
  // Untuk update stock
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [changeQuantity, setChangeQuantity] = useState<number>(0);
  // Gunakan dropdown untuk reason
  const [reason, setReason] = useState<string>("sale");

  // Untuk menampilkan logs
  const [logs, setLogs] = useState<StockLog[]>([]);

  // Untuk notifikasi / pesan
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Daftar pesanan menunggu konfirmasi & siap kirim
  const [paymentOrders, setPaymentOrders] = useState<Order[]>([]);
  const [shipmentOrders, setShipmentOrders] = useState<Order[]>([]);

  // Base URL untuk API inventory (untuk update stock & logs)
  const BASE_URL = "https://d29jci2p0msjlf.cloudfront.net/v1/api/inventory";

  // Tambahkan handler logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    // Redirect ke halaman login atau landing page
    window.location.href = "/";
  };

  // 1. Ambil storeId dari endpoint store-admin
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setMessage("Access token missing. Please log in.");
          return;
        }
        const res = await fetch(
          "https://d29jci2p0msjlf.cloudfront.net/v1/api/store-admin/details",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch store details.");
        }
        // Ambil store_id
        setStoreId(data?.data?.store?.store_id);
        setMessage("Store details fetched successfully!");
      } catch (error: any) {
        setMessage(error.message);
      }
    };

    fetchStoreDetails();
  }, []);

  // 2. Fetch produk untuk store tertentu
  const fetchProducts = async (storeId: number) => {
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch(
        `https://d29jci2p0msjlf.cloudfront.net/v1/api/stores/${storeId}/products`
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

  // 3. Update stock untuk produk tertentu
  const handleUpdateStock = async (e: FormEvent) => {
    e.preventDefault();
    if (!storeId || !selectedProductId) {
      setMessage("Please select a product first.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
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
      setReason("sale"); // set ulang ke default
      // Refresh daftar produk & logs
      fetchProducts(storeId);
      handleFetchLogs(selectedProductId);
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Fetch logs untuk produk tertentu
  const handleFetchLogs = async (productId: number) => {
    if (!storeId || !productId) return;
    setLoading(true);
    setMessage("");
    try {
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

  // 5a. Fetch pesanan yang menunggu konfirmasi pembayaran
  const fetchPaymentOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMessage("Access token missing. Please log in.");
        return;
      }
      const res = await fetch(
        "https://d29jci2p0msjlf.cloudfront.net/v1/api/store-admin/orders?status=WAITING_FOR_PAYMENT_CONFIRMATION",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch payment orders");
      }
      // Pastikan data.data menyertakan items
      setPaymentOrders(data.data || []);
    } catch (error: any) {
      console.error("Error fetching payment orders:", error.message);
    }
  };

  // 5b. Fetch pesanan untuk pengiriman (status PROCESSING atau WAITING_FOR_PAYMENT_CONFIRMATION)
  const fetchShipmentOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setMessage("Access token missing. Please log in.");
        return;
      }

      // Ambil semua pesanan dari store-admin (tanpa filter status di query)
      const res = await fetch("https://d29jci2p0msjlf.cloudfront.net/v1/api/store-admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }
      const ordersForShipment = data.data.filter(
        (order: Order) =>
          order.status === "PROCESSING" ||
          order.status === "WAITING_FOR_PAYMENT_CONFIRMATION"
      );
      setShipmentOrders(ordersForShipment);
    } catch (error: any) {
      console.error("Error fetching shipment orders:", error.message);
    }
  };

  // 6. Handler konfirmasi pembayaran
  const handleConfirmPayment = async (orderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Access token missing. Please log in.");
        return;
      }
      const res = await fetch(
        `https://d29jci2p0msjlf.cloudfront.net/v1/api/store-admin/orders/confirm/${orderId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to confirm payment");
      }
      alert("Payment confirmed. Order is now processing.");
      // Refresh daftar pesanan
      fetchPaymentOrders();
      fetchShipmentOrders();
    } catch (error: any) {
      console.error("Error confirming payment:", error.message);
      alert("Error confirming payment");
    }
  };

  // 7. Handler menandai pesanan sebagai dikirim
  const handleMarkShipped = async (orderId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Access token missing. Please log in.");
        return;
      }
      const res = await fetch(
        `https://d29jci2p0msjlf.cloudfront.net/v1/api/store-admin/orders/ship/${orderId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to mark as shipped");
      }
      alert(
        "Order marked as shipped. Payment was confirmed automatically if required."
      );
      fetchShipmentOrders();
    } catch (error: any) {
      console.error("Error marking order as shipped:", error.message);
      alert("Error marking order as shipped");
    }
  };

  // 8. Ketika storeId sudah tersedia, fetch produk & orders
  useEffect(() => {
    if (storeId) {
      fetchProducts(storeId);
      fetchPaymentOrders();
      fetchShipmentOrders();
    }
  }, [storeId]);

  // 9. Jika user memilih produk, fetch logs terkait
  useEffect(() => {
    if (selectedProductId > 0) {
      handleFetchLogs(selectedProductId);
    } else {
      setLogs([]);
    }
  }, [selectedProductId]);

  // Tampilkan halaman loading jika storeId belum ada
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

      {/* Navigation Buttons */}
      <div className="flex justify-between mb-4">
        <Link href="/storeAdmin/Voucher">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Go to Voucher Page
          </button>
        </Link>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Notifikasi */}
      {message && (
        <div
          className={`mb-4 p-4 rounded border-l-4 ${
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
          {message}
        </div>
      )}

      {/* SECTION: Orders Ready for Shipment */}
      <div className="bg-white p-6 rounded shadow-md border border-green-200 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Orders Ready for Shipment
        </h2>
        {shipmentOrders.length === 0 ? (
          <p className="text-sm text-gray-500">
            Tidak ada pesanan yang siap untuk dikirim.
          </p>
        ) : (
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-green-100 border-b">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipmentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">{order.orderId}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleMarkShipped(order.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Mark as Shipped
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SECTION: Payment Confirmations */}
      <div className="bg-white p-6 rounded shadow-md border border-green-200 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Payment Confirmations
        </h2>
        {paymentOrders.length === 0 ? (
          <p className="text-sm text-gray-500">
            Tidak ada pesanan yang menunggu konfirmasi pembayaran.
          </p>
        ) : (
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-green-100 border-b">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Payment Proof</th>
                <th className="py-2 px-4 text-left">Items</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paymentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-4">{order.orderId}</td>
                  <td className="py-2 px-4">
                    {order.paymentProofUrl ? (
                      <a
                        href={order.paymentProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Proof
                      </a>
                    ) : (
                      <span>No proof uploaded</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx}>
                          {item.productName} x {item.quantity}
                        </div>
                      ))
                    ) : (
                      <span>No items</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleConfirmPayment(order.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Confirm Payment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* SECTION: Inventory Management */}
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

      {/* SECTION: Form Update Stock */}
      <form
        onSubmit={handleUpdateStock}
        className="bg-white p-6 rounded shadow-md border border-green-200 space-y-4 mb-6"
      >
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          Update Stock
        </h2>

        {/* Pilih produk dari dropdown */}
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
          {/* Dropdown untuk Reason dengan opsi "sale" dan "purchase" */}
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border rounded px-4 py-2 w-full focus:ring focus:ring-green-200 focus:border-green-400"
            required
          >
            <option value="sale">Sale</option>
            <option value="purchase">Purchase</option>
          </select>
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

      {/* SECTION: Logs Table */}
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
