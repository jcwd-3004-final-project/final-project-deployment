// components/cartItem.tsx
import React from "react";
import Image from "next/image";
import { CartProductItem, useCart } from "@/context/cartContext";

interface CartItemProps {
  item: CartProductItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  // Increase quantity if not exceeding stock
  const handleIncrease = () => {
    if (item.quantity < item.stockQuantity) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  // Decrease quantity if greater than 1
  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  // Format number to Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Safely access the first image OR fallback
  const firstImage = item.images?.[0] || "/placeholder.jpg";
  const itemName = item.name || "Untitled Product";
  const totalPrice = item.price * item.quantity;

  return (
    <div className="flex flex-col md:flex-row items-center bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4 md:space-y-0">
      {/* Product Image */}
      <div className="w-32 h-32 md:w-24 md:h-24 relative">
        <Image
          src={firstImage}
          alt={itemName}
          fill
          style={{ objectFit: "cover" }}
          className="rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 md:ml-6">
        <h3 className="text-lg font-semibold text-black truncate">
          {itemName}
        </h3>
        <p className="text-sm text-gray-600">
          Harga: {formatRupiah(item.price)}
        </p>
        <p
          className={`text-sm ${
            item.stockQuantity > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {item.stockQuantity > 0 ? "Tersedia" : "Stok Habis"}
        </p>
        {/* If still in stock, show how many */}
        {item.stockQuantity > 0 && (
          <p className="text-sm text-gray-600">Stok: {item.stockQuantity}</p>
        )}
      </div>

      {/* Quantity Controls & Remove */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
            aria-label={`Kurangi jumlah ${itemName}`}
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md">
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
            aria-label={`Tambah jumlah ${itemName}`}
            disabled={item.quantity >= item.stockQuantity}
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <p className="font-bold text-black">{formatRupiah(totalPrice)}</p>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
          aria-label={`Hapus ${itemName} dari keranjang`}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default CartItem;
