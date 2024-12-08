import React from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/heroSection";
import ProductList from "@/components/productList";
import Footer from "@/components/footer";
import { Product } from "@/components/productList";

const Home = () => {
  const sampleProducts: Product[] = [
    {
      id: 1,
      image:
        "https://i.pinimg.com/474x/e5/39/58/e53958d21713c307eff64b56d3b9f9cc.jpg",
      name: "Fresh Organic Apples",
      price: 4.99,
      stock: 25,
    },
    {
      id: 2,
      image: "/images/product2.jpg",
      name: "Whole Grain Bread",
      price: 3.49,
      stock: 15,
    },
    {
      id: 3,
      image: "/images/product3.jpg",
      name: "Almond Milk - Unsweetened",
      price: 2.99,
      stock: 0,
    },
    {
      id: 4,
      image: "/images/product4.jpg",
      name: "Free-Range Eggs (12 Count)",
      price: 5.99,
      stock: 30,
    },
    {
      id: 5,
      image: "/images/product5.jpg",
      name: "Premium Dark Chocolate",
      price: 6.49,
      stock: 8,
    },
    {
      id: 6,
      image: "/images/product6.jpg",
      name: "Organic Avocado (2 Count)",
      price: 3.99,
      stock: 20,
    },
    {
      id: 7,
      image: "/images/product7.jpg",
      name: "Quinoa (500g)",
      price: 7.99,
      stock: 10,
    },
    {
      id: 8,
      image: "/images/product8.jpg",
      name: "Cold Pressed Olive Oil",
      price: 12.99,
      stock: 5,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Product List */}
        <section className="my-12">
          <ProductList products={sampleProducts} />
        </section>
      </main>

      {/* Footer */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
