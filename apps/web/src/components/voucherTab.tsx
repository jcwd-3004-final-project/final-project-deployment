// components/VouchersTab.tsx
import { useState } from "react";
import axios from "axios";

interface Voucher {
  id: number;
  code: string;
  discountType: string;
  value: number;
  valueType: string;
  startDate: string;
  endDate: string;
  usageType: string;
  minPurchaseAmount?: number;
  maxDiscount?: number;
  products: any[];
}

interface Props {
  vouchers: Voucher[];
  refresh: () => void;
}

const VouchersTab: React.FC<Props> = ({ vouchers, refresh }) => {
  const [form, setForm] = useState({
    code: "",
    discountType: "",
    value: 0,
    valueType: "",
    startDate: "",
    endDate: "",
    usageType: "",
    minPurchaseAmount: 0,
    maxDiscount: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/discounts/vouchers", form);
      setForm({
        code: "",
        discountType: "",
        value: 0,
        valueType: "",
        startDate: "",
        endDate: "",
        usageType: "",
        minPurchaseAmount: 0,
        maxDiscount: 0,
      });
      refresh();
    } catch (error) {
      console.error("Error creating voucher:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/discounts/vouchers/${id}`);
      refresh();
    } catch (error) {
      console.error("Error deleting voucher:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Vouchers</h2>

      {/* Create Voucher Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount Type</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Discount Type</option>
              <option value="MIN_PURCHASE_DISCOUNT">Minimum Purchase Discount</option>
              <option value="OTHER_TYPES">Other Types</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value</label>
            <input
              type="number"
              name="value"
              value={form.value}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Value Type</label>
            <select
              name="valueType"
              value={form.valueType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Value Type</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="NOMINAL">Nominal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Usage Type</label>
            <select
              name="usageType"
              value={form.usageType}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Usage Type</option>
              <option value="TOTAL_PURCHASE">Total Purchase</option>
              <option value="PRODUCT">Product</option>
              <option value="SHIPPING">Shipping</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Discount</label>
            <input
              type="number"
              name="maxDiscount"
              value={form.maxDiscount}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Min Purchase Amount</label>
            <input
              type="number"
              name="minPurchaseAmount"
              value={form.minPurchaseAmount}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              min="0"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Create Voucher
        </button>
      </form>

      {/* Vouchers List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Code</th>
              <th className="py-2 px-4 border-b">Discount Type</th>
              <th className="py-2 px-4 border-b">Value</th>
              <th className="py-2 px-4 border-b">Value Type</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
              <th className="py-2 px-4 border-b">Usage Type</th>
              <th className="py-2 px-4 border-b">Min Purchase</th>
              <th className="py-2 px-4 border-b">Max Discount</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td className="py-2 px-4 border-b">{voucher.id}</td>
                <td className="py-2 px-4 border-b">{voucher.code}</td>
                <td className="py-2 px-4 border-b">{voucher.discountType}</td>
                <td className="py-2 px-4 border-b">{voucher.value}</td>
                <td className="py-2 px-4 border-b">{voucher.valueType}</td>
                <td className="py-2 px-4 border-b">{voucher.startDate}</td>
                <td className="py-2 px-4 border-b">{voucher.endDate}</td>
                <td className="py-2 px-4 border-b">{voucher.usageType}</td>
                <td className="py-2 px-4 border-b">
                  {voucher.minPurchaseAmount ?? "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {voucher.maxDiscount ?? "-"}
                </td>
                <td className="py-2 px-4 border-b">
                  {/* Tambahkan tombol edit jika diinginkan */}
                  <button
                    onClick={() => handleDelete(voucher.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VouchersTab;
