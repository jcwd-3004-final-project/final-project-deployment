import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  images: string[];
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stockQuantity: number;
  category: Category;
};

export type CartProductItem = Product & { quantity: number };

type CartContextType = {
  cart: CartProductItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  incrementQuantity: (id: number) => Promise<void>;
  fetchCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  voucherDiscount: number;
  referralDiscount: number;
  discount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartProductItem[]>([]);

  // Fungsi fetchCart: mengambil data dari API atau fallback ke localStorage
  const fetchCart = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/v1/api/user/items",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const apiCart = response.data.data.items || [];

      if (apiCart.length > 0) {
        // Jika API mengembalikan data, gunakan data dari API
        setCart(
          apiCart.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
          }))
        );
      } else {
        // Jika data API kosong, coba ambil data dari localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        } else {
          setCart([]);
        }
      }
    } catch (error) {
      console.error("Failed to fetch cart from API:", error);
      // Jika terjadi error, ambil data dari localStorage
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  };

  // Panggil fetchCart saat pertama kali provider di-mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Simpan data cart ke localStorage setiap kali terjadi perubahan
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  // Tambahkan produk ke cart dan sinkronkan dengan API
  const addToCart = async (product: Product) => {
    try {
      await axios.post(
        "http://localhost:8000/v1/api/user/items",
        { productId: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      // Setelah berhasil tambah ke API, perbarui data cart
      await fetchCart();
    } catch (error) {
      console.error("Failed to add item to cart via API:", error);
      // Fallback: update cart secara lokal
      setCart((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        if (existingItem) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prev, { ...product, quantity: 1 }];
        }
      });
    }
  };

  // Hapus produk dari cart dan sinkronkan dengan API
  const removeFromCart = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/v1/api/user/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // Setelah berhasil menghapus dari API, perbarui data cart
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item from cart via API:", error);
      // Fallback: update cart secara lokal
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Perbarui jumlah produk pada cart dan sinkronkan dengan API
  const updateQuantity = async (id: number, quantity: number) => {
    try {
      console.log("Updating quantity:", { id, quantity });
      await axios.put(
        "http://localhost:8000/v1/api/user/items/remove",
        { productId: id, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      // Setelah pembaruan, refresh data cart
      await fetchCart();
    } catch (error) {
      console.error("Failed to update item quantity via API:", error);
      // Fallback: update cart secara lokal
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  // Increment jumlah produk dan sinkronkan dengan API
  const incrementQuantity = async (id: number) => {
    try {
      await axios.put(
        "http://localhost:8000/v1/api/user/items/increment",
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      // Setelah berhasil, refresh data cart
      await fetchCart();
    } catch (error) {
      console.error("Failed to increment item quantity via API:", error);
      // Fallback: update cart secara lokal
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        incrementQuantity,
        fetchCart,
        totalItems,
        totalPrice,
        voucherDiscount: 0,
        referralDiscount: 0,
        discount: 0
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
