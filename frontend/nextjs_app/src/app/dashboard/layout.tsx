"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Menu, Bell, Search, UserCircle } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Format page title based on path
    const formatPathTitle = () => {
        if (pathname === "/dashboard") return "Overview";
        const segment = pathname?.split("/").pop();
        if (!segment) return "";
        return segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " ");
    };

    return (
        <div className="flex h-screen bg-muted/30 overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-card border-b border-border flex items-center justify-between px-6 lg:px-10 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-foreground">
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-foreground">{formatPathTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex relative">
                            <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search orders, customers..."
                                className="pl-10 pr-4 py-2 bg-muted border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64 text-foreground placeholder-muted-foreground"
                            />
                        </div>

                        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
                            <Bell className="h-6 w-6" />
                            <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 border-2 border-card rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-foreground">Admin User</p>
                                <p className="text-xs text-muted-foreground">Manager</p>
                            </div>
                            <UserCircle className="h-10 w-10 text-brand-600" />
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
