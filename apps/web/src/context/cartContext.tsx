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
  discount: number; // Total discount (voucher + referral)
  totalAfterDiscount: number; // Total price after discount
  setVoucherDiscount: (discount: number) => void;
  setReferralDiscount: (discount: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartProductItem[]>([]);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [referralDiscount, setReferralDiscount] = useState(0);

  // Utility function to load cart from localStorage
  const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      setCart([]);
    }
  };

  // FetchCart: Tries to fetch from the API if token exists, otherwise from localStorage
  const fetchCart = async () => {
    const token = localStorage.getItem("accessToken");

    // If no token, load cart from local storage only
    if (!token) {
      loadCartFromLocalStorage();
      return;
    }

    try {


      const response = await axios.get("https://d29jci2p0msjlf.cloudfront.net/v1/api/user/items", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });



      const apiCart = response.data.data.items || [];
      if (apiCart.length > 0) {
        // Use API data if available
        setCart(
          apiCart.map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
          }))
        );
      } else {
        // If API data is empty, try local storage
        loadCartFromLocalStorage();
      }
    } catch (error: any) {
      // If 401, you might want to handle token removal or redirection to login
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access - token may be invalid.");
        // Optionally clear token:
        // localStorage.removeItem("accessToken");
        // Possibly redirect to login, etc.
      } else {
        console.error("Failed to fetch cart from API:", error);
      }
      // In any case of error, fall back to localStorage
      loadCartFromLocalStorage();
    }
  };

  // Call fetchCart when the provider mounts
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  // Add to cart, prefer API if token exists
  const addToCart = async (product: Product) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Not logged in, fallback to local
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
      return;
    }

    // If token, try the API
    try {
      await axios.post(
        "https://d29jci2p0msjlf.cloudfront.net/v1/api/user/items",
        { productId: product.id, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh local state from the server
      await fetchCart();
    } catch (error) {
      console.error("Failed to add item to cart via API:", error);
      // Fallback: update cart locally
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

  // Remove from cart
  const removeFromCart = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Not logged in, remove locally
      setCart((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    try {


      await axios.delete(`https://d29jci2p0msjlf.cloudfront.net/v1/api/user/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item via API:", error);
      // Fallback: remove locally
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Update quantity
  const updateQuantity = async (id: number, quantity: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Not logged in, update locally
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      return;
    }

    try {
      await axios.put(
        "https://d29jci2p0msjlf.cloudfront.net/v1/api/user/items/remove",
        { productId: id, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchCart();
    } catch (error) {
      console.error("Failed to update item quantity via API:", error);
      // Fallback: update locally
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  // Increment quantity
  const incrementQuantity = async (id: number) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // Not logged in, increment locally
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      return;
    }

    try {
      await axios.put(
        "https://d29jci2p0msjlf.cloudfront.net/v1/api/user/items/increment",
        { productId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchCart();
    } catch (error) {
      console.error("Failed to increment item via API:", error);
      // Fallback: increment locally
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
  const discount = voucherDiscount + referralDiscount;
  const totalAfterDiscount = Math.max(0, totalPrice - discount);

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
        voucherDiscount,
        referralDiscount,
        discount,
        totalAfterDiscount,
        setVoucherDiscount,
        setReferralDiscount,
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
