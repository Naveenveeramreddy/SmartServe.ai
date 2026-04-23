"use client";

import Link from "next/link";
import { Coffee, Facebook, Instagram, Twitter, MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="bg-brand-600 text-white p-2 rounded-xl">
                                <Coffee className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-foreground">
                                ServeSmart<span className="text-brand-600">AI</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            The intelligent cafe management platform combining AI video analytics, smart POS, and seamless customer experiences.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-brand-600 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link href="/menu" className="text-muted-foreground hover:text-brand-600 text-sm transition-colors">Our Menu</Link></li>
                            <li><Link href="/rewards" className="text-muted-foreground hover:text-brand-600 text-sm transition-colors">Rewards Program</Link></li>
                            <li><Link href="/locations" className="text-muted-foreground hover:text-brand-600 text-sm transition-colors">Find a Store</Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-brand-600 text-sm transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Solutions</h3>
                        <ul className="space-y-3">
                            <li><Link href="/dashboard" className="text-muted-foreground hover:text-brand-600 text-sm transition-colors">Admin Dashboard</Link></li>
                            <li><Link href="/pos" className="text-muted-foreground hover:text-brand-600 text-sm transition-colors">Smart POS</Link></li>
                            <li><Link href="/dashboard/ai-monitoring" className="text-muted-foreground hover:text-brand-600 text-sm transition-colors">AI Video Analytics</Link></li>
                            <li><Link href="/dashboard/inventory" className="text-muted-foreground hover:text-brand-600 text-sm transition-colors">Inventory Control</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-muted-foreground">
                                <MapPin className="h-5 w-5 text-brand-600 shrink-0" />
                                <span>123 Innovation Way, Tech District<br />San Francisco, CA 94103</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Phone className="h-5 w-5 text-brand-600 shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Mail className="h-5 w-5 text-brand-600 shrink-0" />
                                <span>hello@servesmart.ai</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} ServeSmart AI Technologies. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
