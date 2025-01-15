import React, { useState, useEffect } from "react";
import axios from "axios";
import StoreModal from "../../components/storeModal";
import AddStoreProductModal from "../../components/addStoreProductModal"; // Import komponen baru
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import SuperAdminSidebar from "@/components/superAdminSidebar";

interface Admin {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  isVerified: boolean;
  googleId: string | null;
  facebookId: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  last_activity: string;
  storeId: number;
}

interface Store {
  store_id: number;
  name: string;
  address: string;
  city?: string;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  maxDeliveryDistance?: number | null;
  store_admin?: string | number | null;
  storeAdmins: Admin[];
  storeProducts: any[]; // Sesuaikan dengan struktur produk jika perlu
  createdAt: string;
  updatedAt: string;
}

export default function SuperAdminHome() {
  const router = useRouter();

  const [stores, setStores] = useState<Store[]>([]);
  const [allAdmins, setAllAdmins] = useState<Admin[]>([]); // State untuk semua admin
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStore, setCurrentStore] = useState<Partial<Store>>({});

  const BASE_URL = "http://localhost:8000/v1/api/superadmin";

  const [assignData, setAssignData] = useState({
    storeName: "",
    adminUserId: "",
  });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // State untuk modal AddStoreProduct
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // 1. Ambil token dari localStorage (handle kasus jika tidak ada)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Misalnya, simpan role user di localStorage saat login
  const userRole =
    typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  console.log("LocalStorage userRole:", userRole);

  // Helper: Returns an axios config object with the auth header
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Lakukan pengecekan role user, jika bukan SUPER_ADMIN redirect ke halaman utama
  useEffect(() => {
    if (!userRole || userRole !== "SUPER_ADMIN") {
      router.push("/");
    }
  }, [userRole, router]);

  // Fungsi untuk mengambil data admin berdasarkan ID
  const getAdminById = async (adminId: number): Promise<Admin | null> => {
    try {
      const res = await axios.get(`${BASE_URL}/admins/${adminId}`, axiosConfig);
      return res.data.data;
    } catch (error) {
      console.error(`Error fetching admin with ID ${adminId}:`, error);
      return null;
    }
  };

  // Fungsi untuk fetch stores
  const fetchStores = async () => {
    try {
      if (!token) {
        alert("No token found. Please log in first.");
        router.push("/auth/login");
        return;
      }
      const res = await axios.get(`${BASE_URL}/stores`, axiosConfig);
      setStores(res.data.data);
      console.log("Fetched Stores:", res.data.data); // Untuk verifikasi data

      // Ekstrak semua admin dari storeAdmins
      const fetchedAdmins: Admin[] = res.data.data.flatMap(
        (store: Store) => store.storeAdmins
      );

      // Buat map unik untuk menghindari duplikasi admin
      const uniqueAdminsMap: { [key: number]: Admin } = {};
      fetchedAdmins.forEach((admin) => {
        uniqueAdminsMap[admin.id] = admin;
      });

      const uniqueAdmins = Object.values(uniqueAdminsMap);
      setAllAdmins(uniqueAdmins);
      console.log("Unique Admins:", uniqueAdmins); // Untuk verifikasi admin
    } catch (error) {
      console.error("Error fetching stores:", error);
      if ((error as any)?.response?.status === 401) {
        alert("Unauthorized. Redirecting to login...");
        router.push("/auth/login");
      }
    }
  };

  useEffect(() => {
    // Panggil fetchStores hanya jika sudah terverifikasi sebagai SUPER_ADMIN
    if (userRole === "SUPER_ADMIN") {
      fetchStores();
    }
  }, [userRole]);

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setCurrentStore({
      name: "",
      address: "",
      city: "",
      state: "", // Tambahkan field state
      latitude: 0,
      longitude: 0,
      maxDeliveryDistance: 10,
    });
  };

  const handleOpenEditModal = (store: Store) => {
    setIsEditMode(true);
    setIsModalOpen(true);
    setCurrentStore({
      ...store,
      state: store.state || "", // Tambahkan field state jika belum ada
      maxDeliveryDistance: store.maxDeliveryDistance ?? 10, // Set nilai default jika null
    });
  };

  // 3. Submit modal (Create/Edit) dengan token
  const handleSubmitStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        alert("No token found. Please log in first.");
        router.push("/auth/login");
        return;
      }
      const payload = {
        name: currentStore.name,
        address: currentStore.address,
        city: currentStore.city || "", // Pastikan field city ada
        state: currentStore.state || "", // Tambahkan field state
        latitude: currentStore.latitude,
        longitude: currentStore.longitude,
        maxDeliveryDistance: currentStore.maxDeliveryDistance,
      };

      if (isEditMode && currentStore.store_id) {
        // Update store
        await axios.put(
          `${BASE_URL}/store/${currentStore.store_id}`,
          payload,
          axiosConfig
        );
      } else {
        // Create store
        await axios.post(`${BASE_URL}/store`, payload, axiosConfig);
      }

      setIsModalOpen(false);
      fetchStores();
    } catch (error) {
      console.error("Error submitting store:", error);
    }
  };

  // 4. Delete store dengan token
  const handleDeleteStore = async (storeId: number) => {
    try {
      if (!token) {
        alert("No token found. Please log in first.");
        router.push("/auth/login");
        return;
      }
      await axios.delete(`${BASE_URL}/store/${storeId}`, axiosConfig);
      fetchStores();
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  // 5. Assign admin dengan token
  const handleAssignAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!token) {
        toast.error("No token found. Please log in first.");
        router.push("/auth/login");
        return;
      }

      // Cari store berdasarkan nama
      const selectedStore = stores.find((s) => s.name === assignData.storeName);
      if (!selectedStore) {
        toast.error("Store not found. Please check the store name again.");
        return;
      }

      // Memanggil endpoint put, gunakan store_id yang ditemukan
      await axios.put(
        `${BASE_URL}/store/${selectedStore.store_id}/admin`,
        {
          userId: Number(assignData.adminUserId),
        },
        axiosConfig
      );
      localStorage.setItem("assignedStoreId", String(selectedStore.store_id));

      setIsAssignModalOpen(false);
      fetchStores();
      toast.success("Admin berhasil diassign ke toko.");
    } catch (error) {
      console.error("Error assigning admin:", error);
      toast.error("Failed to assign admin. Please try again.");
    }
  };

  // Fungsi untuk membuka modal AddStoreProduct
  const handleOpenAddProductModal = (storeId: number) => {
    setSelectedStoreId(storeId);
    setIsAddProductModalOpen(true);
  };

  // Fungsi untuk menutup modal AddStoreProduct
  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
    setSelectedStoreId(null);
  };

  // Fungsi callback setelah produk berhasil ditambahkan
  const handleProductAdded = () => {
    toast.success("Product successfully added to the store.");
    // Optionally, fetchStores() again to refresh store data if needed
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SuperAdminSidebar />

      {/* Konten Utama */}
      <div className="flex-1 ml-0 md:ml-64 p-4">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
          Store Management 🏤
        </h1>

        {/* Tombol Aksi */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button
            onClick={handleOpenCreateModal}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded shadow"
          >
            + Create New Store
          </button>

          <button
            onClick={() => {
              setAssignData({ storeName: "", adminUserId: "" });
              setIsAssignModalOpen(true);
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded shadow"
          >
            Assign Admin
          </button>

          <button
            onClick={() => {
              if (stores.length === 0) {
                toast.error("No stores available.");
                return;
              }
              const firstStore = stores[0];
              handleOpenAddProductModal(firstStore.store_id);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
          >
            Add Product to First Store
          </button>
        </div>

        {/* Tabel Daftar Store */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Store Name</th>
                  <th className="py-3 px-6 text-left">Address</th>
                  <th className="py-3 px-6 text-left">Admins</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm font-medium">
                {stores.map((store) => {
                  const adminNames =
                    store.storeAdmins.length > 0
                      ? store.storeAdmins
                          .map(
                            (admin) => `${admin.first_name} ${admin.last_name}`
                          )
                          .join(", ")
                      : "Unassigned";

                  return (
                    <tr
                      key={store.store_id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td
                        className="py-3 px-6 text-blue-600 underline cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/superadmin/CRUD?storeId=${store.store_id}`
                          )
                        }
                      >
                        {store.name}
                      </td>
                      <td className="py-3 px-6">{store.address}</td>
                      <td className="py-3 px-6">{adminNames}</td>
                      <td className="py-3 px-6">
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                          <button
                            onClick={() => handleOpenEditModal(store)}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteStore(store.store_id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              handleOpenAddProductModal(store.store_id)
                            }
                            className="text-green-500 hover:underline"
                          >
                            Add Product
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Components */}
        {isModalOpen && (
          <StoreModal
            title={isEditMode ? "Edit Store" : "Create New Store"}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmitStore}
            data={currentStore}
            onChange={(field, value) =>
              setCurrentStore((prev) => ({ ...prev, [field]: value }))
            }
          />
        )}

        {isAssignModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
            <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-bold mb-4">Assign Admin</h2>
              <form onSubmit={handleAssignAdmin}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Select Store
                  </label>
                  <select
                    className="border w-full px-3 py-2 mt-2 rounded-md"
                    value={assignData.storeName}
                    onChange={(e) =>
                      setAssignData({
                        ...assignData,
                        storeName: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">-- Choose Store --</option>
                    {stores.map((store) => (
                      <option key={store.store_id} value={store.name}>
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Admin User ID
                  </label>
                  <input
                    type="text"
                    className="border w-full px-3 py-2 mt-2 rounded-md"
                    value={assignData.adminUserId}
                    onChange={(e) =>
                      setAssignData({
                        ...assignData,
                        adminUserId: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="bg-gray-400 text-white py-2 px-4 rounded"
                    onClick={() => setIsAssignModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-yellow-500 text-white py-2 px-4 rounded"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddProductModalOpen && selectedStoreId && (
          <AddStoreProductModal
            isOpen={isAddProductModalOpen}
            onClose={handleCloseAddProductModal}
            storeId={selectedStoreId}
            onProductAdded={handleProductAdded}
          />
        )}
      </div>
    </div>
  );
}
