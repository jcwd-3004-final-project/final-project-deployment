import { useState } from 'react';
import LocationFetcher from '@/components/locationFether';

const stores = [
  { id: 1, name: 'Jakarta Store', latitude: -6.2088, longitude: 106.8456 },
  { id: 2, name: 'Surabaya Store', latitude: -7.2504, longitude: 112.7688 },
  { id: 3, name: 'Yogyakarta Store', latitude: -7.7956, longitude: 110.3695 },
];

// Fungsi untuk menghitung jarak berdasarkan koordinat
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius bumi dalam km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const Home = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [store, setStore] = useState<string>('Jakarta Store');
  const [products, setProducts] = useState<string[]>([]);
  const setLocationFromUser = (lat: number, lon: number) => {
    setLocation({ lat, lon });
    let closestStore = stores[0];
    let minDistance = getDistance(lat, lon, stores[0].latitude, stores[0].longitude);
    stores.forEach((store) => {
      const distance = getDistance(lat, lon, store.latitude, store.longitude);
      if (distance < minDistance) {
        closestStore = store;
        minDistance = distance;
      }
    });

    setStore(closestStore.name);
    // Simulate fetching products from the closest store
    setProducts([`${closestStore.name} - Sunlight`, `${closestStore.name} - Rinso`]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Store Location</h1>
      {location ? (
        <div>
          <h2 className="text-xl">Produk dari Toko: {store}</h2>
          <p className="text-lg">Latitude: {location.lat}, Longitude: {location.lon}</p>
          <div className="mt-4">
            <ul>
              {products.map((product, index) => (
                <li key={index} className="text-lg">{product}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          <LocationFetcher setLocation={setLocationFromUser} />
        </>
      )}
    </div>
  );
};

export default Home;
