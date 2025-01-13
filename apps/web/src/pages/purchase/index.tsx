import React, { useState, useEffect } from "react";
import axios from "axios";
import PurchaseCard from "@/components/purchaseCard";
import Navbar from "@/components/navbar/navbar";

// Daftar status untuk filter
const STATUSES = [
  { key: "ALL", label: "Semua" },
  { key: "WAITING_FOR_PAYMENT", label: "Belum Bayar" },
  { key: "PROCESSING", label: "Sedang Dikemas" },
  { key: "SHIPPED", label: "Dikirim" },
  { key: "ORDER_CONFIRMED", label: "Selesai" },
  { key: "CANCELLED", label: "Dibatalkan" },
];

// Tipe data berdasarkan struktur respons API
type Purchase = {
  id: number;
  store: { name: string } | null;
  totalAmount: number;
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        let url = "http://localhost:8000/v1/api/user/purchases";
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

  // Handler untuk aksi tombol
  const handleConfirm = (purchaseId: number) => {
    console.log("Pesanan Selesai untuk purchaseId:", purchaseId);
    // Lakukan API call atau logika lainnya di sini
  };

  const handleRefund = (purchaseId: number) => {
    console.log("Ajukan Pengembalian untuk purchaseId:", purchaseId);
    // Lakukan API call atau logika lainnya di sini
  };

  const handleContactSeller = (purchaseId: number) => {
    console.log("Hubungi Penjual untuk purchaseId:", purchaseId);
    // Lakukan API call atau logika lainnya di sini
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    const productSection = document.querySelector("#product-section");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <Navbar
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </header>

      {/* Filter Tabs (Responsive untuk mobile: scrollable secara horizontal) */}
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

      {/* Purchase Cards - Tampilan list (satu kolom) yang tidak berubah untuk desktop */}
      <main
        id="product-section"
        className="flex-grow p-4 bg-gray-100 grid grid-cols-1 gap-4"
      >
        {purchases.length === 0 ? (
          <div className="text-center text-gray-600 mt-8 col-span-full">
            Tidak ada pesanan.
          </div>
        ) : (
          purchases.map((purchase) => {
            const firstItem =
              purchase.items && purchase.items.length > 0
                ? purchase.items[0]
                : null;

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
              totalPrice: purchase.totalAmount,
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
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default PurchasesPage;
