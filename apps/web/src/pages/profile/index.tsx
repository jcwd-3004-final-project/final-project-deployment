import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Navbar from "@/components/navbar/navbar";

interface Address {
  address_id: number; // Ganti dari 'id' ke 'address_id'
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  avatar?: string;
  addresses?: Address[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, "address_id">>({
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    latitude: 0,
    longitude: 0,
    isDefault: false,
  });
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [editAddress, setEditAddress] = useState<Omit<Address, "address_id">>({
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    latitude: 0,
    longitude: 0,
    isDefault: false,
  });

  // Fetch user profile and addresses on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Not logged in
      router.push("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/v1/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }
        const result = await response.json();
        setProfile(result.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal mengambil profil pengguna.", "error");
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/v1/api/user/addresses",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch addresses");
        }
        const result = await response.json();
        console.log("Fetched Addresses:", result.data); // Debug
        setAddresses(result.data);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Gagal mengambil alamat pengguna.", "error");
      }
    };

    fetchProfile();
    fetchAddresses();
  }, [router]);

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Kamu akan keluar dari akun.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, keluar",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        Swal.fire("Keluar!", "Kamu telah berhasil keluar.", "success").then(
          () => {
            router.push("/");
          }
        );
      }
    });
  };

  const goToEditPage = () => router.push("/profile/edit");

  // Handle input change for adding address
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    let updatedValue: string | number | boolean = value;

    if (name === "latitude" || name === "longitude") {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        updatedValue = 0; // Atau Anda bisa menampilkan pesan error
      } else {
        updatedValue = parsedValue;
      }
    } else if (type === "checkbox") {
      updatedValue = checked;
    }

    setNewAddress((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Handle submit for adding address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire(
        "Error",
        "Token tidak ditemukan. Silakan login kembali.",
        "error"
      );
      router.push("/auth/login");
      return;
    }

    console.log("New Address:", newAddress); // Debug

    try {
      const response = await fetch(
        "http://localhost:8000/v1/api/user/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAddress),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData); // Debug
        throw new Error(errorData.message || "Gagal menambahkan alamat");
      }

      const result = await response.json();

      // Jika alamat yang ditambahkan adalah default, perbarui alamat default sebelumnya
      if (result.data.isDefault) {
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.isDefault ? { ...addr, isDefault: false } : addr
          )
        );
      }

      // Tambahkan alamat baru ke state
      setAddresses((prev) => [...prev, result.data]);

      // Reset form
      setNewAddress({
        addressLine: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        latitude: 0,
        longitude: 0,
        isDefault: false,
      });
      setShowAddAddressForm(false);

      Swal.fire("Sukses", "Alamat berhasil ditambahkan.", "success");
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Error",
        error.message || "Terjadi kesalahan saat menambahkan alamat.",
        "error"
      );
    }
  };

  // Start editing an address
  const startEditingAddress = (address: Address) => {
    setEditingAddressId(address.address_id); // Ganti dari 'id' ke 'address_id'
    setEditAddress({
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      latitude: address.latitude,
      longitude: address.longitude,
      isDefault: address.isDefault,
    });
  };

  // Cancel editing
  const cancelEditingAddress = () => {
    setEditingAddressId(null);
    setEditAddress({
      addressLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      latitude: 0,
      longitude: 0,
      isDefault: false,
    });
  };

  // Handle input change for editing address
  const handleEditAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    let updatedValue: string | number | boolean = value;

    if (name === "latitude" || name === "longitude") {
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        updatedValue = 0; // Atau Anda bisa menampilkan pesan error
      } else {
        updatedValue = parsedValue;
      }
    } else if (type === "checkbox") {
      updatedValue = checked;
    }

    setEditAddress((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
  };

  // Handle submit for editing address
  const handleEditAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId === null) return;

    console.log("Editing Address ID:", editingAddressId); // Debug

    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire(
        "Error",
        "Token tidak ditemukan. Silakan login kembali.",
        "error"
      );
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/v1/api/user/addresses/${editingAddressId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editAddress),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData); // Debug
        throw new Error(errorData.message || "Gagal memperbarui alamat");
      }

      const result = await response.json();

      // Jika alamat yang diedit adalah default, perbarui alamat default lainnya
      if (result.data.isDefault) {
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.address_id === result.data.address_id
              ? result.data
              : { ...addr, isDefault: false }
          )
        );
      } else {
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.address_id === result.data.address_id ? result.data : addr
          )
        );
      }

      // Reset form edit
      cancelEditingAddress();

      Swal.fire("Sukses", "Alamat berhasil diperbarui.", "success");
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Error",
        error.message || "Terjadi kesalahan saat memperbarui alamat.",
        "error"
      );
    }
  };

  // Handle delete address
  const handleDeleteAddress = (addressId: number) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Alamat ini akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAddress(addressId);
      }
    });
  };

  // Fungsi untuk mengirim request DELETE
  const deleteAddress = async (addressId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire(
        "Error",
        "Token tidak ditemukan. Silakan login kembali.",
        "error"
      );
      router.push("/auth/login");
      return;
    }

    try {
      // Cek apakah alamat yang dihapus adalah default
      const addressToDelete = addresses.find(
        (addr) => addr.address_id === addressId
      );
      const isDefault = addressToDelete?.isDefault;

      const response = await fetch(
        `http://localhost:8000/v1/api/user/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error(errorData.message || "Gagal menghapus alamat");
      }

      // Jika alamat default dihapus, tetapkan alamat default baru
      if (isDefault) {
        const remainingAddresses = addresses.filter(
          (addr) => addr.address_id !== addressId
        );
        if (remainingAddresses.length > 0) {
          const newDefaultAddress = remainingAddresses[0]; // Atur alamat pertama sebagai default
          await fetch(
            `http://localhost:8000/v1/api/user/addresses/${newDefaultAddress.address_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ ...newDefaultAddress, isDefault: true }),
            }
          );

          // Update state untuk mengganti alamat default
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.address_id === newDefaultAddress.address_id
                ? { ...addr, isDefault: true }
                : addr
            )
          );
        }
      }

      // Perbarui state dengan menghapus alamat yang telah dihapus
      setAddresses((prev) =>
        prev.filter((addr) => addr.address_id !== addressId)
      );

      Swal.fire("Sukses", "Alamat berhasil dihapus.", "success");
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Error",
        error.message || "Terjadi kesalahan saat menghapus alamat.",
        "error"
      );
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-3xl p-8 md:p-12 lg:p-16 relative">
          {/* Profile Header */}
          <div className="text-center">
            <img
              src={profile.avatar || "/images/default-profile.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-600">{profile.email}</p>
            {profile.isVerified ? (
              <span className="mt-2 inline-block px-3 py-1 text-sm text-green-600 bg-green-100 rounded-full">
                Verified Account
              </span>
            ) : (
              <span className="mt-2 inline-block px-3 py-1 text-sm text-red-600 bg-red-100 rounded-full">
                Unverified Account
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={goToEditPage}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-full shadow-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none transition transform hover:scale-105"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 focus:outline-none transition transform hover:scale-105"
            >
              Logout
            </button>
          </div>

          {/* Daftar Alamat */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Alamat Saya
            </h2>
            {addresses.length === 0 ? (
              <p>Tidak ada alamat yang ditambahkan.</p>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                  <li
                    key={address.address_id}
                    className="bg-gray-50 p-4 rounded-lg shadow"
                  >
                    {editingAddressId === address.address_id ? (
                      /* Form Edit Alamat */
                      <form onSubmit={handleEditAddressSubmit}>
                        <div className="mb-4">
                          <label className="block text-gray-700">Alamat</label>
                          <input
                            type="text"
                            name="addressLine"
                            value={editAddress.addressLine}
                            onChange={handleEditAddressChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Contoh: Jl. Contoh No. 123"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">Kota</label>
                          <input
                            type="text"
                            name="city"
                            value={editAddress.city}
                            onChange={handleEditAddressChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Contoh: Jakarta"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Provinsi
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={editAddress.state}
                            onChange={handleEditAddressChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Contoh: DKI Jakarta"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Kode Pos
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={editAddress.postalCode}
                            onChange={handleEditAddressChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Contoh: 12345"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">Negara</label>
                          <input
                            type="text"
                            name="country"
                            value={editAddress.country}
                            onChange={handleEditAddressChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Contoh: Indonesia"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Latitude
                          </label>
                          <input
                            type="number"
                            name="latitude"
                            value={editAddress.latitude}
                            onChange={handleEditAddressChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Contoh: -7.250445"
                            step="any"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Longitude
                          </label>
                          <input
                            type="number"
                            name="longitude"
                            value={editAddress.longitude}
                            onChange={handleEditAddressChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                            placeholder="Contoh: 112.768845"
                            step="any"
                          />
                        </div>
                        <div className="mb-4 flex items-center">
                          <input
                            type="checkbox"
                            name="isDefault"
                            checked={editAddress.isDefault}
                            onChange={handleEditAddressChange}
                            className="mr-2"
                          />
                          <label className="block text-gray-700">
                            Set sebagai Alamat Default
                          </label>
                        </div>
                        <div className="flex gap-4">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingAddress}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Tampilan Alamat Biasa */
                      <>
                        <p className="font-semibold">{address.addressLine}</p>
                        <p>
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p>{address.country}</p>
                        <p className="text-sm text-gray-500">
                          Latitude: {address.latitude}, Longitude:{" "}
                          {address.longitude}
                        </p>
                        {address.isDefault && (
                          <span className="mt-2 inline-block px-3 py-1 text-xs text-white bg-green-600 rounded-full">
                            Alamat Default
                          </span>
                        )}
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => startEditingAddress(address)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteAddress(address.address_id)
                            }
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Tombol untuk Menambahkan Alamat */}
          <div className="mt-6">
            <button
              onClick={() => setShowAddAddressForm(!showAddAddressForm)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              {showAddAddressForm ? "Batal" : "Tambah Alamat"}
            </button>
          </div>

          {/* Formulir Penambahan Alamat */}
          {showAddAddressForm && (
            <div className="mt-4 bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Tambah Alamat Baru</h3>
              <form onSubmit={handleAddAddress}>
                <div className="mb-4">
                  <label className="block text-gray-700">Alamat</label>
                  <input
                    type="text"
                    name="addressLine"
                    value={newAddress.addressLine}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Contoh: Jl. Contoh No. 123"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Kota</label>
                  <input
                    type="text"
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Contoh: Jakarta"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Provinsi</label>
                  <input
                    type="text"
                    name="state"
                    value={newAddress.state}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Contoh: DKI Jakarta"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Kode Pos</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={newAddress.postalCode}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Contoh: 12345"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Negara</label>
                  <input
                    type="text"
                    name="country"
                    value={newAddress.country}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Contoh: Indonesia"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Latitude</label>
                  <input
                    type="number"
                    name="latitude"
                    value={newAddress.latitude}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Contoh: -7.250445"
                    step="any"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Longitude</label>
                  <input
                    type="number"
                    name="longitude"
                    value={newAddress.longitude}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Contoh: 112.768845"
                    step="any"
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={newAddress.isDefault}
                    onChange={handleAddressChange}
                    className="mr-2"
                  />
                  <label className="block text-gray-700">
                    Set sebagai Alamat Default
                  </label>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Simpan
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
