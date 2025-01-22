import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const router = useRouter();
  const { orderId } = router.query; // e.g. ?orderId=123

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 jam = 3600 detik

  useEffect(() => {
    if (!orderId) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleCancelOrder(); // Batalkan pesanan saat waktu habis
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Hapus timer saat komponen unmount
  }, [orderId]);

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
      const formData = new FormData();
      formData.append("orderId", String(orderId));
      formData.append("paymentProof", selectedFile);

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
      const res = await fetch(
        "http://localhost:8000/v1/api/user/order/upload",
        {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }
      await Swal.fire({
        icon: "success",
        title: "Success",
        text: "Payment proof uploaded successfully!",
      });
      router.push("/");
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

  const handleCancelOrder = async () => {
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No token found. Please log in again.",
        });
        return;
      }

      if (!orderId) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No order ID provided.",
        });
        return;
      }

      // Kirim permintaan pembatalan ke backend
      const res = await fetch(
        `http://localhost:8000/v1/api/user/order/cancel/${orderId}`,
        {
          method: "POST", // Gunakan metode POST untuk pembatalan
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token sebagai header Authorization
            "Content-Type": "application/json", // Tambahkan Content-Type jika diperlukan
          },
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to cancel order.",
        });
        return;
      }
      Swal.fire({
        icon: "warning",
        title: "Order Canceled",
        text: "Your order has been canceled due to inactivity.",
      });
      router.push("/");
    } catch (error) {
      console.error("Error canceling order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred while canceling the order.",
      });
    }
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Payment</h1>
        <p className="mb-4">Order ID: {orderId}</p>
        <p className="mb-4">
          Time remaining :{" "}
          <span className="font-bold text-red-500">{formatTime(timeLeft)}</span>
        </p>

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
