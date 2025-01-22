import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PurchaseCard from "@/components/purchaseCard";
import Navbar from "@/components/navbar/navbar";

// Status filter options
const STATUSES = [
  { key: "ALL", label: "Semua" },
  { key: "WAITING_FOR_PAYMENT", label: "Belum Bayar" },
  { key: "PROCESSING", label: "Sedang Dikemas" },
  { key: "SHIPPED", label: "Dikirim" },
  { key: "ORDER_CONFIRMED", label: "Selesai" },
  { key: "CANCELLED", label: "Dibatalkan" },
];

// Tipe Purchase mengandung data diskon (opsional)
type Purchase = {
  id: number;
  store: { name: string } | null;
  totalAmount: number; // Total harga produk (bisa sudah termasuk diskon, tergantung backend)
  voucherDiscount?: number; // diskon dari voucher, jika ada
  referralDiscount?: number; // diskon dari referral, jika ada
  shippingCost?: number; // tambahkan biaya kirim
  status: string;
  items: Array<{
    quantity: number;
    variation?: string;
    product: {
      name: string;
      imageUrl?: string;
    };
  }>;
};

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const router = useRouter();

  // Fetch purchases berdasarkan filter status
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        let url = "https://d29jci2p0msjlf.cloudfront.net/v1/api/user/purchases";
        if (filterStatus !== "ALL") {
          url += `?status=${filterStatus}`;
        }
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPurchases(res.data.data);
      } catch (err) {
        console.error("Error fetching purchases:", err);
      }
    };

    fetchPurchases();
  }, [filterStatus]);

  // Button handler: Konfirmasi pesanan (set status => "ORDER_CONFIRMED")
  // menyesuaikan endpoint di backend: POST /v1/api/user/order/confirm/:id
  const handleConfirm = async (purchaseId: number) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        `https://d29jci2p0msjlf.cloudfront.net/v1/api/user/order/confirm/${purchaseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update status pesanan di state agar langsung berubah di UI
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === purchaseId ? { ...p, status: "ORDER_CONFIRMED" } : p
        )
      );
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleRefund = (purchaseId: number) => {
    console.log("Ajukan Pengembalian untuk purchaseId:", purchaseId);
    // Tambahkan API call atau logika refund di sini
  };

  const handleContactSeller = (purchaseId: number) => {
    console.log("Hubungi Penjual untuk purchaseId:", purchaseId);
    // Tambahkan API call atau logika kontak penjual di sini
  };

  const handleDetail = (purchaseId: number) => {
    router.push(`/purchase/${purchaseId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <Navbar />
      </header>

      {/* Filter Tabs */}
      <nav className="p-4 border-b overflow-x-auto">
        <div className="flex space-x-4">
          {STATUSES.map((status) => (
            <button
              key={status.key}
              className={`flex-shrink-0 px-4 py-2 ${
                filterStatus === status.key
                  ? "border-b-2 border-orange-500 font-semibold"
                  : "text-gray-500"
              }`}
              onClick={() => setFilterStatus(status.key)}
            >
              {status.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Purchase Cards */}
      <main className="flex-grow p-4 bg-gray-100 grid grid-cols-1 gap-4">
        {purchases.length === 0 ? (
          <div className="text-center text-gray-600 mt-8 col-span-full">
            Tidak ada pesanan.
          </div>
        ) : (
          purchases.map((purchase) => {
            // Ambil item pertama (untuk display ringkas)
            const firstItem =
              purchase.items && purchase.items.length > 0
                ? purchase.items[0]
                : null;

            // Perhitungan diskon (jika ada)
            const voucherDisc = purchase.voucherDiscount || 0;
            const referralDisc = purchase.referralDiscount || 0;
            const totalDiscount = voucherDisc + referralDisc;

            // Perhitungan subtotal setelah diskon (tidak kurang dari 0)
            const adjustedTotal =
              purchase.totalAmount - totalDiscount < 0
                ? 0
                : purchase.totalAmount - totalDiscount;

            // Tambahkan biaya kirim agar total sama dengan detail
            const shippingCost = purchase.shippingCost || 0;
            const finalTotal = adjustedTotal + shippingCost;

            // Format data untuk PurchaseCard
            const formattedPurchase = {
              id: purchase.id,
              shopName: purchase.store ? purchase.store.name : "Shop Name",
              productName: firstItem ? firstItem.product.name : "Product Name",
              productImg:
                firstItem && firstItem.product.imageUrl
                  ? firstItem.product.imageUrl
                  : undefined,
              variation: firstItem ? firstItem.variation || "" : "",
              quantity: firstItem ? firstItem.quantity : 0,
              totalPrice: finalTotal, // Nilai akhir setelah diskon + ongkir
              status: purchase.status,
            };

            return (
              <PurchaseCard
                key={formattedPurchase.id}
                shopName={formattedPurchase.shopName}
                productName={formattedPurchase.productName}
                productImg={formattedPurchase.productImg}
                variation={formattedPurchase.variation}
                quantity={formattedPurchase.quantity}
                totalPrice={formattedPurchase.totalPrice}
                status={formattedPurchase.status}
                onConfirm={() => handleConfirm(formattedPurchase.id)}
                onRefund={() => handleRefund(formattedPurchase.id)}
                onContactSeller={() =>
                  handleContactSeller(formattedPurchase.id)
                }
                onDetail={() => handleDetail(formattedPurchase.id)}
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default PurchasesPage;
