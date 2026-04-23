"use client";

import { useState, useEffect } from "react";
import { Building2, Users, DollarSign, Activity, ShoppingBag, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AnalyticsSummary {
  total_revenue: number;
  total_orders: number;
  total_restaurants: number;
  total_customers: number;
  top_restaurants: { name: string; revenue: number; orders: number }[];
}

interface UserData {
  user_id: string;
  email?: string;
  phone?: string;
  role: string;
  is_verified: boolean;
  created_at: string;
}

interface RestaurantData {
  restaurant_id: string;
  name: string;
  location?: string;
  order_count: number;
  created_at: string;
}

export default function AdminDashboardOverview() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "restaurants" | "users">("overview");
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [summaryRes, usersRes, restaurantsRes] = await Promise.all([
        fetch(`${API}/api/analytics/summary`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/api/admin/restaurants`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (summaryRes.ok) setSummary(await summaryRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (restaurantsRes.ok) setRestaurants(await restaurantsRes.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleUserAction = async (userId: string, action: "approve" | "suspend") => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setActionMsg(`User ${action}d successfully.`);
        fetchData();
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) { console.error(err); }
  };

  const statCards = [
    {
      label: "Total Restaurants",
      value: loading ? "—" : summary?.total_restaurants ?? 0,
      icon: Building2,
      color: "purple",
    },
    {
      label: "Total Customers",
      value: loading ? "—" : summary?.total_customers ?? 0,
      icon: Users,
      color: "blue",
    },
    {
      label: "Platform Revenue",
      value: loading ? "—" : `$${(summary?.total_revenue ?? 0).toLocaleString()}`,
      icon: DollarSign,
      color: "green",
    },
    {
      label: "Total Orders",
      value: loading ? "—" : summary?.total_orders ?? 0,
      icon: ShoppingBag,
      color: "orange",
    },
  ];

  const colorMap: Record<string, string> = {
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-foreground">Platform Overview</h2>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
        >
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {!token && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-red-700 dark:text-red-400 font-medium">
          Admin access required. Please{" "}
          <a href="/login/admin" className="underline font-bold">sign in</a> as an administrator.
        </div>
      )}

      {actionMsg && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 text-green-700 font-medium">
          {actionMsg}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-foreground">{value}</h3>
              </div>
              <div className={`p-2 rounded-xl ${colorMap[color]}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["overview", "restaurants", "users"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl font-semibold text-sm transition-colors capitalize ${
              activeTab === tab
                ? "bg-brand-600 text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 text-brand-600" /> Top Restaurants by Revenue
            </h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                <th className="font-semibold p-4">Restaurant</th>
                <th className="font-semibold p-4">Revenue</th>
                <th className="font-semibold p-4">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(summary?.top_restaurants ?? []).length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-muted-foreground">No data yet</td>
                </tr>
              ) : (
                summary?.top_restaurants.map((r) => (
                  <tr key={r.name} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{r.name}</td>
                    <td className="p-4 text-brand-600 font-bold">${r.revenue.toFixed(2)}</td>
                    <td className="p-4 text-muted-foreground">{r.orders}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "restaurants" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-bold text-foreground">All Restaurants</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b border-border text-sm">
                <th className="font-semibold p-4">Name</th>
                <th className="font-semibold p-4">Location</th>
                <th className="font-semibold p-4">Orders</th>
                <th className="font-semibold p-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {restaurants.map((r) => (
                <tr key={r.restaurant_id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{r.name}</td>
                  <td className="p-4 text-muted-foreground">{r.location || "—"}</td>
                  <td className="p-4 text-foreground">{r.order_count}</td>
                  <td className="p-4 text-muted-foreground text-sm">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {restaurants.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No restaurants registered.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "users" && (
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-bold text-foreground">User Management</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground border-b border-border text-sm">
                <th className="font-semibold p-4">User</th>
                <th className="font-semibold p-4">Role</th>
                <th className="font-semibold p-4">Status</th>
                <th className="font-semibold p-4">Joined</th>
                <th className="font-semibold p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.user_id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-semibold text-foreground text-sm">{u.email || u.phone || "—"}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === "admin" ? "bg-purple-100 text-purple-700" :
                      u.role === "restaurant" ? "bg-brand-100 text-brand-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>{u.role}</span>
                  </td>
                  <td className="p-4">
                    {u.is_verified
                      ? <span className="flex items-center gap-1 text-xs font-bold text-green-600"><CheckCircle2 className="h-4 w-4" />Active</span>
                      : <span className="flex items-center gap-1 text-xs font-bold text-red-500"><XCircle className="h-4 w-4" />Suspended</span>}
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUserAction(u.user_id, "approve")}
                        className="text-xs font-semibold text-green-600 hover:underline"
                      >Approve</button>
                      <button
                        onClick={() => handleUserAction(u.user_id, "suspend")}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
