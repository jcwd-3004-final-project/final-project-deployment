import React from "react";

interface PurchaseCardProps {
  shopName?: string;
  productName: string;
  productImg?: string;
  variation?: string;
  quantity: number;
  totalPrice?: number; // harga asli sebelum diskon
  voucherDiscount?: number; // diskon dari voucher, jika ada
  referralDiscount?: number; // diskon dari referral, jika ada
  status: string;
  onConfirm?: () => void;
  onRefund?: () => void;
  onContactSeller?: () => void;
  onDetail?: () => void; // handler untuk tombol Detail
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({
  shopName,
  productName,
  productImg,
  variation,
  quantity,
  totalPrice,
  voucherDiscount = 0,
  referralDiscount = 0,
  status,
  onConfirm,
  onRefund,
  onContactSeller,
  onDetail,
}) => {
  // Hitung total diskon dan harga efektif setelah diskon
  const totalDiscount = voucherDiscount + referralDiscount;
  const rawTotal = totalPrice ?? 0;
  const effectiveTotal = rawTotal - totalDiscount < 0 ? 0 : rawTotal - totalDiscount;

  return (
    <div className="border rounded-md p-4 shadow-sm mb-4">
      {/* Header Toko */}
      <div className="flex flex-wrap items-center justify-between mb-2">
        <div className="font-semibold text-gray-700">
          {shopName || "Shop Name"}
        </div>
        <div className="text-sm text-orange-500 font-semibold">{status}</div>
      </div>

      {/* Informasi Produk */}
      <div className="flex flex-col sm:flex-row">
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
            {totalDiscount > 0 ? (
              <div>
                <span className="line-through text-sm text-gray-500">
                  Rp {rawTotal.toLocaleString()}
                </span>{" "}
                <span>Rp {effectiveTotal.toLocaleString()}</span>
              </div>
            ) : (
              <span>Rp {rawTotal.toLocaleString()}</span>
            )}
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {onDetail && (
          <button
            onClick={onDetail}
            className="px-4 py-2 rounded-md bg-blue-500 text-white text-sm"
          >
            Detail
          </button>
        )}

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
