"use client";

import { UserSquare2, Search, Smartphone, Watch, AlertCircle } from "lucide-react";

const staffList: any[] = [];

export default function StaffPage() {
    return (
        <div className="space-y-6">

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Worker Management</h2>
                    <p className="text-muted-foreground">AI-powered tracking of staff performance and shifts.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Active Staff</p>
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <UserSquare2 className="h-6 w-6 text-brand-600" /> 0 / 0
                    </h3>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Avg Phone Usage (Today)</p>
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Smartphone className="h-6 w-6 text-red-500" /> 0m
                    </h3>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Avg Idle Time</p>
                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Watch className="h-6 w-6 text-orange-500" /> 0m
                    </h3>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border p-4 rounded-2xl flex gap-4 shadow-sm items-center">
                <div className="relative flex-1">
                    <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search staff members..."
                        className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 text-muted-foreground border-b border-border text-sm">
                                <th className="font-semibold p-4 w-12"></th>
                                <th className="font-semibold p-4">Name</th>
                                <th className="font-semibold p-4">Role</th>
                                <th className="font-semibold p-4">Current Shift</th>
                                <th className="font-semibold p-4 text-center">AI: Phone Time</th>
                                <th className="font-semibold p-4 text-center">AI: Idle Time</th>
                                <th className="font-semibold p-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {staffList.map((staff) => (
                                <tr key={staff.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="p-4 text-center">
                                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                                            {staff.name.charAt(0)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-semibold text-foreground">{staff.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono">{staff.id}</p>
                                    </td>
                                    <td className="p-4 text-sm text-foreground">{staff.role}</td>
                                    <td className="p-4 text-sm text-muted-foreground">{staff.shift}</td>
                                    <td className="p-4 text-center">
                                        <span className={`text-sm font-bold ${staff.phoneUsage.includes("1h") ? "text-red-500" : "text-muted-foreground"}`}>
                                            {staff.phoneUsage}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-sm font-medium text-muted-foreground">{staff.idle}</td>
                                    <td className="p-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${staff.status === 'Working' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800' :
                                                staff.status === 'Warning' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800' :
                                                    'bg-muted text-muted-foreground border border-border'
                                            }`}>
                                            {staff.status === 'Warning' && <AlertCircle className="w-3 h-3" />}
                                            {staff.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
