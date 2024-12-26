// pages/admin/discounts.tsx
import React, { useState, useEffect } from 'react';
import DiscountForm, { DiscountFormData } from '../../components/discountForm';
import DiscountList from '../../components/discountList';
import api from '../../utils/api';

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

const DiscountsPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscounts = async () => {
    try {
      const response = await api.get<Discount[]>('/discount');
      setDiscounts(response.data);
    } catch (err) {
      console.error('Error fetching discounts:', err);
      setError('Gagal mengambil daftar diskon.');
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleEdit = (discount: Discount) => {
    setCurrentDiscount(discount);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus diskon ini?')) return;

    try {
      await api.delete(`/discount/${id}`);
      fetchDiscounts();
    } catch (err) {
      console.error('Error deleting discount:', err);
      setError('Gagal menghapus diskon.');
    }
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    setCurrentDiscount(null);
    fetchDiscounts();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manajemen Diskon</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <DiscountForm
          onSuccess={handleFormSuccess}
          initialData={
            isEditing && currentDiscount
              ? {
                  id: currentDiscount.id,
                  type: currentDiscount.type,
                  value: currentDiscount.value,
                  valueType: currentDiscount.valueType,
                  startDate: currentDiscount.startDate.slice(0, 10),
                  endDate: currentDiscount.endDate.slice(0, 10),
                  maxDiscount: currentDiscount.maxDiscount || 0,
                  minPurchase: currentDiscount.minPurchase || 0,
                  productIds: currentDiscount.products.map((p) => p.id),
                }
              : undefined
          }
          isEditing={isEditing}
        />
        <DiscountList discounts={discounts} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default DiscountsPage;
