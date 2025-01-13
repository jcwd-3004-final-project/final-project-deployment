import React, { useState, useEffect } from "react";
import Navbar from "@/components/navbar/navbar";
import HeroSection from "@/components/heroSection";
import ProductList from "@/components/productList";
import Footer from "@/components/footer";
import { Product } from "@/components/productList";
import axios from "axios";

// ADDED: Import Next.js router
import { useRouter } from "next/router";

const Home = () => {
  // ADDED: Initialize the Next.js router
  const router = useRouter();

  // ADDED: This useEffect checks if you landed on "/" with ?accessToken & ?refreshToken
  useEffect(() => {
    if (!router.isReady) return;

    const { accessToken, refreshToken } = router.query;
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken as string);
      localStorage.setItem("refreshToken", refreshToken as string);
      console.log("Tokens stored from query params:", { accessToken, refreshToken });

      // Optionally remove them from the URL so they don’t stay visible
      router.replace("/", undefined, { shallow: true });
    }
  }, [router.isReady, router.query]);

  // ------------------------------
  // Original code below
  // ------------------------------
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]); // To track cart items

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

  // ------------------------------
  // 4) Add Item to Cart
  // ------------------------------
  const addToCart = async (productId: number) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/v1/api/user/items",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Adjust as needed for your JWT logic
          },
        }
      );
      console.log("Item added to cart:", response.data);
      setCart((prevCart) => [...prevCart, response.data.data]); // Update cart state
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error handling
        console.error("Error adding item to cart:", error.response?.data || error.message);
      } else {
        // Generic error handling
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  // ------------------------------
  // Handlers
  // ------------------------------
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    console.log("handleCategoryChange:", category);
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
{/* 
        <section className="location-display my-12">
          <h2>Your Location</h2>
          <p>Latitude: {latitude || "N/A"}</p>
          <p>Longitude: {longitude || "N/A"}</p>
        </section> */}

        <section className="cart-display my-12">
          {/* <h2>Your Cart</h2> */}
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.product.name} - Quantity: {item.quantity}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;