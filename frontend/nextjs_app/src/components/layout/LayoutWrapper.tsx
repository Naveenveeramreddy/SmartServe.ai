"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide standard navbar/footer on admin dashboard and POS routes
    const isAppRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/pos');

    return (
        <div className="flex flex-col min-h-screen">
            {!isAppRoute && <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {!isAppRoute && <Footer />}
        </div>
    );
}
