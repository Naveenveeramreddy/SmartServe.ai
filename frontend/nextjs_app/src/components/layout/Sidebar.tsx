"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Coffee,
    Package,
    Users,
    UserSquare2,
    BarChart3,
    Video,
    LogOut,
    Settings
} from "lucide-react";

const sidebarLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
    { name: "Products", href: "/dashboard/products", icon: Coffee },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Staff", href: "/dashboard/staff", icon: UserSquare2 },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "AI Monitoring", href: "/dashboard/ai-monitoring", icon: Video },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-card border-r border-border h-screen sticky top-0 flex-col hidden md:flex">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-brand-600 text-white p-2 rounded-xl">
                        <Coffee className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-foreground">
                        ServeSmart<span className="text-brand-600">AI</span>
                    </span>
                </Link>
            </div>

            <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 mt-2">
                    Management
                </p>
                {sidebarLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 font-semibold"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                                }`}
                        >
                            <Icon className={`h-5 w-5 ${isActive ? "text-brand-600 dark:text-brand-400" : ""}`} />
                            {link.name}
                            {link.name === "Orders" && <span className="ml-auto bg-brand-600 animate-pulse text-white text-[10px] font-bold px-2 py-0.5 rounded-full">LIVE</span>}
                            {link.name === "Inventory" && <span className="ml-auto"></span>}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-border">
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground font-medium rounded-xl transition-colors">
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium rounded-xl transition-colors mt-1">
                    <LogOut className="h-5 w-5" />
                    Log Out
                </button>
            </div>
        </div>
    );
}
