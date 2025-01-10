// pages/products.tsx
import React, { useEffect, useState, createContext, useContext } from "react";
import Head from "next/head";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer";
// --------------------
// Utilitas: formatRupiah
// --------------------
const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

// --------------------
// Konteks: CartContext
// --------------------
interface CartItem extends Product {}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (product: Product) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, stockQuantity: item.stockQuantity - 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          { ...product, stockQuantity: product.stockQuantity - 1 },
        ];
      }
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// --------------------
// Tipe Data: Category & Product
// --------------------
type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  images: string[];
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  category: Category;
};

// --------------------
// Komponen: ProductList
// --------------------
type ProductListProps = {
  products: Product[];
};

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col"
        >
          <Link href={`/user/product/productDetail/${product.id}`} passHref>
            <p className="flex-1">
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  layout="fill"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  objectFit="contain"
                  className="rounded-t-lg bg-gray-100"
                />
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                  {product.name}
                </h3>
                <p className="text-md sm:text-lg font-bold text-gray-900 mt-1 sm:mt-1.5">
                  {formatRupiah(product.price)}
                </p>
                <p
                  className={`text-xs sm:text-sm mt-1 ${
                    product.stockQuantity > 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {product.stockQuantity > 0 ? "Tersedia" : "Stok Habis"}
                </p>
              </div>
            </p>
          </Link>
          <button
            onClick={() => addToCart(product)}
            className={`w-full py-1 sm:py-1.5 bg-green-500 text-white font-semibold rounded-b-lg ${
              product.stockQuantity > 0
                ? "hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={product.stockQuantity <= 0}
          >
            Tambah ke Keranjang
          </button>
        </div>
      ))}
    </div>
  );
};

// --------------------
// Halaman: ProductsPage
// --------------------
const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<{ message: string; data: Product[] }>(
          "http://localhost:8000/v1/api/products"
        );
        setProducts(response.data.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("Terjadi kesalahan saat mengambil data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <CartProvider>
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl">Memuat produk...</p>
        </div>
      </CartProvider>
    );
  }

  if (error) {
    return (
      <CartProvider>
        <div className="flex justify-center items-center h-screen">
          <p className="text-xl text-red-500">Error: {error}</p>
        </div>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <>
        <Head>
          <title>Produk Kami</title>
          <meta name="description" content="Daftar produk terbaru kami" />
        </Head>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Daftar Produk</h1>
          <ProductList products={products} />
        </main>
        <Footer />
      </>
    </CartProvider>
  );
};

export default ProductsPage;
