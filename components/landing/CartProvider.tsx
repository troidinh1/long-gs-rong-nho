"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

type CartContextValue = {
  items: CartItem[];
  isCartOpen: boolean;
  cartCount: number;
  cartTotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  decreaseQuantity: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "long-gs-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Load cart error:", error);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Save cart error:", error);
    }
  }, [items]);

  const cartCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const cartTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  function addToCart(product: Product) {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          weight: product.weight,
          price: product.price,
          image_url: product.image_url || "/images/product-rong-nho.png",
          quantity: 1,
        },
      ];
    });

    setIsCartOpen(true);
  }

  function decreaseQuantity(productId: string) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.max(0, item.quantity - 1),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function increaseQuantity(productId: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  }

  function removeFromCart(productId: string) {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        cartCount,
        cartTotal,
        openCart,
        closeCart,
        addToCart,
        decreaseQuantity,
        increaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
