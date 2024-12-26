import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/heroSection";
import ProductList from "@/components/productList";
import Footer from "@/components/footer";
import { Product } from "@/components/productList";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    // Fetch data dari API
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/v1/api/product`
        );
        console.log(response.data);
        const fetchedProducts: Product[] = response.data.data.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price), // Jika price string, konversi ke number
            stockQuantity: parseInt(item.stockQuantity, 10), // Jika stock string, konversi ke number
            category: item.category,
            images: item.images,
          })
        );
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);
  console.log("Ini product >>>", products);

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory
      ? product.category.toString() === selectedCategory
      : true;
    const matchName = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchCategory && matchName;
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchSubmit = () => {
    // Setelah produk difilter, scroll ke product section
    const productSection = document.querySelector("#product-section");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header>
        <Navbar
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection />

        {/* Product List */}
        <section id="product-section" className="my-12">
          <ProductList products={filteredProducts} />
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
