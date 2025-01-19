import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SuperAdminSidebar from "@/components/superAdminSidebar";

// Interface untuk kategori dan produk
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  images: string[];
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

function Category() {
  const [categories, setCategories] = useState<Category[]>([]); // Data kategori
  const [newCategory, setNewCategory] = useState<string>(""); // Input kategori baru
  const [editCategory, setEditCategory] = useState<Category | null>(null); // Kategori yang sedang diedit
  const [editName, setEditName] = useState<string>(""); // Nama kategori saat diedit
  const [token, setToken] = useState<string | null>(null); // Token disimpan di state

  // Ambil token dari localStorage ketika komponen sudah berada di sisi klien
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      setToken(storedToken);
    }
  }, []);

  // Konfigurasi header untuk Axios (hanya jika token sudah ada)
  const axiosConfig = token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

  // Fetch data kategori saat komponen dimuat atau token sudah tersedia
  useEffect(() => {
    if (token) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchCategories = async () => {
    if (!token) {
      Swal.fire(
        "Error",
        "Token tidak tersedia. Silahkan login kembali!",
        "error"
      );
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:8000/v1/api/categories",
        axiosConfig
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire("Error", "Gagal mengambil data kategori!", "error");
    }
  };

  const handleAddCategory = async () => {
    if (!token) {
      Swal.fire(
        "Error",
        "Token tidak tersedia. Silahkan login kembali!",
        "error"
      );
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/api/categories",
        { name: newCategory },
        axiosConfig
      );
      setCategories([...categories, response.data]);
      setNewCategory(""); // Reset input
      Swal.fire("Success", "Category added successfully!", "success");
    } catch (error) {
      console.error("Error adding category:", error);
      Swal.fire("Error", "Failed to add category!", "error");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!token) {
      Swal.fire(
        "Error",
        "Token tidak tersedia. Silahkan login kembali!",
        "error"
      );
      return;
    }
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirm.isConfirmed) {
        await axios.delete(
          `http://localhost:8000/v1/api/categories/${id}`,
          axiosConfig
        );
        setCategories(categories.filter((category) => category.id !== id));
        Swal.fire("Deleted!", "Your category has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      Swal.fire("Error", "Failed to delete category!", "error");
    }
  };

  const handleEditCategory = async () => {
    if (!token) {
      Swal.fire(
        "Error",
        "Token tidak tersedia. Silahkan login kembali!",
        "error"
      );
      return;
    }
    if (!editCategory) return;

    try {
      const response = await axios.put(
        `http://localhost:8000/v1/api/categories/${editCategory.id}`,
        { name: editName },
        axiosConfig
      );
      setCategories(
        categories.map((category) =>
          category.id === editCategory.id ? response.data : category
        )
      );
      setEditCategory(null);
      setEditName("");
      Swal.fire("Success", "Category updated successfully!", "success");
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire("Error", "Failed to update category!", "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SuperAdminSidebar />
      <div className="p-4 bg-gray-100 flex-1">
        <h1 className="text-2xl font-bold mb-4">Category Management</h1>

        {/* Form untuk menambahkan kategori baru */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          <button
            onClick={handleAddCategory}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {/* Daftar kategori */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-xl font-semibold mb-2 sm:mb-0">
                  {category.name}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditCategory(category);
                      setEditName(category.name);
                    }}
                    className="p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {category.products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2 border">ID</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Description</th>
                        <th className="p-2 border">Price</th>
                        <th className="p-2 border">Stock Quantity</th>
                        <th className="p-2 border">Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.products.map((product) => (
                        <tr key={product.id}>
                          <td className="p-2 border">{product.id}</td>
                          <td className="p-2 border">{product.name}</td>
                          <td className="p-2 border">{product.description}</td>
                          <td className="p-2 border">{product.price}</td>
                          <td className="p-2 border">
                            {product.stockQuantity}
                          </td>
                          <td className="p-2 border">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-md"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No products available.</p>
              )}
            </div>
          ))}
        </div>

        {/* Form untuk mengedit kategori */}
        {editCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md w-11/12 sm:w-1/2 md:w-1/3">
              <h2 className="text-xl font-bold mb-4">Edit Category</h2>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditCategory}
                  className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditCategory(null)}
                  className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
