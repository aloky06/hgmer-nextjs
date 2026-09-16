"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/api';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserOrder {
  id: number;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED';
  shippingAddress: string;
  paymentMethod: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  avatarUrl?: string;
}

export type PendingActionType = 'ADD_TO_CART' | 'BUY_NOW' | 'WISHLIST' | 'CHECKOUT' | 'CUSTOM';

export interface PendingAction {
  type: PendingActionType;
  product?: Product;
  quantity?: number;
  productId?: number;
  title?: string;
  imageUrl?: string;
  price?: number;
  message?: string;
  onSuccess?: () => void;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, options?: { skipAuth?: boolean }) => boolean;
  buyNow: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartMrpTotal: number;
  totalSavings: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: number[];
  toggleWishlist: (productId: number, options?: { skipAuth?: boolean }) => void;
  isWishlisted: (productId: number) => boolean;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: number | null;
  setSelectedCategory: (catId: number | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Auth & Account
  user: UserProfile | null;
  userToken: string | null;
  loginUser: (token: string, profile: UserProfile) => void;
  logoutUser: () => void;
  savedAddresses: string[];
  addSavedAddress: (address: string) => void;
  
  // Auth Modal & Pending Action State
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'LOGIN' | 'REGISTER';
  setAuthModalMode: (mode: 'LOGIN' | 'REGISTER') => void;
  pendingAction: PendingAction | null;
  openAuthModal: (mode?: 'LOGIN' | 'REGISTER', action?: PendingAction | null) => void;
  closeAuthModal: () => void;
  
  // Orders
  orders: UserOrder[];
  placeOrder: (shippingAddress: string, paymentMethod: string, couponDiscount?: number) => UserOrder;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<string[]>([
    "Babatpur, Varanasi, Uttar Pradesh - 221006",
  ]);

  // Auth Modal & Pending Action
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // Orders State
  const [orders, setOrders] = useState<UserOrder[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('hgmer_cart');
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem('hgmer_wishlist');
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedUser = localStorage.getItem('hgmer_user');
      const savedToken = localStorage.getItem('hgmer_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setUserToken(savedToken);
      }

      const savedOrders = localStorage.getItem('hgmer_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Initial sample order
        setOrders([
          {
            id: 1001,
            orderNumber: "HGM-2026-9812",
            date: "05 Sep 2026",
            items: [
              {
                product: {
                  id: 101,
                  name: "सत्यनारायण महापूजा सम्पूर्ण किट (All-in-One Box)",
                  description: "सत्यनारायण कथा के लिए आवश्यक 32 सामग्रियां",
                  price: 899,
                  mrp: 1299,
                  imageUrl: "/havan_set.jpeg",
                },
                quantity: 1,
              },
            ],
            subtotal: 899,
            discount: 90,
            deliveryCharge: 0,
            totalAmount: 809,
            status: "DELIVERED",
            shippingAddress: "Babatpur, Varanasi, Uttar Pradesh - 221006",
            paymentMethod: "UPI / Online Payment",
          },
        ]);
      }
    } catch (e) {
      console.warn("Could not load storage data", e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hgmer_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn("Could not save cart", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('hgmer_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist", e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('hgmer_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn("Could not save orders", e);
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const openAuthModal = (mode: 'LOGIN' | 'REGISTER' = 'LOGIN', action: PendingAction | null = null) => {
    setAuthModalMode(mode);
    setPendingAction(action);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const loginUser = (token: string, profile: UserProfile) => {
    setUser(profile);
    setUserToken(token);
    try {
      localStorage.setItem('hgmer_user', JSON.stringify(profile));
      localStorage.setItem('hgmer_token', token);
      localStorage.setItem('token', token);
    } catch (e) {}
    
    showToast(`✓ स्वागत है, ${profile.name}!`);

    // Handle any pending action queued before login
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setIsAuthModalOpen(false);

      if (action.type === 'ADD_TO_CART' && action.product) {
        setTimeout(() => {
          doAddToCart(action.product!, action.quantity || 1);
          setIsCartOpen(true);
        }, 150);
      } else if (action.type === 'BUY_NOW' && action.product) {
        setTimeout(() => {
          doAddToCart(action.product!, action.quantity || 1);
          if (typeof window !== 'undefined') {
            window.location.href = '/checkout';
          }
        }, 150);
      } else if (action.type === 'WISHLIST' && action.productId) {
        setTimeout(() => {
          doToggleWishlist(action.productId!);
        }, 150);
      } else if (action.type === 'CHECKOUT') {
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/checkout';
          }
        }, 150);
      } else if (action.onSuccess) {
        action.onSuccess();
      }
    } else {
      setIsAuthModalOpen(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setUserToken(null);
    try {
      localStorage.removeItem('hgmer_user');
      localStorage.removeItem('hgmer_token');
      localStorage.removeItem('token');
    } catch (e) {}
    showToast("सफलतापूर्वक लॉगआउट किया गया।");
  };

  const addSavedAddress = (address: string) => {
    if (!address.trim()) return;
    setSavedAddresses((prev) => [...prev, address]);
    showToast("नया पता सहेजा गया");
  };

  // Internal direct cart adder
  const doAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`✓ "${product.name.slice(0, 24)}..." कार्ट में जोड़ा गया!`);
  };

  // Public addToCart with Auth Gating
  const addToCart = (product: Product, quantity = 1, options?: { skipAuth?: boolean }): boolean => {
    if (!options?.skipAuth && !user) {
      openAuthModal('LOGIN', {
        type: 'ADD_TO_CART',
        product,
        quantity,
        title: product.name,
        imageUrl: product.imageUrl || undefined,
        price: product.price,
        message: `"${product.name}" को कार्ट में जोड़ने के लिए कृपया पहले लॉगिन या नया खाता बनाएं।`,
      });
      return false;
    }

    doAddToCart(product, quantity);
    return true;
  };

  // Public buyNow with Auth Gating & Auto-Checkout
  const buyNow = (product: Product, quantity = 1) => {
    if (!user) {
      openAuthModal('LOGIN', {
        type: 'BUY_NOW',
        product,
        quantity,
        title: product.name,
        imageUrl: product.imageUrl || undefined,
        price: product.price,
        message: `"${product.name}" खरीदने और चेकआउट करने के लिए कृपया पहले लॉगिन करें।`,
      });
      return;
    }

    doAddToCart(product, quantity);
    if (typeof window !== 'undefined') {
      window.location.href = '/checkout';
    }
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const doToggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("विशलिस्ट से हटाया गया");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("♥ विशलिस्ट में सहेजा गया!");
        return [...prev, productId];
      }
    });
  };

  const toggleWishlist = (productId: number, options?: { skipAuth?: boolean }) => {
    if (!options?.skipAuth && !user) {
      openAuthModal('LOGIN', {
        type: 'WISHLIST',
        productId,
        message: "वस्तु को विशलिस्ट में सहेजने के लिए कृपया लॉगिन करें।",
      });
      return;
    }
    doToggleWishlist(productId);
  };

  const isWishlisted = (productId: number) => wishlist.includes(productId);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartMrpTotal = cartItems.reduce(
    (sum, item) => sum + (item.product.mrp || item.product.price * 1.25) * item.quantity,
    0
  );
  const totalSavings = Math.max(0, Math.round(cartMrpTotal - cartTotal));

  const placeOrder = (shippingAddress: string, paymentMethod: string, couponDiscount = 0): UserOrder => {
    const delivery = cartTotal >= 499 ? 0 : 49;
    const finalAmt = Math.max(0, cartTotal - couponDiscount + delivery);
    
    const newOrder: UserOrder = {
      id: Date.now(),
      orderNumber: `HGM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      items: [...cartItems],
      subtotal: cartTotal,
      discount: couponDiscount,
      deliveryCharge: delivery,
      totalAmount: finalAmt,
      status: 'CONFIRMED',
      shippingAddress,
      paymentMethod,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast("🎉 जय श्री राम! आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है।");
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        cartMrpTotal,
        totalSavings,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        quickViewProduct,
        setQuickViewProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        toastMessage,
        showToast,
        user,
        userToken,
        loginUser,
        logoutUser,
        savedAddresses,
        addSavedAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        pendingAction,
        openAuthModal,
        closeAuthModal,
        orders,
        placeOrder,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-orange-500/30 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
          <p className="text-sm font-semibold">{toastMessage}</p>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
