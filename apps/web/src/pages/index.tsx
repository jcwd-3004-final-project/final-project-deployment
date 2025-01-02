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
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/v1/api/products"
        );
        console.log("Response from API:", response.data);

        // Asumsikan response.data.data = array of items,
        // item.category = { id: number, name: string }
        const fetchedProducts: Product[] = response.data.data.map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            stockQuantity: parseInt(item.stockQuantity, 10),
            category: item.category, // { id: number, name: string }
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

  // Filter
  const filteredProducts = products.filter((product) => {
    // Filter by category
    const matchCategory = selectedCategory
      ? product.category?.name === selectedCategory
      : true;

    // Filter by name
    const matchName = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchCategory && matchName;
  });

  // Handler
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    // "category" di sini misalnya "Fruits" atau ""
    console.log("handleCategoryChange:", category);
    setSelectedCategory(category);
  };

  const handleSearchSubmit = () => {
    const productSection = document.querySelector("#product-section");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </header>
      <main className="flex-grow">
        <HeroSection />
        <section id="product-section" className="my-12">
          <ProductList products={filteredProducts} />
        </section>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
