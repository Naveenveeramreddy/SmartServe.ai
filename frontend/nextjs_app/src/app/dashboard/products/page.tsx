"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Filter } from "lucide-react";

// Mock data
const initialProducts: any[] = [];

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = initialProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Products</h2>
                    <p className="text-muted-foreground">Manage your cafe&apos;s menu offerings.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-colors shadow-sm">
                    <Plus className="h-5 w-5" /> Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border p-4 rounded-2xl flex flex-col sm:flex-row gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products by name or ID..."
                        className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-border text-foreground rounded-xl hover:bg-muted font-medium transition-colors">
                    <Filter className="h-5 w-5" /> Category
                </button>
            </div>

            {/* Data Table */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                                <th className="font-semibold p-4">ID</th>
                                <th className="font-semibold p-4">Name</th>
                                <th className="font-semibold p-4">Category</th>
                                <th className="font-semibold p-4">Price</th>
                                <th className="font-semibold p-4">Stock</th>
                                <th className="font-semibold p-4">Status</th>
                                <th className="font-semibold p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((item) => (
                                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 font-mono text-xs text-muted-foreground">{item.id}</td>
                                    <td className="p-4 font-semibold text-foreground">{item.name}</td>
                                    <td className="p-4 text-muted-foreground">{item.category}</td>
                                    <td className="p-4 font-medium text-foreground">${item.price.toFixed(2)}</td>
                                    <td className="p-4 text-muted-foreground">{item.stock}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button className="p-2 text-muted-foreground hover:bg-muted hover:text-brand-600 rounded-lg transition-colors">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        No products found matching &quot;{searchTerm}&quot;
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
