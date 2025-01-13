import React from "react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";

const promotions = [
  {
    id: 1,
    title: "Fresh Fruits & Vegetables",
    description: "Get 20% off on all fresh produce this week!",
    image: "/images/promotions/fruits.jpg",
  },
  {
    id: 2,
    title: "Dairy Products",
    description: "Buy 1 Get 1 Free on selected dairy items.",
    image: "/images/promotions/dairy.jpg",
  },
  {
    id: 3,
    title: "Snacks & Beverages",
    description: "Up to 30% off on snacks and beverages!",
    image: "/images/promotions/snacks.jpg",
  },
  {
    id: 4,
    title: "Bakery Items",
    description: "Freshly baked goodies at discounted prices.",
    image: "/images/promotions/bakery.jpg",
  },
];

const PromotionsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
        <Navbar/>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Exclusive Promotions</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Save big on your favorite groceries. Check out our special offers and enjoy amazing deals on fresh produce, snacks, and more.
        </p>
      </div>

      {/* Promotions Grid */}
      <div className="py-12 px-6 md:px-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Current Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all hover:scale-105"
            >
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{promo.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{promo.description}</p>
              </div>
              <div className="p-4 border-t">
                <button className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default PromotionsPage;