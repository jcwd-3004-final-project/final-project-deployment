import React, { useEffect, useState } from "react";
import { useCart } from "@/context/cartContext";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/router";

const shippingMethods = ["REGULAR", "EXPRESS", "OVERNIGHT"] as const;
const paymentMethods = ["TRANSFER", "PAYMENT_GATEWAY"] as const;

interface Address {
  address_id: number;
  addressLine?: string;
  city?: string;
  state?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<string>("REGULAR");
  const [selectedPayment, setSelectedPayment] = useState<string>("TRANSFER");
  const [storeId] = useState<number>(1); // Example store ID

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Adjust to your actual server & token usage
        const response = await fetch("http://localhost:8000/v1/api/user/addresses", {
          credentials: "include", // or pass bearer token
        });
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
  }, []);

  // Format currency
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Build items array
    const itemsPayload = cart.map((item) => ({
      productId: item.id, // or item.productId if needed
      quantity: item.quantity,
    }));

    const orderBody = {
      storeId,
      shippingAddressId: selectedAddress,
      shippingMethod: selectedShipping,
      paymentMethod: selectedPayment,
      items: itemsPayload,
    };

    try {
      // 1) Create the order first
      const res = await fetch("http://localhost:8000/v1/api/user/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // or pass Bearer token
        body: JSON.stringify(orderBody),});
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to create order");
      }

      const newOrder = data.data; 
      const orderId = newOrder.id;
      

      // 2) If Payment Method = TRANSFER => go to "/payment" to upload proof
      if (selectedPayment === "TRANSFER") {
        router.push(`/payment?orderId=${orderId}`);
      } 
      // 3) If Payment Method = PAYMENT_GATEWAY => call payment create, then redirect
      else {
        console.log("payment_gateaway")
        const paymentRes = await fetch("http://localhost:8000/v1/api/payment/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // or token
          body: JSON.stringify({ orderId }),
        });
        
        const paymentData = await paymentRes.json();


        if (!paymentData.success) {
          throw new Error(paymentData.error || "Failed to create payment");
        }
        // e.g. "redirectUrl" from the response
        const redirectUrl = paymentData.data.redirectUrl;
        window.location.href = redirectUrl; // redirect to Midtrans (or whichever gateway)
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Could not complete your order. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Addresses */}
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

        {/* Shipping Method */}
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

        {/* Payment Method */}
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

        {/* Order Summary */}
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
            <p className="mt-4 font-bold">Total: {formatRupiah(totalPrice)}</p>
          </div>
        </section>

        {/* Place Order Button */}
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </main>
      <Footer />
    </div>
  );
}