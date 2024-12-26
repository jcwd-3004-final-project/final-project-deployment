// components/cartItem.tsx
import React from "react";
import Image from "next/image";
import { CartProductItem, useCart } from "@/context/cartContext";

interface CartItemProps {
  item: CartProductItem;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleIncrease = () => {
    if (item.quantity < item.stockQuantity) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  // Fungsi untuk memformat angka ke Rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-white p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 space-y-4 md:space-y-0">
      {/* Gambar Produk */}
      <div className="w-32 h-32 md:w-24 md:h-24 relative">
        <Image
          src={item.images[0]}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="rounded-md"
        />
      </div>

      {/* Informasi Produk */}
      <div className="flex-1 md:ml-6">
        <h3 className="text-lg font-semibold text-black truncate">
          {item.name}
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
        {/* Jumlah Stok */}
        {item.stockQuantity > 0 && (
          <p className="text-sm text-gray-600">Stok: {item.stockQuantity}</p>
        )}
      </div>

      {/* Aksi Jumlah dan Remove */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
        {/* Kontrol Jumlah */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50"
            aria-label={`Kurangi jumlah ${item.name}`}
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
            aria-label={`Tambah jumlah ${item.name}`}
            disabled={item.quantity >= item.stockQuantity}
          >
            +
          </button>
        </div>

        {/* Total Harga */}
        <p className="font-bold text-black">
          {formatRupiah(item.price * item.quantity)}
        </p>

        {/* Tombol Remove */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="w-full md:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
          aria-label={`Hapus ${item.name} dari keranjang`}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default CartItem;
