import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/components/modal";

interface Store {
  id: number;
  store_name: string;
  address: string;
  latitude: string;
  longitude: string;
  store_admin?: string;
}

const Dashboard = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    store_name: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [currentEditStore, setCurrentEditStore] = useState<Store | null>(null);
  const [assignData, setAssignData] = useState({
    store_id: "",
    admin_user_id: "",
  });

  // Fetch stores
  const fetchStores = async () => {
    try {
      const response = await axios.get(
        "https://66f6579a436827ced976b39d.mockapi.io/kelontong/v1/store"
      );
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
      alert("Failed to fetch stores. Please try again later.");
    }
  };

  // Fetch stores on component mount
  useEffect(() => {
    fetchStores();
  }, []);

  // Handle store creation
  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://66f6579a436827ced976b39d.mockapi.io/kelontong/v1/store",
        newStore,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setStores([...stores, response.data]);
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating store:", error);
      alert("Failed to create store. Please try again.");
    }
  };

  // Handle store deletion
  const handleDeleteStore = async (storeId: number) => {
    try {
      const response = await axios.delete(
        `https://66f6579a436827ced976b39d.mockapi.io/kelontong/v1/store/${storeId}`
      );
      if (response.status === 200) {
        setStores(stores.filter((store) => store.id !== storeId));
      } else {
        alert("Failed to delete store.");
      }
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("Failed to delete store. Please try again.");
    }
  };

  // Open edit modal with the selected store
  const handleEditClick = (store: Store) => {
    setCurrentEditStore(store);
    setEditModalOpen(true);
  };

  // Handle store editing
  const handleEditStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditStore) return;

    try {
      const response = await axios.put(
        `https://66f6579a436827ced976b39d.mockapi.io/kelontong/v1/store/${currentEditStore.id}`,
        currentEditStore,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setStores(
        stores.map((store) =>
          store.id === currentEditStore.id ? response.data : store
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error editing store:", error);
      alert("Failed to edit store. Please try again.");
    }
  };

  // Handle store admin assignment
  const handleAssignStoreAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://66f6579a436827ced976b39d.mockapi.io/kelontong/v1/store/${assignData.store_id}`,
        { store_admin: assignData.admin_user_id },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setStores(
        stores.map((store) =>
          store.id === Number(assignData.store_id) ? response.data : store
        )
      );
      setAssignModalOpen(false);
    } catch (error) {
      console.error("Error assigning store admin:", error);
      alert("Failed to assign store admin. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Super Admin Dashboard
      </h1>

      <div className="mb-6">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="py-2 px-4 bg-green-600 text-white rounded-lg"
        >
          Create New Store
        </button>
        <button
          onClick={() => setAssignModalOpen(true)}
          className="ml-4 py-2 px-4 bg-yellow-600 text-white rounded-lg"
        >
          Assign Store Admin
        </button>
      </div>

      {/* Create Store Modal */}
      {isCreateModalOpen && (
        <Modal
          title="Create New Store"
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateStore}
          data={newStore}
          onDataChange={setNewStore}
        />
      )}

      {/* Edit Store Modal */}
      {isEditModalOpen && currentEditStore && (
        <Modal
          title="Edit Store"
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleEditStore}
          data={currentEditStore}
          onDataChange={setCurrentEditStore}
        />
      )}

      {/* Assign Store Admin Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Assign Store Admin
            </h2>
            <form onSubmit={handleAssignStoreAdmin}>
              <div className="mb-4">
                <label className="block text-gray-700">Store</label>
                <select
                  value={assignData.store_id}
                  onChange={(e) =>
                    setAssignData({ ...assignData, store_id: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.store_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Admin User ID</label>
                <input
                  type="text"
                  value={assignData.admin_user_id}
                  onChange={(e) =>
                    setAssignData({
                      ...assignData,
                      admin_user_id: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="mr-4 py-2 px-4 bg-gray-400 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-yellow-600 text-white rounded-lg"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Store List */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Store Management
        </h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Store Name</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Admin</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store: Store) => (
              <tr key={store.id}>
                <td className="py-2 px-4">{store.store_name}</td>
                <td className="py-2 px-4">{store.address}</td>
                <td className="py-2 px-4">
                  {store.store_admin || "Unassigned"}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEditClick(store)}
                    className="text-blue-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    className="text-red-600"
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

export default Dashboard;
