// ProductList.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "./productForm";
import Modal from "react-modal";
import { formatRupiah } from "@/utils/formatRupiah";
import Link from "next/link";

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
  images: string[]; // Array URL gambar
  category?: Category;
}

interface ProductListProps {
  storeId?: string | string[];
}

Modal.setAppElement("#__next");

const ProductList: React.FC<ProductListProps> = ({ storeId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  const BASE_URL = "http://localhost:8000/v1/api";
  const PRODUCT_URL = `${BASE_URL}/products`; // Pastikan endpoint benar

  useEffect(() => {
    console.log("useEffect triggered with storeId:", storeId); // Debugging
    fetchProducts();
  }, [storeId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      if (storeId) {
        const id = Array.isArray(storeId) ? storeId[0] : storeId;
        console.log(`Fetching products for store ID: ${id}`);
        const res = await axios.get(`${BASE_URL}/stores/${id}/products`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Store Response:", res);
        const storeData = res.data;
        console.log("Store Data:", storeData); // Debugging
        const storeProducts = storeData?.storeProducts || [];
        const extractedProducts = storeProducts.map((sp: any) => ({
          ...sp.product,
          images: Array.isArray(sp.product.images)
            ? sp.product.images.map((img: any) =>
                typeof img.url === "string" ? img.url.trim() : ""
              )
            : [],
        }));

        console.log("Extracted Products with storeId:", extractedProducts); // Debugging

        setProducts(extractedProducts);
      } else {
        console.log("Fetching all products from:", PRODUCT_URL);
        const res = await axios.get(PRODUCT_URL, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Fetched Products without storeId:", res.data.data); // Debugging

        const normalizedProducts: Product[] = res.data.data.map(
          (product: any) => {
            console.log(`Processing product ID: ${product.id}`, product.images); // Tambahkan log ini
            return {
              ...product,
              images: Array.isArray(product.images)
                ? product.images.map((img: any) =>
                    typeof img.url === "string" ? img.url.trim() : ""
                  )
                : [],
            };
          }
        );

        console.log("Normalized Products:", normalizedProducts); // Debugging
        setProducts(normalizedProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error); // Menambahkan error
      alert("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      console.log(`Attempting to delete product with ID: ${id}`); // Debugging
      try {
        await axios.delete(`${PRODUCT_URL}/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(`Deleted product with ID: ${id}`); // Debugging
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
      console.log("Opening modal to edit product:", product); // Debugging
    } else {
      setCurrentProduct({});
      console.log("Opening modal to add new product"); // Debugging
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct({});
    console.log("Modal closed"); // Debugging
  };

  const handleFormSubmit = async (values: Partial<Product>) => {
    console.log("Form submitted with values:", values); // Debugging

    if (currentProduct.id) {
      // Update
      try {
        const response = await axios.put(
          `${PRODUCT_URL}/${currentProduct.id}`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Updated Product:", response.data.data); // Debugging

        // Pastikan images adalah array string
        const updatedProduct: Product = {
          ...response.data.data,
          images: Array.isArray(response.data.data.images)
            ? response.data.data.images.map((img: any) =>
                typeof img.url === "string" ? img.url : ""
              )
            : [],
        };

        setProducts(
          products.map((prod) =>
            prod.id === currentProduct.id ? updatedProduct : prod
          )
        );
        alert("Produk berhasil diperbarui");
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Gagal memperbarui produk");
      }
    } else {
      // Create
      try {
        const response = await axios.post(PRODUCT_URL, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("Created Product:", response.data.data); // Debugging

        const createdProduct: Product = {
          ...response.data.data,
          images: Array.isArray(response.data.data.images)
            ? response.data.data.images.map((img: any) =>
                typeof img.url === "string" ? img.url : ""
              )
            : [],
        };

        setProducts([...products, createdProduct]);
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
        <h2 className="text-3xl font-semibold text-black">
          Daftar Produk {storeId ? `(Store #${storeId})` : ""}
        </h2>
        {storeId ? (
          // Tombol "Kembali" jika storeId ada
          <Link href="/superadmin/CRUD">
            <p className="mt-4 md:mt-0 bg-gray-600 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-700 transition duration-300 flex items-center">
              {/* Icon Kembali */}
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Kembali
            </p>
          </Link>
        ) : (
          // Tombol "Tambah Produk" jika storeId tidak ada
          <button
            onClick={() => openModal()}
            className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition duration-300 flex items-center"
          >
            {/* Icon Tambah Produk */}
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
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {products.length === 0 ? (
          <p className="text-gray-600 text-center">
            No products available for this store.
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
                    {product.images && product.images.length > 0 ? (
                      product.images.map((imgUrl: string, index: number) => (
                        <img
                          key={`${product.id}-image-${index}`}
                          src={imgUrl} // Menggunakan URL gambar langsung
                          alt={product.name}
                          className="w-16 h-16 object-cover mr-2 mb-2 rounded-md shadow"
                        />
                      ))
                    ) : (
                      <span>No Images Available</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => openModal(product)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition duration-300 mr-2 flex items-center"
                      >
                        {/* Icon Edit */}
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414
                            a2 2 0 113.828 3.828L11 20l-4 1 1-4 9.414-9.414z"
                          />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300 flex items-center"
                      >
                        {/* Icon Hapus */}
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862
                            a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4
                            a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

      {/* Modal Form Produk */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Form Produk"
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 md:mx-auto
        mt-10 md:mt-20 p-6 relative transition-transform transform scale-100"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex
        justify-center items-start z-50"
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
