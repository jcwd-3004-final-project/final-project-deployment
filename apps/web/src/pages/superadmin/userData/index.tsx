import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import SuperAdminSidebar from "@/components/superAdminSidebar";
import Footer from "@/components/footer";

// Interface untuk data store
interface Store {
  store_id: number;
  name: string;
  address: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  latitude: number;
  longitude: number;
  maxDeliveryDistance: number | null;
  store_admin?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Interface untuk data user beserta data store (jika ada)
interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  isVerified: boolean;
  googleId?: string | null;
  facebookId?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
  last_activity: string;
  storeId?: number | null;
  store?: Store | null;
}

// State untuk form create/update
interface UserFormState {
  first_name: string;
  last_name: string;
  email: string;
  password: string; // untuk update, bila kosong maka tidak diubah
  storeId?: number; // optional
}

function USERDATA() {
  // State untuk menyimpan seluruh data user dari API
  const [fullUsers, setFullUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // State untuk modal create dan edit
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // State untuk form (create/update)
  const [formData, setFormData] = useState<UserFormState>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    storeId: undefined,
  });

  // State pagination
  const [page, setPage] = useState<number>(1);
  const usersPerPage = 9; // menampilkan 9 user per halaman
  const totalPages = Math.ceil(fullUsers.length / usersPerPage);

  // Ambil token dari localStorage
  const token = localStorage.getItem("accessToken");

  // Fungsi konfigurasi header untuk Axios
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Jika backend memakai cookie, aktifkan withCredentials:
    // withCredentials: true,
  };

  // Fetch users dari API
  const fetchUsers = () => {
    // Cek token, jika tidak ada, jangan lanjut request
    if (!token) {
      setError("Token tidak tersedia, mohon login terlebih dahulu.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get("http://localhost:8000/v1/api/superadmin/users", axiosConfig)
      .then((response) => {
        console.log("Response:", response.data);
        setFullUsers(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Terjadi kesalahan saat mengambil data user.");
        setLoading(false);
      });
  };

  // Saat komponen dimount, ambil data user
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hitung user yang akan ditampilkan untuk halaman saat ini
  const indexLast = page * usersPerPage;
  const indexFirst = indexLast - usersPerPage;
  const currentUsers = fullUsers.slice(indexFirst, indexLast);

  // Handler untuk form input change
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "storeId" ? Number(value) : value,
    }));
  };

  // Handler untuk submit create form
  const handleCreateSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Pastikan token tersedia untuk request ini juga
    if (!token) {
      setError("Token tidak tersedia, mohon login terlebih dahulu.");
      return;
    }

    axios
      .post(
        "http://localhost:8000/v1/api/superadmin/store-admin",
        formData,
        axiosConfig
      )
      .then((response) => {
        setShowCreateModal(false);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          storeId: undefined,
        });
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error creating store admin:", err);
        setError("Terjadi kesalahan saat membuat store admin.");
      });
  };

  // Handler untuk submit update form
  const handleUpdateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    // Pastikan token tersedia untuk request ini juga
    if (!token) {
      setError("Token tidak tersedia, mohon login terlebih dahulu.");
      return;
    }

    axios
      .put(
        `http://localhost:8000/v1/api/superadmin/store-admin/${selectedUser.id}`,
        formData,
        axiosConfig
      )
      .then((response) => {
        setShowEditModal(false);
        setSelectedUser(null);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          password: "",
          storeId: undefined,
        });
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error updating store admin:", err);
        setError("Terjadi kesalahan saat mengupdate store admin.");
      });
  };

  // Handler untuk delete user
  const handleDeleteUser = (userId: number) => {
    if (!window.confirm("Apakah Anda yakin akan menghapus user ini?")) return;
    if (!token) {
      setError("Token tidak tersedia, mohon login terlebih dahulu.");
      return;
    }

    axios
      .delete(
        `http://localhost:8000/v1/api/superadmin/store-admin/${userId}`,
        axiosConfig
      )
      .then((response) => {
        setSelectedUser(null);
        fetchUsers();
      })
      .catch((err) => {
        console.error("Error deleting store admin:", err);
        setError("Terjadi kesalahan saat menghapus store admin.");
      });
  };

  // Buka modal edit dan set data form dengan data user terpilih
  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: "", // kosongkan password agar hanya diupdate bila diisi
      storeId: user.storeId ? user.storeId : undefined,
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Bagian utama (sidebar & konten) */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <SuperAdminSidebar />

        {/* Konten Utama */}
        <div className="flex-1 ml-0 md:ml-64 p-4">
          <h2 className="text-3xl font-bold text-center mb-6">User Data</h2>

          {/* Tombol Create Store Admin */}
          <div className="mb-4 text-center">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => setShowCreateModal(true)}
            >
              Create Store Admin
            </button>
          </div>

          {currentUsers.length > 0 ? (
            <>
              {/* Grid untuk card user */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {currentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow relative"
                  >
                    <div
                      className="px-4 py-4 flex flex-col"
                      onClick={() => setSelectedUser(user)}
                    >
                      <span className="text-lg font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </span>
                      <span className="text-gray-600">{user.email}</span>
                      {user.store && (
                        <div className="mt-2 p-2 border-l-4 border-blue-500 bg-blue-50 rounded">
                          <p className="font-semibold text-blue-800">
                            {user.role === "STORE_ADMIN" && "Store:"}
                          </p>
                          <p className="text-sm text-blue-700">
                            {user.store.name}
                          </p>
                        </div>
                      )}
                      <span className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full w-max">
                        {user.role}
                      </span>
                    </div>
                    {/* Jika user adalah STORE_ADMIN, tampilkan tombol edit dan delete */}
                    {user.role === "STORE_ADMIN" && (
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          className="px-2 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(user);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(user.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  onClick={() =>
                    setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                  }
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Tidak ada data user</p>
          )}

          {/* Modal Detail User */}
          {selectedUser && !showEditModal && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => setSelectedUser(null)}
              ></div>
              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setSelectedUser(null)}
                  >
                    ✕
                  </button>
                  <h3 className="text-2xl font-bold mb-4">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="mb-2">
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p className="mb-2">
                    <strong>Phone:</strong> {selectedUser.phone_number}
                  </p>
                  <p className="mb-2">
                    <strong>Role:</strong> {selectedUser.role}
                  </p>
                  <p className="mb-2">
                    <strong>Verified:</strong>{" "}
                    {selectedUser.isVerified ? "Yes" : "No"}
                  </p>
                  {selectedUser.store && (
                    <div className="mt-4 p-4 border-t">
                      <h4 className="text-xl font-semibold mb-2">
                        Store Detail
                      </h4>
                      <p>
                        <strong>Name:</strong> {selectedUser.store.name}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedUser.store.address}
                      </p>
                      <p>
                        <strong>City:</strong> {selectedUser.store.city}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Modal Create Store Admin */}
          {showCreateModal && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => setShowCreateModal(false)}
              ></div>
              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowCreateModal(false)}
                  >
                    ✕
                  </button>
                  <h3 className="text-2xl font-bold mb-4">
                    Create Store Admin
                  </h3>
                  <form onSubmit={handleCreateSubmit} className="space-y-4">
                    <div>
                      <label className="block font-medium">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium">
                        Store ID (Optional)
                      </label>
                      <input
                        type="number"
                        name="storeId"
                        value={formData.storeId || ""}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}

          {/* Modal Edit Store Admin */}
          {showEditModal && selectedUser && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => setShowEditModal(false)}
              ></div>
              {/* Modal */}
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6 relative">
                  <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowEditModal(false)}
                  >
                    ✕
                  </button>
                  <h3 className="text-2xl font-bold mb-4">
                    Update Store Admin
                  </h3>
                  <form onSubmit={handleUpdateSubmit} className="space-y-4">
                    <div>
                      <label className="block font-medium">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium">
                        Password (Isi jika ingin diupdate)
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Biarkan kosong jika tidak ingin update password"
                      />
                    </div>
                    <div>
                      <label className="block font-medium">
                        Store ID (Optional)
                      </label>
                      <input
                        type="number"
                        name="storeId"
                        value={formData.storeId || ""}
                        onChange={handleInputChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="text-center">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default USERDATA;
