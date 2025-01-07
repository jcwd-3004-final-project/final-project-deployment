// pages/payment.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

export default function PaymentPage() {
  const router = useRouter();
  const { orderId } = router.query; // from ?orderId=123

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!orderId) {
      alert("No order ID provided!");
      return;
    }
    if (!selectedFile) {
      alert("Please select a payment proof image.");
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("orderId", String(orderId));
      formData.append("paymentProof", selectedFile);

      // Post to your order upload endpoint
      const res = await fetch("http://localhost:8000/v1/api/user/order/upload", {
        method: "POST",
        body: formData, // we send the form data directly
        credentials: "include", // or token if needed
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Upload failed");
      }

      alert("Payment proof uploaded successfully!");
      router.push("/"); // or go to an order confirmation page
    } catch (error) {
      console.error("Error uploading payment proof:", error);
      alert("Failed to upload payment proof.");
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
            accept="image/*" // restrict to images
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