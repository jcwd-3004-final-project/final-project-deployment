// components/ProductList.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "./productForm";
import Modal from "react-modal";
import { formatRupiah } from "@/utils/formatRupiah"; // Pastikan path sesuai dengan struktur proyek Anda

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  images: string[];
  category?: Category;
}

Modal.setAppElement("#__next"); // Penting untuk aksesibilitas dengan Next.js

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  const API_BASE_URL = "http://localhost:8000/v1/api/product"; // Ganti dengan URL backend Anda

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          "Content-Type": "application/json",
          // Tambahkan header autentikasi jika diperlukan
          // Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            // Tambahkan header autentikasi jika diperlukan
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts(products.filter((product) => product.id !== id));
        alert("Produk berhasil dihapus");
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Gagal menghapus produk");
      }
    }
  };

  const openModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct({});
  };

  const handleFormSubmit = async (values: Partial<Product>) => {
    if (currentProduct.id) {
      // Update produk
      try {
        const response = await axios.put(
          `${API_BASE_URL}/${currentProduct.id}`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
              // Tambahkan header autentikasi jika diperlukan
              // Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setProducts(
          products.map((prod) =>
            prod.id === currentProduct.id ? response.data.data : prod
          )
        );
        alert("Produk berhasil diperbarui");
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Gagal memperbarui produk");
      }
    } else {
      // Buat produk baru
      try {
        const response = await axios.post(API_BASE_URL, values, {
          headers: {
            "Content-Type": "application/json",
            // Tambahkan header autentikasi jika diperlukan
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProducts([...products, response.data.data]);
        alert("Produk berhasil ditambahkan");
      } catch (error) {
        console.error("Error creating product:", error);
        alert("Gagal menambahkan produk");
      }
    }
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-black h-16 w-16"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-black">Daftar Produk</h2>
        <button
          onClick={() => openModal()}
          className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Produk
        </button>
      </div>

      {/* Search Bar (Optional) */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari produk..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <p className="text-gray-600 text-center">
            Tidak ada produk tersedia.
          </p>
        ) : (
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Nama</th>
                <th className="py-3 px-6 text-left">Deskripsi</th>
                <th className="py-3 px-6 text-left">Harga</th>
                <th className="py-3 px-6 text-left">Kategori</th>
                <th className="py-3 px-6 text-left">Stok</th>
                <th className="py-3 px-6 text-left">Gambar</th>
                <th className="py-3 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="py-3 px-6 text-left">
                    <div className="w-48 truncate" title={product.description}>
                      {product.description}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    {formatRupiah(product.price)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {product.category?.name || "N/A"}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {product.stockQuantity}
                  </td>
                  <td className="py-3 px-6 text-left flex flex-wrap">
                    {product.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={product.name}
                        className="w-16 h-16 object-cover mr-2 mb-2 rounded-md shadow"
                      />
                    ))}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => openModal(product)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition duration-300 mr-2 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 113.828 3.828L11 20l-4 1 1-4 9.414-9.414z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal untuk Form Produk */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Form Produk"
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 md:mx-auto mt-10 md:mt-20 p-6 relative transition-transform transform scale-100"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50"
      >
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-300"
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
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {currentProduct.id ? "Edit Produk" : "Tambah Produk"}
        </h2>
        <ProductForm
          initialValues={currentProduct}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ProductList;
