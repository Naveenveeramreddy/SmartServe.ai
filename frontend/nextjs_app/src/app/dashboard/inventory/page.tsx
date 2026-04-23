"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Plus, Search, RefreshCw, Layers, PackageX } from "lucide-react";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch inventory from backend
        const fetchInventory = async () => {
            try {
                // In a real app, this would be a fetch to /api/inventory
                // const res = await fetch('http://localhost:8000/api/inventory/');
                // const data = await res.json();
                // setItems(data);
                
                // For now, we start with an empty array as requested: "everything should in there started freshly"
                setItems([]);
            } catch (err) {
                console.error("Failed to fetch inventory", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Inventory Level</h2>
                    <p className="text-muted-foreground">Real-time tracking of ingredients and supplies.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground bg-card hover:bg-muted rounded-xl font-medium transition-colors">
                        <RefreshCw className="h-4 w-4" /> Sync Sync
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-colors shadow-sm">
                        <Plus className="h-5 w-5" /> Receive Stock
                    </button>
                </div>
            </div>

            {/* AI Alert Banner - Only show if there are critical items */}
            {items.some(item => item.status === 'Critical') && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
                    <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-xl shrink-0">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h4 className="font-bold text-red-800 dark:text-red-400 mb-1">AI Vision Alert: Stock Discrepancy detected</h4>
                        <p className="text-red-600 dark:text-red-300 text-sm">
                            System detected a discrepancy. Please verify physical stock levels.
                        </p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-card border border-border p-4 rounded-2xl flex flex-col sm:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search inventory items..."
                        className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-xl hover:bg-muted font-medium transition-colors">
                    <Layers className="h-5 w-5" /> All Locations
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                                <th className="font-semibold p-4">Item Code</th>
                                <th className="font-semibold p-4">Ingredient Name</th>
                                <th className="font-semibold p-4">Current Qty</th>
                                <th className="font-semibold p-4">Min. Threshold</th>
                                <th className="font-semibold p-4">Supplier</th>
                                <th className="font-semibold p-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-mono text-xs text-muted-foreground">{item.id}</td>
                                    <td className="p-4 font-semibold text-foreground">{item.name}</td>
                                    <td className="p-4 font-bold text-foreground">{item.qty} {item.unit}</td>
                                    <td className="p-4 text-muted-foreground">{item.min} {item.unit}</td>
                                    <td className="p-4 text-muted-foreground">{item.supplier}</td>
                                    <td className="p-4 text-right">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'OK' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                item.status === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {!loading && items.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                            <PackageX className="h-12 w-12 opacity-20" />
                                            <p className="font-medium text-lg text-foreground">No items in inventory</p>
                                            <p className="text-sm max-w-xs mx-auto">Click &quot;Receive Stock&quot; to add your first ingredient or supply item.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
