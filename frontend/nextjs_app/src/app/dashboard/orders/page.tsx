"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Eye, CheckCircle2, Clock, XCircle, RefreshCcw, ChefHat } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Order {
  order_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  table_number?: string;
}

const STATUS_STEPS = ["Pending", "Cooking", "Ready", "Completed"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchOrders();

    // WebSocket for live order updates
    const ws = new WebSocket("ws://localhost:8000/ws/realtime/default-room-id");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ORDER_UPDATE") {
          fetchOrders();
        }
      } catch {}
    };
    return () => ws.close();
  }, [fetchOrders]);

  const advanceStatus = async (orderId: string, currentStatus: string) => {
    const idx = STATUS_STEPS.indexOf(currentStatus);
    if (idx < 0 || idx >= STATUS_STEPS.length - 1) return;
    const nextStatus = STATUS_STEPS[idx + 1];
    setUpdating(orderId);
    try {
      await fetch(`${API}/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
    setUpdating(null);
  };

  const filteredOrders = orders.filter((o) => {
    const matchTab =
      activeTab === "Active"
        ? ["Pending", "Cooking", "Ready"].includes(o.status)
        : activeTab === "Completed"
        ? o.status === "Completed"
        : o.status === "Cancelled";
    const matchSearch = searchQuery
      ? o.order_id.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchTab && matchSearch;
  });

  const activeCount = orders.filter((o) => ["Pending", "Cooking", "Ready"].includes(o.status)).length;

  const statusStyle = (s: string) => {
    if (s === "Completed") return "text-green-600 dark:text-green-400";
    if (s === "Cancelled") return "text-red-600 dark:text-red-400";
    if (s === "Ready") return "text-brand-600 dark:text-brand-400";
    if (s === "Cooking") return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const statusIcon = (s: string) => {
    if (s === "Completed") return <CheckCircle2 className="h-4 w-4" />;
    if (s === "Cancelled") return <XCircle className="h-4 w-4" />;
    if (s === "Cooking") return <ChefHat className="h-4 w-4" />;
    return <Clock className="h-4 w-4" />;
  };

  const nextStatus = (s: string) => {
    const idx = STATUS_STEPS.indexOf(s);
    return idx >= 0 && idx < STATUS_STEPS.length - 1 ? STATUS_STEPS[idx + 1] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Order Management</h2>
          <p className="text-muted-foreground">Monitor and manage all incoming cafe orders in real-time.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
        >
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div className="flex space-x-6">
          {["Active", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 border-b-2 font-medium transition-colors ${
                activeTab === tab
                  ? "border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}{" "}
              {tab === "Active" && (
                <span className="ml-2 bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-xs py-0.5 px-2 rounded-full">
                  {activeCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b border-border text-sm">
                <th className="font-semibold p-4">Order ID</th>
                <th className="font-semibold p-4">Time</th>
                <th className="font-semibold p-4">Table</th>
                <th className="font-semibold p-4">Total</th>
                <th className="font-semibold p-4">Status</th>
                <th className="font-semibold p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No {activeTab.toLowerCase()} orders.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const next = nextStatus(order.status);
                  return (
                    <tr key={order.order_id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-mono text-sm font-semibold text-foreground">
                        #{order.order_id.slice(0, 8)}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="p-4 text-sm font-medium text-foreground">
                        {order.table_number || "Walk-in"}
                      </td>
                      <td className="p-4 text-sm font-bold text-foreground">
                        ${order.total_amount.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1.5 text-xs font-bold ${statusStyle(order.status)}`}>
                          {statusIcon(order.status)} {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {next && (
                          <button
                            onClick={() => advanceStatus(order.order_id, order.status)}
                            disabled={updating === order.order_id}
                            className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ml-auto"
                          >
                            <Eye className="h-3 w-3" />
                            {updating === order.order_id ? "..." : `Mark ${next}`}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
