// components/DiscountList.tsx
import React from 'react';
import api from '../utils/api';

interface Discount {
  id: number;
  type: string;
  value: number;
  valueType: string;
  startDate: string;
  endDate: string;
  maxDiscount?: number;
  minPurchase?: number;
  products: { id: number; name: string }[];
}

interface DiscountListProps {
  discounts: Discount[];
  onEdit: (discount: Discount) => void;
  onDelete: (id: number) => void;
}

const DiscountList: React.FC<DiscountListProps> = ({ discounts, onEdit, onDelete }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Daftar Diskon</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Jenis</th>
              <th className="py-2 px-4 border">Nilai</th>
              <th className="py-2 px-4 border">Tipe Nilai</th>
              <th className="py-2 px-4 border">Periode</th>
              <th className="py-2 px-4 border">Produk Terkait</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td className="py-2 px-4 border text-center">{discount.id}</td>
                <td className="py-2 px-4 border">{discount.type}</td>
                <td className="py-2 px-4 border">{discount.value}</td>
                <td className="py-2 px-4 border">{discount.valueType}</td>
                <td className="py-2 px-4 border">
                  {new Date(discount.startDate).toLocaleDateString()} -{' '}
                  {new Date(discount.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  {discount.products.map((p) => p.name).join(', ')}
                </td>
                <td className="py-2 px-4 border text-center">
                  <button
                    onClick={() => onEdit(discount)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(discount.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={7} className="py-2 px-4 border text-center">
                  Tidak ada diskon.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiscountList;
