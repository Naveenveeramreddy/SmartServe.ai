"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Coffee, Menu, X, ShoppingBag, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const pathname = usePathname();

    // Check auth state
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const role = localStorage.getItem("user_role");
        if (token) {
            setIsLoggedIn(true);
            setUserRole(role);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_role");
        setIsLoggedIn(false);
        setUserRole(null);
        window.location.href = "/";
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle dark mode setup
    useEffect(() => {
        if (document.documentElement.classList.contains("dark")) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Menu", href: "/menu" },
        { name: "Rewards", href: "/rewards" },
        { name: "Dashboard", href: "/dashboard" },
    ];

    return (
        <nav
            className={`w-full z-50 transition-all duration-300 border-b border-border ${scrolled
                    ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm"
                    : "bg-white dark:bg-background"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-brand-600 text-white p-2 rounded-xl group-hover:bg-brand-500 transition-colors">
                                <Coffee className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground">
                                ServeSmart<span className="text-brand-600">AI</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-brand-600 ${pathname === link.href ? "text-brand-600" : "text-muted-foreground"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section (Cart, Theme, Auth) */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <Link href="/cart" className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors relative">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute top-1 right-1 bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                0
                            </span>
                        </Link>
                        
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href={`/dashboard${userRole === 'admin' ? '/admin' : userRole === 'restaurant' ? '/restaurant' : '/customer'}`}
                                    className="text-sm font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 px-4 py-2 rounded-xl transition-all"
                                >
                                    My Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm font-medium text-muted-foreground hover:text-red-500 transition-colors px-2"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-foreground hover:text-brand-600 transition-colors px-4 py-2"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm"
                                >
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 text-muted-foreground"
                        >
                            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-foreground p-2 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-b border-border shadow-lg absolute w-full animate-fade-in">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted hover:text-brand-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-border mt-4 pt-4 flex flex-col gap-3">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-3 text-center rounded-md text-base font-medium bg-brand-600 text-white"
                                    >
                                        My Dashboard
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block px-3 py-3 text-center rounded-md text-base font-medium text-red-500 border border-border"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-3 text-center rounded-md text-base font-medium text-foreground border border-border"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setIsOpen(false)}
                                        className="block px-3 py-3 text-center rounded-md text-base font-medium bg-brand-600 text-white"
                                    >
                                        Join Now
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
