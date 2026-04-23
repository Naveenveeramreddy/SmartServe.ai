import Link from "next/link";
import { Coffee, User, Store, Shield } from "lucide-react";
import { getOptimizedUrl } from "@/lib/cloudinary";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Left Form View */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
                <div className="max-w-md w-full mx-auto">
                    <Link href="/" className="flex items-center gap-2 mb-12">
                        <div className="bg-brand-600 text-white p-2 rounded-xl">
                            <Coffee className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">
                            ServeSmart<span className="text-brand-600">AI</span>
                        </span>
                    </Link>

                    <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
                    <p className="text-muted-foreground mb-8">Select your account type to continue</p>

                    <div className="space-y-4">
                        <Link href="/login/customer" className="group flex items-center p-4 bg-card border border-border rounded-2xl hover:border-brand-500 hover:shadow-md transition-all">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl mr-4 group-hover:bg-brand-600 group-hover:text-white transition-colors text-blue-600">
                                <User className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-foreground text-lg">Customer</h3>
                                <p className="text-sm text-muted-foreground">Order ahead and track loyalty</p>
                            </div>
                        </Link>
                        
                        <Link href="/login/restaurant" className="group flex items-center p-4 bg-card border border-border rounded-2xl hover:border-brand-500 hover:shadow-md transition-all">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl mr-4 group-hover:bg-brand-600 group-hover:text-white transition-colors text-emerald-600">
                                <Store className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-foreground text-lg">Restaurant Owner</h3>
                                <p className="text-sm text-muted-foreground">Manage POS and AI analytics</p>
                            </div>
                        </Link>
                        
                        <Link href="/login/admin" className="group flex items-center p-4 bg-card border border-border rounded-2xl hover:border-brand-500 hover:shadow-md transition-all">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl mr-4 group-hover:bg-brand-600 group-hover:text-white transition-colors text-purple-600">
                                <Shield className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-foreground text-lg">Platform Admin</h3>
                                <p className="text-sm text-muted-foreground">System overview & management</p>
                            </div>
                        </Link>
                    </div>

                    <p className="text-center text-muted-foreground text-sm mt-8">
                        Don&apos;t have an account? <Link href="/register" className="text-brand-600 font-bold hover:underline">Join Now</Link>
                    </p>
                </div>
            </div>

            {/* Right Image View */}
            <div className="hidden md:block md:w-1/2 bg-zinc-900 relative">
                <img
                    src={getOptimizedUrl("https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1500&auto=format&fit=crop", 1000)}
                    alt="Coffee pouring"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16">
                    <h3 className="text-white text-3xl font-bold mb-4">Master your rush hour</h3>
                    <p className="text-zinc-300 text-lg max-w-md">Our AI recognizes VIPs instantly so you can start their order before they even reach the counter.</p>
                </div>
            </div>
        </div>
    );
}
