// components/StoreModal.tsx
import React from "react";

interface StoreModalProps {
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  data: any;
  onChange: (field: string, value: string | number) => void;
}

const StoreModal: React.FC<StoreModalProps> = ({
  title,
  onClose,
  onSubmit,
  data,
  onChange,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-md">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Name</label>
            <input
              className="border w-full p-2"
              type="text"
              value={data.name || ""}
              onChange={(e) => onChange("name", e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-semibold">Address</label>
            <input
              className="border w-full p-2"
              type="text"
              value={data.address || ""}
              onChange={(e) => onChange("address", e.target.value)}
              required
            />
          </div>

          {/* City */}
          <div className="mb-3">
            <label className="block mb-1 font-semibold">City</label>
            <input
              className="border w-full p-2"
              type="text"
              value={data.city || ""}
              onChange={(e) => onChange("city", e.target.value)}
            />
          </div>

          {/* Latitude */}
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Latitude</label>
            <input
              className="border w-full p-2"
              type="number"
              step="any"
              value={data.latitude || ""}
              onChange={(e) => onChange("latitude", parseFloat(e.target.value))}
              required
            />
          </div>

          {/* Longitude */}
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Longitude</label>
            <input
              className="border w-full p-2"
              type="number"
              step="any"
              value={data.longitude || ""}
              onChange={(e) => onChange("longitude", parseFloat(e.target.value))}
              required
            />
          </div>

          {/* Tambahkan field lain jika perlu (state, postalCode, dsb) */}

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-300 py-2 px-4 rounded mr-3"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreModal;
