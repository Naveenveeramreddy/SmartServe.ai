"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, UserRound, ArrowLeft, ShoppingBag } from "lucide-react";
import { getOptimizedUrl } from "@/lib/cloudinary";

const posCategories = ["All", "Coffee", "Cold Drinks", "Tea", "Pastries"];

const posItems = [
    { id: 1, name: "Artisan Latte", category: "Coffee", price: 4.50, img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200" },
    { id: 2, name: "Americano", category: "Coffee", price: 3.25, img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=200" },
    { id: 3, name: "Nitro Cold Brew", category: "Cold Drinks", price: 4.95, img: "https://images.unsplash.com/photo-1517701550927-30cfcb64db10?q=80&w=200" },
    { id: 4, name: "Butter Croissant", category: "Pastries", price: 3.75, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200" },
    { id: 5, name: "Iced Matcha", category: "Cold Drinks", price: 5.50, img: "https://images.unsplash.com/photo-1536420121509-0021b6d13038?q=80&w=200" },
    { id: 6, name: "Blueberry Muffin", category: "Pastries", price: 3.45, img: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=200" },
];

export default function POSPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [cart, setCart] = useState<{ item: typeof posItems[0], qty: number }[]>([]);

    const filteredItems = activeCategory === "All"
        ? posItems
        : posItems.filter(i => i.category === activeCategory);

    const addToCart = (item: typeof posItems[0]) => {
        setCart(prev => {
            const existing = prev.find(p => p.item.id === item.id);
            if (existing) {
                return prev.map(p => p.item.id === item.id ? { ...p, qty: p.qty + 1 } : p);
            }
            return [...prev, { item, qty: 1 }];
        });
    };

    const updateQty = (id: number, delta: number) => {
        setCart(prev => prev.map(p => {
            if (p.item.id === id) {
                const newQty = Math.max(0, p.qty + delta);
                return { ...p, qty: newQty };
            }
            return p;
        }).filter(p => p.qty > 0));
    };

    const subtotal = cart.reduce((sum, current) => sum + (current.item.price * current.qty), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    return (
        <div className="flex h-screen bg-muted/30 overflow-hidden text-foreground">

            {/* Left side: Menu Selection */}
            <div className="flex-1 flex flex-col h-full bg-background border-r border-border">
                {/* Header */}
                <header className="h-20 border-b border-border flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 bg-muted hover:bg-muted/80 rounded-xl transition-colors">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-bold">New Order</h1>
                    </div>

                    <div className="relative w-64">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                    </div>
                </header>

                {/* Categories */}
                <div className="p-4 border-b border-border overflow-x-auto">
                    <div className="flex space-x-2">
                        {posCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${activeCategory === cat
                                    ? "bg-brand-600 text-white shadow-sm"
                                    : "bg-card border border-border text-foreground hover:bg-muted"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => addToCart(item)}
                                className="bg-card border border-border rounded-xl p-3 flex flex-col items-center hover:border-brand-500 hover:shadow-md transition-all text-left"
                            >
                                <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                                    <img src={getOptimizedUrl(item.img, 200)} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold w-full truncate">{item.name}</h3>
                                <p className="text-brand-600 dark:text-brand-400 font-semibold w-full">${item.price.toFixed(2)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side: Cart / Checkout */}
            <div className="w-[400px] flex flex-col h-full bg-card shrink-0">

                {/* Customer Select */}
                <div className="p-4 border-b border-border">
                    <button className="w-full flex items-center justify-between p-3 border border-dashed border-border rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                        <span className="flex items-center gap-2 font-medium"><UserRound className="w-5 h-5" /> Add VIP Customer</span>
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                            <ShoppingBag className="h-12 w-12 mb-4 opacity-20" />
                            <p>Cart is empty</p>
                        </div>
                    ) : (
                        cart.map(c => (
                            <div key={c.item.id} className="flex flex-col gap-2 p-3 bg-muted/50 rounded-xl border border-border">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold flex-1">{c.item.name}</span>
                                    <span className="font-semibold text-brand-600 dark:text-brand-400">${(c.item.price * c.qty).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center bg-background rounded-lg border border-border">
                                        <button onClick={() => updateQty(c.item.id, -1)} className="p-1 hover:text-brand-600 transition-colors"><Minus className="h-4 w-4" /></button>
                                        <span className="px-3 font-semibold text-sm">{c.qty}</span>
                                        <button onClick={() => updateQty(c.item.id, 1)} className="p-1 hover:text-brand-600 transition-colors"><Plus className="h-4 w-4" /></button>
                                    </div>
                                    <button onClick={() => updateQty(c.item.id, -c.qty)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Checkout Summary */}
                <div className="p-6 bg-muted/30 border-t border-border mt-auto shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.2)]">
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl pt-2 border-t border-border">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            disabled={cart.length === 0}
                            className="py-4 bg-white dark:bg-zinc-800 border border-border text-foreground rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-muted disabled:opacity-50 transition-colors shadow-sm"
                        >
                            <Banknote className="h-6 w-6" />
                            Cash
                        </button>
                        <button
                            disabled={cart.length === 0}
                            className="py-4 bg-brand-600 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-brand-500 disabled:opacity-50 transition-colors shadow-lg shadow-brand-500/20"
                        >
                            <CreditCard className="h-6 w-6" />
                            Card / Pay
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
