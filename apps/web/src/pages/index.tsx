import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/navbar";
import HeroSection from "@/components/heroSection";
import ProductList from "@/components/productList";
import Footer from "@/components/footer";
import { Product } from "@/components/productList";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);

  // ------------------------------
  // 1) Fetch Products
  // ------------------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/v1/api/products`);
        const fetchedProducts: Product[] = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          stockQuantity: parseInt(item.stockQuantity, 10),
          category: item.category,
          images: item.images,
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // ------------------------------
  // 2) Get User Location & Store in Local Storage
  // ------------------------------
  useEffect(() => {
    const storeLocationLocally = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Convert to strings and store in localStorage
          const latString = latitude.toString();
          const lngString = longitude.toString();
          localStorage.setItem("userLatitude", latString);
          localStorage.setItem("userLongitude", lngString);

          // Update local state for display
          setLatitude(latString);
          setLongitude(lngString);

          console.log("Location stored in localStorage:", { latitude, longitude });
        },
        (error) => {
          console.error("Error retrieving location:", error);
        }
      );
    };

    storeLocationLocally();
  }, []);

  // ------------------------------
  // 3) Filter Products
  // ------------------------------
  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory
      ? product.category.toString() === selectedCategory
      : true;
    const matchName = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchName;
  });

  // ------------------------------
  // 4) Handlers
  // ------------------------------
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSearchSubmit = () => {
    const productSection = document.querySelector("#product-section");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ------------------------------
  // Render
  // ------------------------------
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

        <section className="location-display my-12">
          <h2>Your Location</h2>
          <p>Latitude: {latitude || "N/A"}</p>
          <p>Longitude: {longitude || "N/A"}</p>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;