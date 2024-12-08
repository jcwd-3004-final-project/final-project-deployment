import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Store {
  id: number;
  store_name: string;
  address: string;
  latitude: string;
  longitude: string;
}

const Dashboard = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newStore, setNewStore] = useState({
    store_name: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const router = useRouter();

  const fetchStores = async () => {
    const response = await fetch('/api/superadmin/store');
    const data = await response.json();
    setStores(data);
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/superadmin/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStore)
    });

    const data = await response.json();
    setStores([...stores, data]); // TypeScript now understands the type of stores
    setCreateModalOpen(false); // Close the modal
  };

  const handleDeleteStore = async (storeId: number) => {
    const response = await fetch(`/api/stores/${storeId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      setStores(stores.filter((store) => store.id !== storeId));
    } else {
      alert('Failed to delete store');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Super Admin Dashboard</h1>

      <button 
        onClick={fetchStores} 
        className="mb-4 py-2 px-4 bg-blue-600 text-white rounded-lg">
        Fetch Stores
      </button>

      <div className="mb-6">
        <button 
          onClick={() => setCreateModalOpen(true)} 
          className="py-2 px-4 bg-green-600 text-white rounded-lg">
          Create New Store
        </button>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Create New Store</h2>
            <form onSubmit={handleCreateStore}>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="store_name">
                  Store Name
                </label>
                <input
                  type="text"
                  id="store_name"
                  name="store_name"
                  value={newStore.store_name}
                  onChange={(e) => setNewStore({ ...newStore, store_name: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="address">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="latitude">
                  Latitude
                </label>
                <input
                  type="text"
                  id="latitude"
                  name="latitude"
                  value={newStore.latitude}
                  onChange={(e) => setNewStore({ ...newStore, latitude: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="longitude">
                  Longitude
                </label>
                <input
                  type="text"
                  id="longitude"
                  name="longitude"
                  value={newStore.longitude}
                  onChange={(e) => setNewStore({ ...newStore, longitude: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setCreateModalOpen(false)} 
                  className="mr-4 py-2 px-4 bg-gray-400 text-white rounded-lg">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="py-2 px-4 bg-green-600 text-white rounded-lg">
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Store Management</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">Store Name</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store: Store) => (
              <tr key={store.id}>
                <td className="py-2 px-4">{store.store_name}</td>
                <td className="py-2 px-4">{store.address}</td>
                <td className="py-2 px-4">
                  <Link href={`/dashboard/edit/${store.id}`}>
                    <a className="text-blue-600">Edit</a>
                  </Link>
                  {' | '}
                  <button 
                    onClick={() => handleDeleteStore(store.id)}
                    className="text-red-600">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assign Store Admin</h2>
        <form action="#" method="POST">
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="storeId">
              Store
            </label>
            <select id="storeId" name="storeId" className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              {stores.map((store: Store) => (
                <option key={store.id} value={store.id}>
                  {store.store_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="userId">
              User ID (Store Admin)
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button 
            type="submit" 
            className="py-2 px-4 bg-green-600 text-white rounded-lg">
            Assign Store Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
