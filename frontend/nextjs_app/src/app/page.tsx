import Link from "next/link";
import { ArrowRight, Coffee, ShieldCheck, Zap, BarChart3, Star } from "lucide-react";
import { getOptimizedUrl } from "@/lib/cloudinary";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={getOptimizedUrl("https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2694&auto=format&fit=crop", 1600)}
            alt="Modern Cafe Interior"
            className="w-full h-full object-cover brightness-50 dark:brightness-40"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <span className="flex h-2 w-2 rounded-full bg-brand-400 animate-pulse"></span>
            Introducing Smart Surveillance 2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            ServeSmart AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">
              Intelligent Cafe Management
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-200 mb-10 max-w-2xl animate-fade-in" style={{ animationDelay: "200ms" }}>
            The all-in-one platform combining next-generation AI video analytics, deep customer insights, and a lightning-fast modern POS system.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <Link
              href="/menu"
              className="px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-brand-500/25 flex items-center gap-2"
            >
              Order Now <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold text-lg transition-all flex items-center gap-2"
            >
              Explore Dashboard
            </Link>
          </div>
        </div>

        {/* Wave transition */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none z-10">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.06,155.43,115.15,227.14,97.7,260.67,89.5,292.8,72.4,321.39,56.44Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* Highlights / Features Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Everything you need to <span className="text-brand-600">run your cafe</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Replace a dozen disconnected tools with one perfectly integrated intelligent system designed specifically for modern coffee shops.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-brand-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Coffee className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Modern Point of Sale</h3>
              <p className="text-muted-foreground leading-relaxed">
                Lightning fast checkout, inventory deductions, and Apple/Google Pay integrations. Beautifully intuitive for baristas.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Smart AI Monitoring</h3>
              <p className="text-muted-foreground leading-relaxed">
                Plug in your existing cameras to track wait times, idle staff, low inventory, and VIP customer arrivals instantly.
              </p>
            </div>

            <div className="bg-card border border-border rounded-3xl p-8 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-purple-50 dark:bg-purple-900/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Deep Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Understand your peak hours, most profitable items, and revenue forecasts with beautiful, actionable dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Drinks */}
      <section className="py-24 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Crafted to perfection</h2>
              <p className="text-lg text-muted-foreground">Preview our online ordering experience. Customers earn loyalty points with every digital or in-store purchase.</p>
            </div>
            <Link href="/menu" className="hidden md:flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-500 transition-colors">
              View Full Menu <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Drink 1 */}
            <div className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                <img src={getOptimizedUrl("https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1000&auto=format&fit=crop", 600)} alt="Latte" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-foreground">
                  $4.50
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Artisan Latte</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Rich espresso perfectly balanced with steamed milk and a light layer of foam.</p>
                <button className="w-full py-3 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-semibold rounded-xl transition-colors">
                  Add to Order
                </button>
              </div>
            </div>

            {/* Drink 2 */}
            <div className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                <img src={getOptimizedUrl("https://images.unsplash.com/photo-1517701550927-30cfcb64db10?q=80&w=1000&auto=format&fit=crop", 600)} alt="Cold Brew" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-foreground">
                  $4.95
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Nitro Cold Brew</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Our signature cold brew infused with nitrogen for a sweet flavor and velvety crema.</p>
                <button className="w-full py-3 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-semibold rounded-xl transition-colors">
                  Add to Order
                </button>
              </div>
            </div>

            {/* Pastry 1 */}
            <div className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                <img src={getOptimizedUrl("https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop", 600)} alt="Croissant" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-foreground">
                  $3.75
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Butter Croissant</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Classic, flaky, buttery pastry baked fresh multiple times daily.</p>
                <button className="w-full py-3 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-semibold rounded-xl transition-colors">
                  Add to Order
                </button>
              </div>
            </div>

            {/* Sandwich 1 */}
            <div className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all">
              <div className="relative h-64 w-full overflow-hidden bg-zinc-100">
                <img src={getOptimizedUrl("https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1000&auto=format&fit=crop", 600)} alt="Sandwich" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-foreground">
                  $8.50
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Turkey Pesto Panini</h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Roasted turkey breast, provolone, and basil pesto melted on ciabatta.</p>
                <button className="w-full py-3 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-semibold rounded-xl transition-colors">
                  Add to Order
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center md:hidden">
            <Link href="/menu" className="flex items-center gap-2 text-brand-600 font-semibold">
              View Full Menu <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Intelligence Section */}
      <section className="py-24 bg-background overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-100 to-blue-100 dark:from-brand-900/30 dark:to-blue-900/30 blur-2xl rounded-full opacity-50"></div>
              <div className="relative bg-zinc-900 border border-border rounded-3xl p-1 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-brand-900/10 pointer-events-none z-10"></div>
                {/* AI HUD Overlay */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-white text-[10px] font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    REC: 1080p | 30fps
                  </div>
                  <div className="bg-brand-600/90 backdrop-blur-md px-3 py-1 rounded text-white text-[10px] font-bold">
                    AI VISION: ACTIVE
                  </div>
                </div>
                
                <img
                  src={getOptimizedUrl("https://images.unsplash.com/photo-1590402444681-cd3dc7a9805d?q=80&w=1200&auto=format&fit=crop", 1200)}
                  alt="Professional AI Surveillance Hub"
                  className="rounded-2xl w-full opacity-90 shadow-2xl"
                />

                {/* Simulated AI Overlays (More Subtle & Professional) */}
                <div className="absolute top-[25%] left-[20%] border-2 border-brand-400 bg-brand-400/5 w-28 h-52 rounded-lg z-20 flex flex-col justify-end p-2 transition-all group-hover:bg-brand-400/10">
                  <div className="bg-brand-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-t-sm self-start -mt-8 shadow-lg">
                    CUST_ID #1024
                  </div>
                  <div className="bg-black/80 text-white text-[9px] px-2 py-0.5 rounded-b-sm self-start mb-2">
                    VIP: Gold Tier
                  </div>
                </div>

                <div className="absolute top-[40%] left-[60%] border-2 border-blue-400 bg-blue-400/5 w-24 h-44 rounded-lg z-20 flex flex-col justify-end p-2 transition-all group-hover:bg-blue-400/10">
                  <div className="bg-blue-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-t-sm self-start -mt-8 shadow-lg uppercase">
                    Detection
                  </div>
                  <div className="bg-black/80 text-white text-[9px] px-2 py-0.5 rounded-b-sm self-start mb-2">
                    Entry Zone A
                  </div>
                </div>

                <div className="absolute top-[15%] right-[10%] animate-pulse">
                  <div className="bg-red-600/90 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center gap-1.5 shadow-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                    LIVE ANALYTICS
                  </div>
                </div>

                
                {/* Bottom Stats Overlay */}
                <div className="absolute bottom-4 inset-x-4 z-20 grid grid-cols-3 gap-2">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-xl text-white text-center">
                    <p className="text-[10px] opacity-60">People Count</p>
                    <p className="text-sm font-bold">12</p>
                  </div>
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-xl text-white text-center">
                    <p className="text-[10px] opacity-60">Avg Wait</p>
                    <p className="text-sm font-bold">3m 22s</p>
                  </div>
                  <div className="bg-brand-600/60 backdrop-blur-md border border-brand-500/30 p-2 rounded-xl text-white text-center">
                    <p className="text-[10px] opacity-80">Efficiency</p>
                    <p className="text-sm font-bold">94%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                Your cafe, <span className="text-brand-600">digitized with AI</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Simply connect your existing security cameras to ServeSmart AI. Our advanced YOLOv8 integration instantly transforms video feeds into actionable metrics.
              </p>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl h-fit">
                    <Zap className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xl mb-1">Queue Management</h4>
                    <p className="text-muted-foreground">Automatically track customer wait times and alert staff to open a new register before complaints happen.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-xl h-fit">
                    <Coffee className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xl mb-1">VIP Recognition</h4>
                    <p className="text-muted-foreground">Opted-in loyal customers are recognized as they walk in, immediately pulling up their regular order on the POS.</p>
                  </div>
                </li>
              </ul>

              <div className="mt-10">
                <Link href="/dashboard/ai-monitoring" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white hover:bg-brand-500 rounded-full font-semibold transition-colors shadow-lg shadow-brand-500/20">
                  Try AI Vision Demo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">Loved by coffee shop owners</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
              <div className="flex gap-1 mb-6 text-yellow-400">
                <Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" />
              </div>
              <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
                &quot;ServeSmart transformed how we handle the morning rush. The AI alerting us to open a second register based on the line size has increased throughput by 30%.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-500 overflow-hidden">
                  <img src={getOptimizedUrl("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150", 150)} alt="Sarah J." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Sarah Jenkins</h4>
                  <p className="text-zinc-400 text-sm">Owner, The Daily Grind</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8 transform md:-translate-y-4">
              <div className="flex gap-1 mb-6 text-yellow-400">
                <Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" />
              </div>
              <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
                &quot;Having the POS, online ordering, and inventory all in one place is fantastic. But the computer vision tracking missing stock on the counter is just mind blowing.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-500 overflow-hidden">
                  <img src={getOptimizedUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150", 150)} alt="Marcus T." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Marcus Torres</h4>
                  <p className="text-zinc-400 text-sm">Manager, Bean & Byte</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
              <div className="flex gap-1 mb-6 text-yellow-400">
                <Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" /><Star className="fill-current w-5 h-5" />
              </div>
              <p className="text-zinc-300 text-lg mb-8 leading-relaxed">
                &quot;Our customers love the new menu UI, and my staff loves the POS. It&apos;s so clean and intuitive. We cut training time for new baristas down to just one afternoon.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-500 overflow-hidden">
                  <img src={getOptimizedUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150", 150)} alt="Emily R." className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Emily Rodriguez</h4>
                  <p className="text-zinc-400 text-sm">Founder, Artisan Roasters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-background border-b border-border text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to upgrade your cafe?</h2>
          <p className="text-xl text-muted-foreground mb-10">Join tomorrow&apos;s cafes using ServeSmart AI today. Experience the future of cafe management.</p>
          <Link href="/register" className="inline-flex px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-brand-500/25">
            Join Now
          </Link>
        </div>
      </section>
    </div>
  );
}
