"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export function PlaceholdersAndVanishInputDemo() {
  const placeholders = [
    "What's your favorite fruit?",
    "Which vegetables are you looking for?",
    "Looking for fresh dairy products?",
    "Need recommendations for household items?",
    "Which spices do you need to restock?",
  ];

  // Fungsi menerima string, sesuai dengan tipe yang diharapkan
  const handleChange = (value: string) => {
    console.log("Current input value:", value);
    // Anda dapat menambahkan logika tambahan di sini
  };

  // Fungsi menerima string, sesuai dengan tipe yang diharapkan
  const onSubmit = (value: string) => {
    console.log("Submitted value:", value);
    // Tambahkan logika pengiriman data atau tindakan lainnya di sini
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onValueChange={handleChange} // Ganti dari onChange ke onValueChange
        onSubmit={onSubmit}
      />
    </div>
  );
}
