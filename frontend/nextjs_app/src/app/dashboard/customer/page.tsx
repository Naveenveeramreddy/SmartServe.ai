"use client";

import { useState, useEffect } from "react";
import { Coffee, MapPin, Star, History, ShoppingCart, Award, X, Plus, Minus } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Restaurant {
  restaurant_id: string;
  name: string;
  location?: string;
  description?: string;
  cuisine?: string;
  rating?: number;
  image?: string;
}

interface Product {
  product_id: string;
  product_name: string;
  category: string;
  price: number;
  image?: string;
  availability: boolean;
}

interface Order {
  order_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  restaurant_id: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CustomerDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string; email?: string; phone?: string } | null>(null);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Fetch restaurants
      const restaurantsRes = await fetch(`${API}/api/restaurants/`);
      if (restaurantsRes.ok) {
        const data = await restaurantsRes.json();
        setRestaurants(data);
      }

      // Fetch user profile and orders if logged in
      if (token) {
        const meRes = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (meRes.ok) {
          const userData = await meRes.json();
          setUser(userData);
        }

        const ordersRes = await fetch(`${API}/api/orders/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
          setLoyaltyPoints(ordersData.length * 10);
        }
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    setLoading(false);
  };

  const openMenu = async (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCart([]);
    try {
      const res = await fetch(`${API}/api/products/?restaurant_id=${restaurant.restaurant_id}`);
      if (res.ok) {
        const data = await res.json();
        setMenu(data);
      }
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.product_id === product.product_id);
      if (existing) {
        return prev.map((i) =>
          i.product.product_id === product.product_id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.product_id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) =>
          i.product.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.product.product_id !== productId);
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = async () => {
    if (!token || !selectedRestaurant) {
      setOrderStatus("Please log in to place an order.");
      return;
    }
    try {
      const orderData = {
        total_amount: cartTotal,
        status: "Pending",
        priority: 0,
        items: cart.map((i) => ({
          product_id: i.product.product_id,
          quantity: i.quantity,
          price_at_time: i.product.price,
        })),
      };
      const res = await fetch(
        `${API}/api/orders/?restaurant_id=${selectedRestaurant.restaurant_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      if (res.ok) {
        setOrderStatus("✅ Order placed successfully! Your cafe will prepare it shortly.");
        setCart([]);
        setShowCart(false);
        fetchInitialData();
      } else {
        setOrderStatus("❌ Failed to place order. Please try again.");
      }
    } catch (err) {
      setOrderStatus("❌ Network error. Please check your connection.");
    }
  };

  const statusColor = (s: string) => {
    if (s === "Completed") return "bg-green-100 text-green-700";
    if (s === "Cooking") return "bg-yellow-100 text-yellow-700";
    if (s === "Ready") return "bg-blue-100 text-blue-700";
    if (s === "Pending") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  const FALLBACK_IMGS = [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600",
    "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?q=80&w=600",
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* Cart FAB */}
      {cart.length > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-brand-600 hover:bg-brand-700 text-white px-5 py-4 rounded-full shadow-2xl transition-all"
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="font-bold">{cartCount} items · ${cartTotal.toFixed(2)}</span>
        </button>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCart(false)} />
          <div className="relative bg-card border border-border rounded-3xl w-full max-w-md shadow-2xl p-6 z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground">Your Order</h3>
              <button onClick={() => setShowCart(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            {cart.map((item) => (
              <div key={item.product.product_id} className="flex justify-between items-center py-3 border-b border-border">
                <div>
                  <p className="font-semibold text-foreground">{item.product.product_name}</p>
                  <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(item.product.product_id)} className="bg-muted hover:bg-red-100 text-foreground rounded-full p-1">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart(item.product)} className="bg-muted hover:bg-brand-100 text-foreground rounded-full p-1">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4 mb-6">
              <span className="font-bold text-foreground">Total</span>
              <span className="font-extrabold text-2xl text-brand-600">${cartTotal.toFixed(2)}</span>
            </div>
            {orderStatus && (
              <div className="mb-4 p-3 rounded-xl bg-muted text-sm font-medium text-foreground">{orderStatus}</div>
            )}
            <button
              onClick={placeOrder}
              className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {selectedRestaurant && !showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelectedRestaurant(null)} />
          <div className="relative bg-card border border-border rounded-3xl w-full max-w-2xl shadow-2xl p-6 z-10 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">{selectedRestaurant.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedRestaurant.cuisine || "Café"}</p>
              </div>
              <div className="flex items-center gap-3">
                {cart.length > 0 && (
                  <button
                    onClick={() => { setSelectedRestaurant(null); setShowCart(true); }}
                    className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    <ShoppingCart className="h-4 w-4" /> {cartCount}
                  </button>
                )}
                <button onClick={() => setSelectedRestaurant(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            {menu.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No menu items available</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menu.map((product) => {
                  const cartQty = cart.find((i) => i.product.product_id === product.product_id)?.quantity || 0;
                  return (
                    <div key={product.product_id} className="bg-muted/50 rounded-2xl overflow-hidden border border-border">
                      {product.image && (
                        <img src={product.image} alt={product.product_name} className="w-full h-36 object-cover" />
                      )}
                      <div className="p-4">
                        <h4 className="font-bold text-foreground">{product.product_name}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-brand-600">${product.price.toFixed(2)}</span>
                          {cartQty === 0 ? (
                            <button
                              onClick={() => addToCart(product)}
                              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
                            >
                              Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button onClick={() => removeFromCart(product.product_id)} className="bg-muted hover:bg-red-100 rounded-full p-1"><Minus className="h-4 w-4" /></button>
                              <span className="font-bold">{cartQty}</span>
                              <button onClick={() => addToCart(product)} className="bg-muted hover:bg-brand-100 rounded-full p-1"><Plus className="h-4 w-4" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header / Loyalty */}
      <div className="bg-brand-600 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-10 blur-3xl transform translate-x-1/3" />
        <div className="z-10 relative">
          <h2 className="text-3xl font-bold mb-1">Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!</h2>
          <p className="text-brand-100">You have <strong>{loyaltyPoints}</strong> Loyalty Points available.</p>
        </div>
        <div className="z-10 flex gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-[130px]">
            <p className="text-sm font-medium text-brand-100 mb-1">Loyalty Points</p>
            <h3 className="text-3xl font-extrabold flex items-center justify-center gap-2">
              <Award className="h-6 w-6" />{loyaltyPoints}
            </h3>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {orderStatus && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 text-green-700 dark:text-green-400 font-medium">
          {orderStatus}
        </div>
      )}

      {/* Restaurants */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-brand-600" /> Restaurants Near You
        </h3>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse h-40" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Coffee className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No restaurants registered yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map((r, idx) => (
              <div key={r.restaurant_id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col sm:flex-row">
                <div className="h-48 sm:h-auto sm:w-40 relative overflow-hidden flex-shrink-0">
                  <img
                    src={r.image || FALLBACK_IMGS[idx % FALLBACK_IMGS.length]}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col justify-center flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-foreground group-hover:text-brand-600 transition-colors">{r.name}</h4>
                    {r.rating && (
                      <span className="flex items-center gap-1 text-sm font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3 fill-current" /> {r.rating}
                      </span>
                    )}
                  </div>
                  {r.location && <p className="text-muted-foreground text-sm mb-1"><MapPin className="h-3 w-3 inline mr-1" />{r.location}</p>}
                  {r.cuisine && <p className="text-xs text-muted-foreground mb-4">{r.cuisine}</p>}
                  <button
                    onClick={() => openMenu(r)}
                    className="mt-auto py-2 px-4 bg-muted hover:bg-brand-50 dark:hover:bg-brand-900/20 text-foreground hover:text-brand-600 font-semibold rounded-xl text-center transition-colors"
                  >
                    View Menu & Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order History */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <History className="h-6 w-6 text-brand-600" /> Order History
        </h3>
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Coffee className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No orders yet. Place your first order above!</p>
              {!token && (
                <Link href="/login/customer" className="mt-4 inline-block text-brand-600 font-semibold hover:underline">
                  Sign in to see your history
                </Link>
              )}
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.order_id} className="p-4 border-b border-border hover:bg-muted/30 transition-colors flex justify-between items-center last:border-0">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-50 dark:bg-brand-900/20 p-3 rounded-xl">
                    <Coffee className="h-6 w-6 text-brand-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Order #{order.order_id.slice(0, 8)}</h4>
                    <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${order.total_amount.toFixed(2)}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor(order.status)}`}>{order.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
