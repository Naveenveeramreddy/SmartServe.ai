"use client";

import { useState, useEffect } from "react";
import { Users, Search, Star, MapPin, RefreshCcw } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface CustomerRecord {
  customer_id: string;
  user_id: string;
  total_visits: number;
  loyalty_points: number;
  last_visit?: string;
  is_vip: boolean;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/restaurants/customers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = customers.filter(
    (c) =>
      search === "" ||
      c.customer_id.toLowerCase().includes(search.toLowerCase()) ||
      c.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Customer Check-Ins</h2>
          <p className="text-muted-foreground">Track loyalty, visits, and VIP status.</p>
        </div>
        <button
          onClick={fetchCustomers}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border hover:bg-muted px-3 py-2 rounded-xl transition-colors"
        >
          <RefreshCcw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Registered</p>
            <p className="text-2xl font-bold text-foreground">{customers.length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl text-purple-600">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">VIP Members</p>
            <p className="text-2xl font-bold text-foreground">{customers.filter((c) => c.is_vip).length}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Loyalty Points Issued</p>
            <p className="text-2xl font-bold text-foreground">
              {customers.reduce((sum, c) => sum + c.loyalty_points, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground border-b border-border text-sm">
              <th className="font-semibold p-4">Customer ID</th>
              <th className="font-semibold p-4">Visits</th>
              <th className="font-semibold p-4">Loyalty Points</th>
              <th className="font-semibold p-4">Last Visit</th>
              <th className="font-semibold p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading customers...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  {token ? "No customer records found." : "Please log in to view customers."}
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.customer_id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono text-sm font-semibold text-foreground">#{c.customer_id.slice(0, 8)}</td>
                  <td className="p-4 text-foreground">{c.total_visits}</td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 text-brand-600 font-bold">
                      <Star className="h-4 w-4" /> {c.loyalty_points}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {c.last_visit ? new Date(c.last_visit).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-4">
                    {c.is_vip ? (
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-bold rounded-full">VIP</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">Regular</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
