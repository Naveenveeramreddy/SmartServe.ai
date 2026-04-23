"use client";

import Link from "next/link";
import { Coffee, CheckCircle2, ArrowLeft, Shield, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Form data
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [identifier, setIdentifier] = useState(""); // email or phone
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer");
    const [otpCode, setOtpCode] = useState("");

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/auth/register/request-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to request OTP");

            setStep(2);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const isEmail = identifier.includes("@");
            const payload = {
                name: `${firstName} ${lastName}`.trim(),
                email: isEmail ? identifier : null,
                phone: !isEmail ? identifier : null,
                password,
                role,
                otp_code: otpCode
            };

            const res = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || "Failed to register");

            // Successful registration, redirect to login
            router.push("/login");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row shadow-2xl">
            {/* Left Image View (Unchanged from original) */}
            <div className="hidden md:block md:w-5/12 bg-zinc-900 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1500&auto=format&fit=crop"
                    alt="Barista at work"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-brand-900/50 backdrop-blur-[2px]"></div>

                <div className="relative z-10 p-12 h-full flex flex-col justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-white/20 backdrop-blur-md text-white border border-white/30 p-2 rounded-xl">
                            <Coffee className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            ServeSmart<span className="opacity-80">AI</span>
                        </span>
                    </Link>

                    <div>
                        <h3 className="text-white text-3xl font-bold mb-8">Join the elite network of modern cafes</h3>
                        <ul className="space-y-6">
                            <li className="flex gap-4 text-white">
                                <CheckCircle2 className="h-6 w-6 text-brand-300 shrink-0" />
                                <span><strong className="block">Fast POS System</strong> Reduce checkout times by 40% with our modern interface.</span>
                            </li>
                            <li className="flex gap-4 text-white">
                                <CheckCircle2 className="h-6 w-6 text-brand-300 shrink-0" />
                                <span><strong className="block">Computer Vision Analytics</strong> Automatically measure wait queues and stock levels via cameras.</span>
                            </li>
                            <li className="flex gap-4 text-white">
                                <CheckCircle2 className="h-6 w-6 text-brand-300 shrink-0" />
                                <span><strong className="block">Unified Inventory</strong> Sync physical store stock with your mobile order app instantly.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-zinc-400 text-sm">
                        © {new Date().getFullYear()} ServeSmart AI
                    </div>
                </div>
            </div>

            {/* Right Form View */}
            <div className="w-full md:w-7/12 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
                <div className="max-w-md w-full mx-auto">

                    <div className="md:hidden flex items-center gap-2 mb-12">
                        <div className="bg-brand-600 text-white p-2 rounded-xl">
                            <Coffee className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-foreground">
                            ServeSmart<span className="text-brand-600">AI</span>
                        </span>
                    </div>

                    {step === 1 ? (
                        <>
                            <h2 className="text-3xl font-bold text-foreground mb-2">Create an account</h2>
                            <p className="text-muted-foreground mb-8">Set up your cafe or join as a customer.</p>
                            
                            {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm">{error}</div>}

                            <form onSubmit={handleRequestOtp} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Email or Phone Number</label>
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="john@cafe.com or +1234567890"
                                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-3">I am joining as a...</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole("customer")}
                                            className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 group ${
                                                role === "customer" 
                                                ? "bg-brand-50 border-brand-500 shadow-md ring-4 ring-brand-500/10" 
                                                : "bg-muted border-border hover:border-brand-300 hover:bg-brand-50/30"
                                            }`}
                                        >
                                            <div className={`p-2 rounded-xl w-fit transition-colors ${
                                                role === "customer" ? "bg-brand-600 text-white" : "bg-white dark:bg-zinc-800 text-muted-foreground group-hover:text-brand-600"
                                            }`}>
                                                <User className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${role === "customer" ? "text-brand-600" : "text-foreground"}`}>Customer</p>
                                                <p className="text-[11px] text-muted-foreground leading-tight">I want to order ahead and earn points</p>
                                            </div>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setRole("restaurant")}
                                            className={`p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 group ${
                                                role === "restaurant" 
                                                ? "bg-brand-50 border-brand-500 shadow-md ring-4 ring-brand-500/10" 
                                                : "bg-muted border-border hover:border-brand-300 hover:bg-brand-50/30"
                                            }`}
                                        >
                                            <div className={`p-2 rounded-xl w-fit transition-colors ${
                                                role === "restaurant" ? "bg-brand-600 text-white" : "bg-white dark:bg-zinc-800 text-muted-foreground group-hover:text-brand-600"
                                            }`}>
                                                <Shield className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm ${role === "restaurant" ? "text-brand-600" : "text-foreground"}`}>Business Owner</p>
                                                <p className="text-[11px] text-muted-foreground leading-tight">I want to manage my cafe with AI</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Create a strong password"
                                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground mt-2">Must be at least 8 characters long.</p>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" disabled={loading} className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all hover:shadow-brand-500/40 disabled:opacity-70">
                                        {loading ? "Sending OTP..." : "Continue"}
                                    </button>
                                </div>
                            </form>
                            
                            <p className="text-center text-muted-foreground text-sm mt-8">
                                Already have an account? <Link href="/login" className="text-brand-600 font-bold hover:underline">Sign In</Link>
                            </p>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setStep(1)} 
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to details
                            </button>
                            
                            <h2 className="text-3xl font-bold text-foreground mb-2">Check your device</h2>
                            <p className="text-muted-foreground mb-8">We've sent a 6-digit code to <strong className="text-foreground">{identifier}</strong>.</p>
                            
                            {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/50 text-red-500 rounded-xl text-sm">{error}</div>}

                            <form onSubmit={handleRegister} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Verification Code</label>
                                    <input
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-muted-foreground/50 text-foreground text-center tracking-[0.5em] text-2xl font-mono"
                                        required
                                    />
                                </div>

                                <div className="pt-2">
                                    <button type="submit" disabled={loading || otpCode.length < 6} className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all hover:shadow-brand-500/40 disabled:opacity-70">
                                        {loading ? "Verifying..." : "Create Account"}
                                    </button>
                                </div>
                                
                                <p className="text-center text-muted-foreground text-sm mt-4">
                                    Didn't receive it? <button type="button" onClick={handleRequestOtp} className="text-brand-600 font-bold hover:underline">Resend code</button>
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
