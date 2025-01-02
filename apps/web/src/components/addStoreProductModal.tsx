// components/AddStoreProductModal.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";

interface AddStoreProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: number;
  onProductAdded: () => void; // Callback setelah produk berhasil ditambahkan
}

interface Product {
  id: number;
  name: string;
}

const AddStoreProductModal: React.FC<AddStoreProductModalProps> = ({
  isOpen,
  onClose,
  storeId,
  onProductAdded,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [stock, setStock] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const BASE_URL = "http://localhost:8000/v1/api";

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/products`);
      setProducts(res.data.data); // Sesuaikan dengan struktur response backend
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Gagal mengambil daftar produk");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductId === "" || stock <= 0) {
      alert("Silakan pilih produk dan isi stok dengan benar");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/superadmin/${storeId}/products`,
        {
          productId: selectedProductId,
          stock,
        }
      );

      alert("Produk berhasil ditambahkan ke toko");
      onProductAdded(); // Refresh daftar produk di halaman CRUD
      onClose();
    } catch (error: any) {
      console.error("Error adding product to store:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Gagal menambahkan produk ke toko");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Product to Store"
      className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 md:mx-auto mt-10 p-6 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <h2 className="text-2xl font-semibold mb-4">Add Product to Store</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Select Product</label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">-- Choose Product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
              min="1"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default AddStoreProductModal;
