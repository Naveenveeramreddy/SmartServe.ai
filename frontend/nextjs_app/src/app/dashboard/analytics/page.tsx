"use client";

import { TrendingUp, Calendar, ArrowDownRight } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const revenueData: any[] = [];
const peakHoursData: any[] = [];
const popularItems: any[] = [];
const leastSellingItems: any[] = [];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Advanced Analytics</h2>
                    <p className="text-muted-foreground">Comprehensive insights into your cafe&apos;s performance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground bg-card hover:bg-muted rounded-xl font-medium transition-colors">
                        <Calendar className="h-4 w-4" /> Today
                    </button>
                </div>
            </div>

            {/* Primary KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Gross Sales</p>
                    <h3 className="text-3xl font-bold text-foreground mb-2">$0.00</h3>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 opacity-50">
                        <TrendingUp className="h-4 w-4" /> 0% vs yesterday
                    </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Total Transactions</p>
                    <h3 className="text-3xl font-bold text-foreground mb-2">0</h3>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 opacity-50">
                        <TrendingUp className="h-4 w-4" /> 0% vs yesterday
                    </p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Avg Ticket Size</p>
                    <h3 className="text-3xl font-bold text-foreground mb-2">$0.00</h3>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 opacity-50">
                        <TrendingUp className="h-4 w-4" /> 0% vs yesterday
                    </p>
                </div>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Daily Revenue Trend */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6 relative overflow-hidden">
                    <h3 className="text-lg font-bold text-foreground mb-6">Today&apos;s Revenue Flow</h3>
                    {revenueData.length === 0 ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                             <TrendingUp className="h-10 w-10 opacity-20 animate-pulse" />
                             <p className="text-sm">Waiting for live transactions...</p>
                        </div>
                    ) : (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-[#27272a]" />
                                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Peak AI Hours */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        AI Monitored Foot Traffic (Peak Hours)
                    </h3>
                    {peakHoursData.length === 0 ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                             <Calendar className="h-10 w-10 opacity-20 animate-pulse" />
                             <p className="text-sm">Waiting for traffic data...</p>
                        </div>
                    ) : (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-[#27272a]" />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                                    <Line type="monotone" dataKey="customers" stroke="#3b82f6" strokeWidth={3} dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Popular Items Pie */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-foreground mb-6">Popular Items Share</h3>
                    {popularItems.length === 0 ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                             <div className="h-10 w-10 border-4 border-muted border-t-brand-500 rounded-full animate-spin"></div>
                             <p className="text-sm">Calculating menu popularity...</p>
                        </div>
                    ) : (
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={popularItems}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                    >
                                        {popularItems.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Least Selling Items Bar */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-foreground">Least Selling Items Action Set</h3>
                    </div>
                    {leastSellingItems.length === 0 ? (
                        <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground gap-2">
                             <p className="text-sm">No items flagged for removal yet.</p>
                        </div>
                    ) : (
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={leastSellingItems} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e4e4e7" className="dark:stroke-[#27272a]" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fill: '#71717a', fontSize: 12 }} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                                    <Bar dataKey="sales" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
