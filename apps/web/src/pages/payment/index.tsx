// pages/payment.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const router = useRouter();
  const { orderId } = router.query; // e.g. ?orderId=123

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!orderId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No order ID provided!",
      });
      return;
    }
    if (!selectedFile) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a payment proof image.",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Buat FormData
      const formData = new FormData();
      formData.append("orderId", String(orderId));
      formData.append("paymentProof", selectedFile);

      // Ambil token dari localStorage (diasumsikan Anda menyimpannya saat login)
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "No token found, please log in again.",
        });
        setIsUploading(false);
        return;
      }

      // Lakukan request ke backend dengan header Authorization
      const res = await fetch(
        "http://localhost:8000/v1/api/user/order/upload",
        {
          method: "POST",
          body: formData,
          credentials: "include", // Kirim cookie juga, jika diperlukan
          headers: {
            // Sertakan token di Authorization header
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      // Jika server mengembalikan success = false atau res.ok = false, lempar error
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Payment proof uploaded successfully!",
      });
      router.push("/"); // Arahkan ke halaman lain setelah upload sukses
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to upload payment proof.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>
        <p className="mb-4">Order ID: {orderId}</p>

        <div className="mb-4">
          <label className="block font-medium mb-2" htmlFor="paymentProof">
            Upload Transfer Proof:
          </label>
          <input
            type="file"
            id="paymentProof"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full"
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Submit Payment Proof"}
        </button>
      </main>
      <Footer />
    </div>
  );
}
