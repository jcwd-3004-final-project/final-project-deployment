// components/DiscountsTab.tsx
import { useState } from "react";
import axios from "axios";

interface Discount {
  id: number;
  type: string;
  value: number;
  valueType: string;
  startDate: string;
  endDate: string;
  maxDiscount: number;
  minPurchaseAmount: number;
  usageType: string;
  products: any[];
}

interface Props {
  discounts: Discount[];
  refresh: () => void;
}

const DiscountsTab: React.FC<Props> = ({ discounts, refresh }) => {
  const [form, setForm] = useState({
    type: "",
    value: 0,
    valueType: "",
    startDate: "",
    endDate: "",
    maxDiscount: 0,
    minPurchaseAmount: 0,
    usageType: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/discounts", form);
      setForm({
        type: "",
        value: 0,
        valueType: "",
        startDate: "",
        endDate: "",
        maxDiscount: 0,
        minPurchaseAmount: 0,
        usageType: "",
      });
      refresh();
    } catch (error) {
      console.error("Error creating discount:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/discounts/${id}`);
      refresh();
    } catch (error) {
      console.error("Error deleting discount:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Discounts</h2>

      {/* Create Discount Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Type</option>
              <option value="PRODUCT_DISCOUNT">Product Discount</option>
              <option value="BUY_ONE_GET_ONE">Buy One Get One</option>
              <option value="MIN_PURCHASE_DISCOUNT">Minimum Purchase Discount</option>
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
              required
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
              required
              min="0"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Discount
        </button>
      </form>

      {/* Discounts List */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Value</th>
              <th className="py-2 px-4 border-b">Value Type</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
              <th className="py-2 px-4 border-b">Max Discount</th>
              <th className="py-2 px-4 border-b">Min Purchase</th>
              <th className="py-2 px-4 border-b">Usage Type</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.id}>
                <td className="py-2 px-4 border-b">{discount.id}</td>
                <td className="py-2 px-4 border-b">{discount.type}</td>
                <td className="py-2 px-4 border-b">{discount.value}</td>
                <td className="py-2 px-4 border-b">{discount.valueType}</td>
                <td className="py-2 px-4 border-b">{discount.startDate}</td>
                <td className="py-2 px-4 border-b">{discount.endDate}</td>
                <td className="py-2 px-4 border-b">{discount.maxDiscount}</td>
                <td className="py-2 px-4 border-b">{discount.minPurchaseAmount}</td>
                <td className="py-2 px-4 border-b">{discount.usageType}</td>
                <td className="py-2 px-4 border-b">
                  {/* Tambahkan tombol edit jika diinginkan */}
                  <button
                    onClick={() => handleDelete(discount.id)}
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

export default DiscountsTab;
