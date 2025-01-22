import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { Tooltip } from "react-tooltip"; // Install a tooltip library or use custom styles

/** Format number as currency (IDR) */
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

interface PurchaseItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface StoreInfo {
  store_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  maxDeliveryDistance: number;
  createdAt: string;
  updatedAt: string;
}

interface AddressInfo {
  address_id: number;
  userId: number;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PurchaseDetail {
  id: number;
  userId: number;
  storeId: number;
  status: string;
  totalAmount: number;
  shippingCost: number;
  shippingAddressId: number;
  shippingMethod: string;
  paymentProof: string | null;
  paymentMethod: string;
  userVoucherId: number | null;
  createdAt: string;
  updatedAt: string;
  items: PurchaseItem[];
  store: StoreInfo | null;
  shippingAddress: AddressInfo | null;
}

export default function PurchaseDetailPage() {
  const router = useRouter();
  const { order_id } = router.query;
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemsExpanded, setItemsExpanded] = useState(false);

  useEffect(() => {
    if (!order_id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found. Please log in.");
          setLoading(false);
          return;
        }



        const response = await axios.get("https://d29jci2p0msjlf.cloudfront.net/v1/api/user/purchases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });



        const allPurchases: PurchaseDetail[] = response.data.data;
        const found = allPurchases.find((p) => p.id === Number(order_id));
        setPurchase(found || null);
      } catch (error) {
        console.error("Error fetching purchase detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [order_id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <p>Loading purchase detail...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">
            No purchase found with ID <strong>{order_id}</strong>.
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const {
    id,
    status,
    totalAmount,
    shippingCost,
    shippingMethod,
    paymentMethod,
    store,
    shippingAddress,
    items,
  } = purchase;

  const grandTotal = totalAmount + shippingCost;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-extrabold mb-6">Order Detail</h1>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <p>
            <span className="font-semibold">Order ID: </span>
            {id}
          </p>
          <p>
            <span className="font-semibold">Status: </span>
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status}
            </span>
          </p>
          <p>
            <span className="font-semibold">Payment Method: </span>
            <Tooltip content="The method used for payment" place="top">
              {paymentMethod}
            </Tooltip>
          </p>
          <p>
            <span className="font-semibold">Shipping Method: </span>
            <Tooltip content="Delivery method chosen" place="top">
              {shippingMethod}
            </Tooltip>
          </p>
          <p>
            <span className="font-semibold">Subtotal: </span>
            {formatRupiah(totalAmount)}
          </p>
          <p>
            <span className="font-semibold">Shipping Cost: </span>
            {formatRupiah(shippingCost)}
          </p>
          <p className="text-lg font-bold mt-4">
            Grand Total:{" "}
            <span className="text-green-600">{formatRupiah(grandTotal)}</span>
          </p>
        </div>

        {/* Store Info */}
        {store && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-2">Store Information</h2>
            <p>{store.name}</p>
            <p>{store.address}</p>
            <p>
              {store.city}, {store.state} {store.postalCode}
            </p>
            <p>{store.country}</p>
          </div>
        )}

        {/* Shipping Address */}
        {shippingAddress && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
            <p>{shippingAddress.addressLine}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.country}</p>
          </div>
        )}

        {/* Items */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Items</h2>
          <button
            className="text-blue-500 mb-4"
            onClick={() => setItemsExpanded(!itemsExpanded)}
          >
            {itemsExpanded ? "Hide Items" : "Show Items"}
          </button>
          {itemsExpanded && (
            <div>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b py-2 last:border-none"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
