// // components/LocationInput.tsx
// import React, { useState } from 'react';

// const LocationInput = ({ setLocation }: { setLocation: (lat: number, lon: number) => void }) => {
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocation(parseFloat(latitude), parseFloat(longitude));
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium">Latitude</label>
//         <input
//           type="number"
//           value={latitude}
//           onChange={(e) => setLatitude(e.target.value)}
//           className="mt-1 p-2 border rounded w-full"
//           required
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium">Longitude</label>
//         <input
//           type="number"
//           value={longitude}
//           onChange={(e) => setLongitude(e.target.value)}
//           className="mt-1 p-2 border rounded w-full"
//           required
//         />
//       </div>
//       <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
//         Submit Location
//       </button>
//     </form>
//   );
// };

// export default LocationInput;
