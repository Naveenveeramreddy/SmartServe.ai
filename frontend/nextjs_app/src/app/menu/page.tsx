import { ShoppingBag, Plus } from "lucide-react";
import Link from "next/link";
import { getOptimizedUrl } from "@/lib/cloudinary";

// Mock data (would come from DB in production)
const menuCategories = [
    {
        name: "Coffee",
        items: [
            { id: 1, name: "Artisan Latte", desc: "Rich espresso balanced with steamed milk.", price: 4.50, img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800" },
            { id: 2, name: "Mocha Macchiato", desc: "Espresso with dark mocha sauce, velvety milk.", price: 5.25, img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800" },
            { id: 3, name: "Flat White", desc: "Ristretto shots with perfectly steamed whole milk.", price: 4.25, img: "https://images.unsplash.com/photo-1582046424915-0dd22e0e0bb1?q=80&w=800" },
            { id: 4, name: "Americano", desc: "Espresso shots topped with hot water create a light layer of crema.", price: 3.25, img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=800" }
        ]
    },
    {
        name: "Cold Drinks",
        items: [
            { id: 5, name: "Nitro Cold Brew", desc: "Our signature cold brew infused with nitrogen.", price: 4.95, img: "https://images.unsplash.com/photo-1517701550927-30cfcb64db10?q=80&w=800" },
            { id: 6, name: "Iced Matcha Latte", desc: "Smooth and creamy matcha sweetened just right.", price: 5.50, img: "https://images.unsplash.com/photo-1536420121509-0021b6d13038?q=80&w=800" },
            { id: 7, name: "Peach Iced Tea", desc: "Black tea infused with ripe peach notes, served over ice.", price: 3.95, img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800" },
            { id: 8, name: "Mango Smoothie", desc: "Real mango puree blended with yogurt.", price: 6.00, img: "https://images.unsplash.com/photo-1553530666-ba11a91e5509?q=80&w=800" }
        ]
    },
    {
        name: "Pastries",
        items: [
            { id: 9, name: "Butter Croissant", desc: "Classic, flaky, buttery pastry baked fresh.", price: 3.75, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800" },
            { id: 10, name: "Blueberry Muffin", desc: "Loaded with wild blueberries and a crumb topping.", price: 3.45, img: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=800" },
            { id: 11, name: "Chocolate Danish", desc: "Flaky dough wrapped around dark chocolate.", price: 4.10, img: "https://images.unsplash.com/photo-1620921575452-94f71a742cb3?q=80&w=800" }
        ]
    },
    {
        name: "Sandwiches",
        items: [
            { id: 12, name: "Turkey Pesto Panini", desc: "Roasted turkey breast, provolone, and basil pesto.", price: 8.50, img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800" },
            { id: 13, name: "Breakfast Sandwich", desc: "Bacon, egg, and cheddar cheese on an artisan bun.", price: 6.50, img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800" },
            { id: 14, name: "Avocado Toast", desc: "Thick cut sourdough with mashed avocado and cherry tomatoes.", price: 7.25, img: "https://images.unsplash.com/photo-1618219875151-518296d8e23f?q=80&w=800" }
        ]
    }
];

export default function MenuPage() {
    return (
        <div className="bg-background min-h-screen pb-24">
            {/* Page Header */}
            <div className="bg-brand-950 text-white py-24 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-900 rounded-l-[100%] opacity-20 blur-3xl transform translate-x-1/3"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Our Menu</h1>
                    <p className="text-lg text-brand-100/80 max-w-2xl mx-auto">
                        Order ahead to skip the line. Earn reward points on every purchase.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Sticky Sidebar Categories */}
                <div className="hidden md:block col-span-1">
                    <div className="sticky top-28 bg-card border border-border rounded-2xl p-4 shadow-sm">
                        <h3 className="font-bold text-foreground mb-4 uppercase text-xs tracking-wider px-4">Categories</h3>
                        <ul className="space-y-1">
                            {menuCategories.map((cat) => (
                                <li key={cat.name}>
                                    <a
                                        href={`#${cat.name.toLowerCase().replace(" ", "-")}`}
                                        className="block px-4 py-2 text-muted-foreground hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-brand-900/20 dark:hover:text-brand-400 font-medium rounded-lg transition-colors"
                                    >
                                        {cat.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="col-span-1 md:col-span-3 space-y-16">
                    {menuCategories.map((category) => (
                        <div key={category.name} id={category.name.toLowerCase().replace(" ", "-")} className="scroll-mt-28">
                            <h2 className="text-3xl font-bold text-foreground mb-8 pb-4 border-b border-border flex items-center gap-3">
                                {category.name}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {category.items.map((item) => (
                                    <div key={item.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-brand-200 dark:hover:border-brand-800 transition-all flex flex-col h-full">
                                        <div className="relative h-56 w-full overflow-hidden bg-muted">
                                            <img
                                                src={getOptimizedUrl(item.img, 400)}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                                                ${item.price.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-brand-600 transition-colors">{item.name}</h3>
                                            <p className="text-muted-foreground text-sm mb-6 flex-grow">{item.desc}</p>

                                            <button className="w-full flex items-center justify-center gap-2 py-3 bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white dark:bg-brand-900/30 dark:hover:bg-brand-600 dark:text-brand-400 dark:hover:text-white rounded-xl font-semibold transition-all group/btn">
                                                <Plus className="h-5 w-5" /> Add to Order
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Mobile Floating Cart Button */}
            <div className="fixed bottom-6 w-full px-4 md:hidden z-40">
                <Link href="/cart" className="w-full bg-brand-600 shadow-xl text-white font-bold p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        <span>0 Items</span>
                    </div>
                    <span>View Cart</span>
                </Link>
            </div>
        </div>
    );
}
