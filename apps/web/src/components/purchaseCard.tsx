import React from "react";

interface PurchaseCardProps {
  shopName?: string;
  productName: string;
  productImg?: string;
  variation?: string;
  quantity: number;
  totalPrice?: number; // Bisa diubah jadi optional jika dari backend kadang tidak ada
  status: string;
  onConfirm?: () => void;
  onRefund?: () => void;
  onContactSeller?: () => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({
  shopName,
  productName,
  productImg,
  variation,
  quantity,
  totalPrice,
  status,
  onConfirm,
  onRefund,
  onContactSeller,
}) => {
  return (
    <div className="border rounded-md p-4 shadow-sm mb-4">
      {/* Shop header */}
      <div className="flex flex-wrap items-center justify-between mb-2">
        <div className="font-semibold text-gray-700">
          {shopName || "Shop Name"}
        </div>
        <div className="text-sm text-orange-500 font-semibold">{status}</div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col sm:flex-row">
        {/* Gambar produk: Pada layar kecil, tampil full width; pada layar sm ke atas tampil dengan ukuran tetap */}
        <img
          src={productImg || "/placeholder.png"}
          alt={productName}
          className="w-full sm:w-20 h-20 object-cover rounded-md mb-4 sm:mb-0 sm:mr-4"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-gray-800">{productName}</h3>
            {variation && (
              <div className="text-sm text-gray-500">Variasi: {variation}</div>
            )}
            <div className="text-sm text-gray-500">x{quantity}</div>
          </div>
          <div className="text-lg font-bold text-gray-800">
            Rp {(totalPrice ?? 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Actions (Confirm, Refund, Contact, etc.) */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-orange-500 text-white text-sm"
          >
            Pesanan Selesai
          </button>
        )}
        {onRefund && (
          <button
            onClick={onRefund}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm"
          >
            Ajukan Pengembalian
          </button>
        )}
        {onContactSeller && (
          <button
            onClick={onContactSeller}
            className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm"
          >
            Hubungi Penjual
          </button>
        )}
      </div>
    </div>
  );
};

export default PurchaseCard;
