import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/context/cartContext";

const shippingMethods = ["REGULAR", "EXPRESS", "OVERNIGHT"] as const;
const paymentMethods = ["TRANSFER", "PAYMENT_GATEWAY"] as const;

interface Address {
  address_id: number;
  addressLine?: string;
  city?: string;
  state?: string;
}

interface Store {
  store_id: number;
  name: string;
  address: string;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  maxDeliveryDistance?: number | null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    totalPrice,
    voucherDiscount,
    referralDiscount,
    totalAfterDiscount,
  } = useCart();

  // State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string>("REGULAR");
  const [selectedPayment, setSelectedPayment] = useState<string>("TRANSFER");
  const [stores, setStores] = useState<Store[]>([]);
  const [storeId, setStoreId] = useState<number>(0);

  // Tambahkan state untuk shippingCost
  const [shippingCost, setShippingCost] = useState<number>(0);

  // Tambahkan state untuk loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Format Rupiah
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Ambil Data Alamat dari Backend
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) {
        console.error("No access token found; please login.");
        return;
      }
      try {
        const response = await fetch(
          "https://d29jci2p0msjlf.cloudfront.net/v1/api/user/addresses",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.success) {
          setAddresses(result.data || []);
          if (result.data && result.data[0]?.address_id) {
            setSelectedAddress(result.data[0].address_id);
          }
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, [token]);

  // Ambil Data Store dari Backend
  useEffect(() => {
    const fetchStores = async () => {
      if (!token) {
        console.error("No access token found; please login.");
        return;
      }
      try {
        const response = await fetch(
          "https://d29jci2p0msjlf.cloudfront.net/v1/api/superadmin/stores",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status === 200 && result.data) {
          setStores(result.data);
          if (result.data.length > 0) {
            setStoreId(result.data[0].store_id);
          }
        } else {
          console.error("Gagal mengambil data store:", result.error);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, [token]);

  // Update shippingCost setiap kali metode pengiriman berubah
  useEffect(() => {
    let cost = 0;
    switch (selectedShipping) {
      case "REGULAR":
        cost = 10000;
        break;
      case "EXPRESS":
        cost = 20000;
        break;
      case "OVERNIGHT":
        cost = 30000;
        break;
      default:
        cost = 0;
    }
    setShippingCost(cost);
  }, [selectedShipping]);

  // Fungsi Checkout
  const handleCheckout = async () => {
    if (!token) {
      alert("No access token found. Please log in first.");
      return;
    }
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Set isLoading menjadi true ketika proses dimulai
    setIsLoading(true);

    const itemsPayload = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    }));

    const orderBody = {
      storeId,
      shippingAddressId: selectedAddress,
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      items: itemsPayload,
      voucherDiscount,
      referralDiscount,
      total: totalAfterDiscount,
      shippingCost,
    };

    try {


      const res = await fetch("https://d29jci2p0msjlf.cloudfront.net/v1/api/user/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderBody),
      });



      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create order");
      }
      const newOrder = data.data;
      const orderId = newOrder.id;

      if (selectedPayment === "TRANSFER") {
        // Jika pembayaran manual, redirect ke halaman konfirmasi transfer
        router.push(`/payment?orderId=${orderId}`);
      } else {
        // Jika pakai payment gateway, jalankan request payment lalu redirect
        const paymentRes = await fetch(
          "https://d29jci2p0msjlf.cloudfront.net/v1/api/payment/create",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ orderId }),
          }
        );
        const paymentData = await paymentRes.json();
        if (!paymentData.success) {
          throw new Error(paymentData.error || "Failed to create payment");
        }
        const redirectUrl = paymentData.data.redirectUrl;
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Could not complete your order. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Hitung total keseluruhan termasuk shipping
  const grandTotal = totalAfterDiscount + shippingCost;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Pilih Toko */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Pilih Toko</h2>
          {stores.length > 0 ? (
            <select
              className="border border-gray-300 p-2 rounded w-full sm:w-1/2"
              value={storeId}
              onChange={(e) => setStoreId(Number(e.target.value))}
            >
              {stores.map((store) => (
                <option key={store.store_id} value={store.store_id}>
                  {store.name} ({store.address})
                </option>
              ))}
            </select>
          ) : (
            <p>Loading stores...</p>
          )}
        </section>

        {/* Pilih Alamat */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
          {addresses.length > 0 ? (
            <select
              className="border border-gray-300 p-2 rounded w-full sm:w-1/2"
              value={selectedAddress ?? ""}
              onChange={(e) => setSelectedAddress(Number(e.target.value))}
            >
              {addresses.map((addr) => (
                <option key={addr.address_id} value={addr.address_id}>
                  {addr.addressLine}, {addr.city}, {addr.state}
                </option>
              ))}
            </select>
          ) : (
            <p>No addresses found. Please add an address.</p>
          )}
        </section>

        {/* Metode Pengiriman */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Shipping Method</h2>
          <select
            className="border border-gray-300 p-2 rounded"
            value={selectedShipping}
            onChange={(e) => setSelectedShipping(e.target.value)}
          >
            {shippingMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </section>

        {/* Metode Pembayaran */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
          <select
            className="border border-gray-300 p-2 rounded"
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </section>

        {/* Ringkasan Pesanan */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="bg-white p-4 rounded shadow">
            {cart.map((item) => (
              <div key={item.id} className="border-b border-gray-200 py-2">
                <p className="font-medium">
                  {item.name} x {item.quantity}
                </p>
              </div>
            ))}
            <p className="mt-4 font-bold">
              Voucher Discount: {formatRupiah(voucherDiscount)}
            </p>
            <p className="mt-2 font-bold">
              Referral Discount: {formatRupiah(referralDiscount)}
            </p>

            {/* Tampilkan shipping cost dan grand total */}
            <p className="mt-2 font-bold">
              Shipping Cost: {formatRupiah(shippingCost)}
            </p>
            <p className="mt-2 font-bold">
              Grand Total: {formatRupiah(grandTotal)}
            </p>
          </div>
        </section>

        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className={`${
            isLoading ? "bg-green-600" : "bg-green-600 hover:bg-green-700"
          } text-white py-2 px-4 rounded flex items-center justify-center`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l2-2-2-2V0C5.477 0 0 5.477 0 12h4z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </main>
      <Footer />
    </div>
  );
}
