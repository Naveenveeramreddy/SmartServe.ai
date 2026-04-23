"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp, MoreHorizontal, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
    { name: 'Mon', revenue: 0 },
    { name: 'Tue', revenue: 0 },
    { name: 'Wed', revenue: 0 },
    { name: 'Thu', revenue: 0 },
    { name: 'Fri', revenue: 0 },
    { name: 'Sat', revenue: 0 },
    { name: 'Sun', revenue: 0 },
];

const popularItems: any[] = [];

export default function DashboardOverview() {
    const [customersInside, setCustomersInside] = useState(0);
    const [waitTime, setWaitTime] = useState(0);
    const [vipAlerts, setVipAlerts] = useState<any[]>([]);
    
    useEffect(() => {
        // Connect to Realtime AI Event Stream
        const ws = new WebSocket("ws://localhost:8000/ws/realtime/default-room-id");
        
        ws.onopen = () => console.log("Dashboard: Connected to AI Vision Stream");
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                
                // Generic detection update
                if (data.type === "AI_DETECTION_UPDATE") {
                    if (data.metrics) {
                        setCustomersInside(data.metrics.active_customers);
                        setWaitTime(data.metrics.waiting * 2); 
                    }
                    if (data.vip_arrival) {
                        setVipAlerts((prev) => [data.vip_arrival, ...prev].slice(0, 3));
                    }
                }
                
                // Keep support for legacy message types if they still exist
                if (data.type === "CAMERA_METRICS" && data.metrics) {
                    setCustomersInside(data.metrics.active_customers);
                    setWaitTime(data.metrics.waiting * 2);
                }
                if (data.vip_arrival && data.type !== "AI_DETECTION_UPDATE") {
                    setVipAlerts((prev) => [data.vip_arrival, ...prev].slice(0, 3));
                }
            } catch (e) {
                console.error("Failed to parse websocket message", e);
            }
        };
        
        return () => ws.close();
    }, []);

    return (
        <div className="space-y-6">

            {/* VIP Alerts Banner */}
            {vipAlerts.length > 0 && (
                <div className="bg-gradient-to-r from-brand-600 to-brand-400 rounded-2xl p-4 text-white shadow-lg flex flex-col gap-2">
                    <h4 className="font-bold flex items-center gap-2"><span className="animate-pulse h-2 w-2 bg-white rounded-full"></span> VIP Customer Detected</h4>
                    <p className="text-sm">Prepare {vipAlerts[0].favorite} for {vipAlerts[0].name}. (Visit #{vipAlerts[0].visit_history})</p>
                </div>
            )}

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-foreground">$0.00</h3>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-xl text-green-600 dark:text-green-400">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 opacity-50">
                        <TrendingUp className="h-4 w-4" /> 0% change from last week
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Orders Today</p>
                            <h3 className="text-3xl font-bold text-foreground">0</h3>
                        </div>
                        <div className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-xl text-brand-600 dark:text-brand-400">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 opacity-50">
                        <TrendingUp className="h-4 w-4" /> 0% change from yesterday
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Live Store Traffic</p>
                            <h3 className="text-3xl font-bold text-foreground">{customersInside}</h3>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                            <Users className="h-6 w-6 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-sm font-medium text-blue-500 flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" /> Live AI Wait time ~{waitTime}m
                    </p>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Low Stock Alerts</p>
                            <h3 className="text-3xl font-bold text-foreground">0 Items</h3>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-xl text-orange-600 dark:text-orange-400">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic mt-2">
                        No inventory alerts
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart */}
                <div className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-foreground">Revenue Analytics</h3>
                        <select className="bg-muted border border-border text-foreground text-sm rounded-lg focus:ring-brand-500 py-2 px-3 outline-none">
                            <option>Last 7 Days</option>
                            <option>This Month</option>
                            <option>This Year</option>
                        </select>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-[#27272a]" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} tickFormatter={(value) => `$${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Aside Chart */}
                <div className="lg:col-span-1 bg-card border border-border rounded-2xl shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-foreground">Popular Items</h3>
                        <button className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={popularItems} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e4e4e7" className="dark:stroke-[#27272a]" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fill: '#71717a', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                                <Bar dataKey="sales" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
}
