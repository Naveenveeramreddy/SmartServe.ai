"use client";

import { useState, useEffect, useCallback } from "react";
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, ArrowUpRight, AlertTriangle, RefreshCcw } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AnalyticsSummary {
  total_revenue: number;
  total_orders: number;
  top_products: { product_name: string; total_sold: number }[];
  daily_revenue: { date: string; revenue: number }[];
}

interface Order {
  order_id: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface InventoryAlert {
  inventory_id: string;
  item_name: string;
  quantity: number;
  reorder_level: number;
}

export default function RestaurantDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<InventoryAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchData = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const [analyticsRes, ordersRes, inventoryRes] = await Promise.all([
        fetch(`${API}/api/analytics/restaurant`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/orders/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/inventory/`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (analyticsRes.ok) setSummary(await analyticsRes.json());
      if (ordersRes.ok) {
        const orders: Order[] = await ordersRes.json();
        setRecentOrders(orders.slice(0, 5));
      }
      if (inventoryRes.ok) {
        const inv: InventoryAlert[] = await inventoryRes.json();
        setLowStock(inv.filter((i) => i.quantity <= i.reorder_level));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeOrders = recentOrders.filter((o) => ["Pending", "Cooking", "Ready"].includes(o.status)).length;

  const statusColor = (s: string) => {
    if (s === "Completed") return "bg-green-100 text-green-700";
    if (s === "Cooking") return "bg-yellow-100 text-yellow-700";
    if (s === "Ready") return "bg-blue-100 text-blue-700";
    if (s === "Pending") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Restaurant Dashboard</h2>
          <p className="text-muted-foreground">Live view of your store performance.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border hover:bg-muted px-3 py-2 rounded-xl transition-colors">
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {!token && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-amber-700 font-medium">
          Please <Link href="/login/restaurant" className="underline font-bold">sign in as restaurant owner</Link> to see your live data.
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Revenue Today", value: loading ? "—" : `$${(summary?.total_revenue ?? 0).toFixed(2)}`, icon: DollarSign, color: "green", change: "+8.2%" },
          { label: "Active Orders", value: loading ? "—" : activeOrders, icon: ShoppingBag, color: "brand", change: "Live" },
          { label: "Total Orders", value: loading ? "—" : summary?.total_orders ?? 0, icon: Users, color: "blue", change: "All time" },
          { label: "Low Stock Alerts", value: loading ? "—" : lowStock.length, icon: Package, color: lowStock.length > 0 ? "red" : "gray", change: lowStock.length > 0 ? "Needs attention" : "OK" },
        ].map(({ label, value, icon: Icon, color, change }) => (
          <div key={label} className={`bg-card border rounded-2xl p-6 shadow-sm ${color === "red" && lowStock.length > 0 ? "border-red-400/50" : "border-border"}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              </div>
              <div className={`p-2 rounded-xl ${
                color === "green" ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                color === "brand" ? "bg-brand-100 dark:bg-brand-900/30 text-brand-600" :
                color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                color === "red" ? "bg-red-100 dark:bg-red-900/30 text-red-600" :
                "bg-muted text-muted-foreground"
              }`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
            <p className={`text-sm font-medium flex items-center gap-1 ${color === "red" && lowStock.length > 0 ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
              {color !== "red" && <ArrowUpRight className="h-4 w-4" />}
              {color === "red" && lowStock.length > 0 && <AlertTriangle className="h-4 w-4" />}
              {change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-foreground flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-brand-600" /> Recent Orders</h3>
            <Link href="/dashboard/orders" className="text-sm text-brand-600 font-semibold hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No orders yet.</div>
          ) : (
            recentOrders.map((o) => (
              <div key={o.order_id} className="flex justify-between items-center p-4 border-b border-border last:border-0 hover:bg-muted/30">
                <div>
                  <p className="font-mono font-semibold text-foreground text-sm">#{o.order_id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground">${o.total_amount.toFixed(2)}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor(o.status)}`}>{o.status}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Top Products + Low Stock */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border">
              <h3 className="font-bold text-foreground flex items-center gap-2"><TrendingUp className="h-5 w-5 text-brand-600" /> Top Products</h3>
            </div>
            {(summary?.top_products ?? []).length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No product data yet.</div>
            ) : (
              summary?.top_products.slice(0, 4).map((p, idx) => (
                <div key={p.product_name} className="flex justify-between items-center p-4 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                    <span className="font-medium text-foreground">{p.product_name}</span>
                  </div>
                  <span className="text-muted-foreground text-sm font-semibold">{p.total_sold} sold</span>
                </div>
              ))
            )}
          </div>

          {lowStock.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-5">
              <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5" /> Low Stock Alert
              </h3>
              <ul className="space-y-2">
                {lowStock.map((item) => (
                  <li key={item.inventory_id} className="flex justify-between text-sm">
                    <span className="font-medium text-red-700 dark:text-red-400">{item.item_name}</span>
                    <span className="text-muted-foreground">{item.quantity} remaining</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard/inventory" className="mt-3 block text-center text-sm font-semibold text-red-600 hover:underline">
                Manage Inventory →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
