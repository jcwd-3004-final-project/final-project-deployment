import React, { useState } from "react";

interface SelectScrollableProps {
  onCategorySelect?: (category: string) => void;
}

export const SelectScrollable: React.FC<SelectScrollableProps> = ({ onCategorySelect }) => {
  const categories = [
    "All",
    "Fruits",
    "Bakery",
    "Beverages",
    "Dairy",
    "Snacks",
    "Grains",
    "Cooking Essentials"
  ];

  const [selected, setSelected] = useState("All");

  const handleSelect = (cat: string) => {
    setSelected(cat);
    if (onCategorySelect) {
      onCategorySelect(cat === "All" ? "" : cat); // jika "All", kirim string kosong
    }
  };

  return (
    <select
      value={selected}
      onChange={(e) => handleSelect(e.target.value)}
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
