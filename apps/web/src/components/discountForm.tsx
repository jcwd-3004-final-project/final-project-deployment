// components/DiscountForm.tsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface DiscountFormProps {
  onSuccess: () => void;
  initialData?: DiscountFormData;
  isEditing?: boolean;
}

export interface DiscountFormData {
    id?: number;
  type: string;
  value: number;
  valueType: string;
  startDate: string;
  endDate: string;
  maxDiscount?: number;
  minPurchase?: number;
  productIds: number[];
}

const DiscountForm: React.FC<DiscountFormProps> = ({ onSuccess, initialData, isEditing = false }) => {
  const [form, setForm] = useState<DiscountFormData>({
    type: initialData?.type || '',
    value: initialData?.value || 0,
    valueType: initialData?.valueType || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    maxDiscount: initialData?.maxDiscount || 0,
    minPurchase: initialData?.minPurchase || 0,
    productIds: initialData?.productIds || [],
  });

  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('https://6763b8e117ec5852cae9b756.mockapi.io/v1/product');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Gagal mengambil daftar produk.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'value' || name === 'maxDiscount' || name === 'minPurchase' ? Number(value) : value,
    }));
  };

  const handleProductSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => Number(option.value));
    setForm((prev) => ({
      ...prev,
      productIds: selectedOptions,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing && initialData) {
        await api.put(`/discount/${initialData.id}`, form);
      } else {
        await api.post('/discount', form);
      }
      onSuccess();
      setForm({
        type: '',
        value: 0,
        valueType: '',
        startDate: '',
        endDate: '',
        maxDiscount: 0,
        minPurchase: 0,
        productIds: [],
      });
    } catch (err) {
      console.error('Error saving discount:', err);
      setError('Gagal menyimpan diskon.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Perbarui Diskon' : 'Buat Diskon'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Jenis Diskon</label>
          <select
            name="type"
            value={form.type}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Pilih Jenis</option>
            <option value="PRODUCT_DISCOUNT">Diskon Produk</option>
            <option value="BUY_ONE_GET_ONE">Beli Satu Gratis Satu</option>
            <option value="MIN_PURCHASE_DISCOUNT">Diskon Minimal Pembelian</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Nilai Diskon</label>
          <input
            type="number"
            name="value"
            value={form.value}
            onChange={handleInputChange}
            required
            min="0"
            className="w-full border px-3 py-2 rounded"
            placeholder="0"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Tipe Nilai Diskon</label>
          <select
            name="valueType"
            value={form.valueType}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Pilih Tipe</option>
            <option value="PERCENTAGE">Persentase (%)</option>
            <option value="NOMINAL">Nominal (Rp)</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Tanggal Mulai</label>
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Tanggal Berakhir</label>
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleInputChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {form.type === 'MIN_PURCHASE_DISCOUNT' && (
          <div className="mb-4">
            <label className="block mb-2">Minimal Pembelian (Rp)</label>
            <input
              type="number"
              name="minPurchase"
              value={form.minPurchase}
              onChange={handleInputChange}
              min="0"
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        )}

        {form.type === 'PRODUCT_DISCOUNT' && (
          <div className="mb-4">
            <label className="block mb-2">Produk Terkait</label>
            <select
              multiple
              name="productIds"
              value={form.productIds.map(String)}
              onChange={handleProductSelection}
              required
              className="w-full border px-3 py-2 rounded h-32"
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2">Maksimal Diskon (Rp)</label>
          <input
            type="number"
            name="maxDiscount"
            value={form.maxDiscount}
            onChange={handleInputChange}
            min="0"
            className="w-full border px-3 py-2 rounded"
            placeholder="0"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditing ? 'Perbarui Diskon' : 'Buat Diskon'}
        </button>
      </form>
    </div>
  );
};

export default DiscountForm;
