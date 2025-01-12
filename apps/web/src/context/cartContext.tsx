// context/cartContext.tsx
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
  fetchCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartProductItem[]>([]);

  // Fetch cart data from API or fallback to localStorage
  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:8000/v1/api/user/item", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const apiCart = response.data.data.items || [];
      setCart(apiCart.map((item: any) => ({
        ...item.product,
        quantity: item.quantity,
      })));
    } catch (error) {
      console.error("Failed to fetch cart from API:", error);

      // Fallback to localStorage
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  };

  // Save cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  // Add item to cart and sync with API
  const addToCart = async (product: Product) => {
    try {
      await axios.post(
        "http://localhost:8000/v1/api/user/items",
        { productId: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      // Refresh cart from API after adding
      await fetchCart();
    } catch (error) {
      console.error("Failed to add item to cart via API:", error);

      // Fallback to local update
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

  // Remove item from cart and sync with API
  const removeFromCart = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/v1/api/user/items/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      // Refresh cart from API after removing
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item from cart via API:", error);

      // Fallback to local update
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Update item quantity and sync with API
  const updateQuantity = async (id: number, quantity: number) => {
    try {
      await axios.put(
        "http://localhost:8000/v1/api/user/items",
        { productId: id, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      // Refresh cart from API after updating
      await fetchCart();
    } catch (error) {
      console.error("Failed to update item quantity via API:", error);

      // Fallback to local update
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: quantity } : item
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
        fetchCart,
        totalItems,
        totalPrice,
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
