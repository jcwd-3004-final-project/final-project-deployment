import React, { useState, useEffect } from "react";
import axios from "axios";
import PurchaseCard from "@/components/purchaseCard"; // The card component from above
import Navbar from "@/components/navbar/navbar";

// Example statuses you want:
const STATUSES = [
  { key: "ALL", label: "Semua" },
  { key: "WAITING_FOR_PAYMENT", label: "Belum Bayar" },
  { key: "PROCESSING", label: "Sedang Dikemas" },
  { key: "SHIPPED", label: "Dikirim" },
  { key: "ORDER_CONFIRMED", label: "Selesai" },
  { key: "CANCELLED", label: "Dibatalkan" },
];

// Sample type: adjust to match your actual Order model
type Purchase = {
  id: number;
  status: string;       // e.g. BELUM_BAYAR, DIKIRIM, etc.
  shopName: string;
  productName: string;
  productImg: string;
  variation: string;
  quantity: number;
  totalPrice: number;
};

const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
   const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        let url = "http://localhost:8000/v1/api/user/purchases";
        
        // If not "ALL", append the status as a query param
        if (filterStatus !== "ALL") {
          url += `?status=${filterStatus}`;
        }

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setPurchases(res.data.data); // Adjust based on your backend response shape
      } catch (err) {
        console.error("Error fetching purchases:", err);
      }
    };

    fetchPurchases();
  }, [filterStatus]);

  // Example handlers for "Pesanan Selesai", "Ajukan Pengembalian", etc.
  const handleConfirm = (purchaseId: number) => {
    // Make an API call to confirm this purchase.
    console.log("Pesanan Selesai clicked for purchaseId:", purchaseId);
  };

  const handleRefund = (purchaseId: number) => {
    // Make an API call to request a refund/return
    console.log("Refund clicked for purchaseId:", purchaseId);
  };

  const handleContact = (purchaseId: number) => {
    console.log("Contact Seller for purchaseId:", purchaseId);
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
        
      <header className="p-4 border-b">
        <Navbar
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
        />
      </header>

      {/* Status Tabs */}
      <nav className="flex space-x-4 p-4 border-b">
        {STATUSES.map((status) => (
          <button
            key={status.key}
            className={`px-4 py-2 ${
              filterStatus === status.key
                ? "border-b-2 border-orange-500 font-semibold"
                : "text-gray-500"
            }`}
            onClick={() => setFilterStatus(status.key)}
          >
            {status.label}
          </button>
        ))}
      </nav>

      {/* Purchase Cards */}
      <main className="flex-grow p-4 bg-gray-100">
        {purchases.length === 0 ? (
          <div className="text-center text-gray-600 mt-8">
            Tidak ada pesanan.
          </div>
        ) : (
          purchases.map((purchase) => (
            <PurchaseCard
              key={purchase.id}
              shopName={purchase.shopName}
              productName={purchase.productName}
              productImg={purchase.productImg}
              variation={purchase.variation}
              quantity={purchase.quantity}
              totalPrice={purchase.totalPrice}
              status={purchase.status}
              onConfirm={() => handleConfirm(purchase.id)}
              onRefund={() => handleRefund(purchase.id)}
              onContactSeller={() => handleContact(purchase.id)}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default PurchasesPage;