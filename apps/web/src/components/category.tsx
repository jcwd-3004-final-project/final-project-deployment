// components/SelectScrollable.tsx
import React, { useState, useEffect } from "react";

interface CategoryData {
  id: number;
  name: string;
  // products: Product[];
  // Tergantung kebutuhan, kalau cuma butuh name, tidak perlu definisikan panjang-panjang
}

interface SelectScrollableProps {
  onCategorySelect?: (categoryName: string) => void;
}

export const SelectScrollable: React.FC<SelectScrollableProps> = ({
  onCategorySelect,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://d29jci2p0msjlf.cloudfront.net/v1/api/categories"
        );
        const data: CategoryData[] = await res.json();
        // data bisa jadi: [{ id: 1, name: 'Fruits', products: [...]}, ...]
        const categoryNames = data.map((cat) => cat.name);
        setCategories(["All", ...categoryNames]);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (cat: string) => {
    setSelected(cat);
    // Jika cat === 'All', kita kirim string kosong agar menampilkan semua
    onCategorySelect?.(cat === "All" ? "" : cat);
  };

  return (
    <select
      value={selected}
      onChange={(e) => handleChange(e.target.value)}
      className="bg-green-600 text-white px-4 py-2 rounded-md"
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};
