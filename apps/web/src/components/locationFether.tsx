import { useEffect, useState } from 'react';

const LocationFetcher = ({ setLocation }: { setLocation: (lat: number, lon: number) => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude, position.coords.longitude);
          setLoading(false);
        },
        (err) => {
          // Jika akses lokasi ditolak, set error tetapi fallback ke Jakarta Store
          setError('Unable to retrieve your location');
          setLocation(-6.2088, 106.8456); // Set default ke Jakarta Store
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLocation(-6.2088, 106.8456); // Set default ke Jakarta Store
    }
  }, [setLocation]);

  return (
    <div className="space-y-4">
      {loading && <p>Loading your location...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LocationFetcher;
