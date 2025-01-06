"use client";
import { FormEvent, useState } from "react";

interface StockLog {
  id: number;
  productId: number;
  changeQuantity: number;
  reason: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [productId, setProductId] = useState<number>(0);
  const [changeQuantity, setChangeQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [logs, setLogs] = useState<StockLog[]>([]);
  const [message, setMessage] = useState<string>(""); // untuk info sukses/gagal

  // Sesuaikan dengan alamat port/host backend Express Anda
  const BASE_URL = "http://localhost:8000/v1/api/inventory";

  // Handle Update Stock
  const handleUpdateStock = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      // Memanggil PUT /update-stock
      // Body yang dikirim: { productId, changeQuantity, reason }
      const res = await fetch(`${BASE_URL}/update-stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId, // <-- pastikan key-nya "productId"
          changeQuantity,
          reason,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || "Failed to update stock");
      }

      setMessage("Stock updated successfully!");
      // Reset form
      setChangeQuantity(0);
      setReason("");
    } catch (error: any) {
      setMessage(error.message);
      console.error(error);
    }
  };

  // Handle Fetch Logs
  const handleFetchLogs = async () => {
    setMessage("");

    if (!productId) {
      setMessage("Mohon isi Product ID terlebih dahulu");
      return;
    }

    try {
      // Memanggil GET /stock-logs/:productId
      const res = await fetch(`${BASE_URL}/stock-logs/${productId}`, {
        method: "GET",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to fetch logs");
      }

      setLogs(data.data || []);
      setMessage("Logs fetched successfully!");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Store Admin Dashboard</h1>

      {/* Pesan sukses/gagal */}
      {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}

      {/* Form Update Stock */}
      <form onSubmit={handleUpdateStock} className="mb-6 space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Product ID</label>
          <input
            type="number"
            value={productId || ""}
            onChange={(e) => setProductId(Number(e.target.value))}
            className="border rounded px-3 py-1 w-48"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Change Quantity
          </label>
          <input
            type="number"
            value={changeQuantity || ""}
            onChange={(e) => setChangeQuantity(Number(e.target.value))}
            className="border rounded px-3 py-1 w-48"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Reason</label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="border rounded px-3 py-1 w-96"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Stock
        </button>
      </form>

      {/* Tombol Fetch Logs */}
      <div className="mb-6">
        <button
          onClick={handleFetchLogs}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Fetch Logs
        </button>
      </div>

      {/* Tabel Logs */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Stock Logs</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No logs found.</p>
        ) : (
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="py-2 px-4 text-left">Log ID</th>
                <th className="py-2 px-4 text-left">Product ID</th>
                <th className="py-2 px-4 text-left">Change Quantity</th>
                <th className="py-2 px-4 text-left">Reason</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{log.id}</td>
                  <td className="py-2 px-4">{log.productId}</td>
                  <td className="py-2 px-4">{log.changeQuantity}</td>
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
