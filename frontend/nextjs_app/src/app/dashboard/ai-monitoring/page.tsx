"use client";

import { useState, useEffect } from "react";
import { Video, ShieldAlert, Cpu, Maximize2, Users, Activity, Pause, Play, Camera } from "lucide-react";
import LiveCamera from "@/components/shared/LiveCamera";

// Simulated AI bounding boxes
const simulatedBoxes = [
    { id: "customer_12", type: "Customer", x: 20, y: 30, w: 15, h: 45, color: "border-blue-500", bg: "bg-blue-500", info: "Wait: 4m" },
    { id: "customer_8", type: "Customer (VIP)", x: 60, y: 25, w: 18, h: 50, color: "border-brand-500", bg: "bg-brand-500", info: "Name: Sarah J." },
    { id: "worker_2", type: "Worker", x: 45, y: 35, w: 12, h: 40, color: "border-green-500", bg: "bg-green-500", info: "Status: Working" },
    { id: "obj_cup", type: "Object - Cup", x: 40, y: 65, w: 5, h: 8, color: "border-yellow-500", bg: "bg-yellow-500", info: "" },
    { id: "obj_phone", type: "Phone", x: 80, y: 45, w: 3, h: 5, color: "border-red-500", bg: "bg-red-500", info: "Usage Alert" },
];

export default function AIMonitoringPage() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [pulseLine, setPulseLine] = useState(0);
    const [detections, setDetections] = useState<any[]>([]);
    const [metrics, setMetrics] = useState({ active_customers: 0, fps: 0, waiting: 0 });
    const [visitors, setVisitors] = useState<any[]>([]);

    // Connect to Realtime AI Event Stream
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8000/ws/realtime/default-room-id");
        
        ws.onopen = () => console.log("AI Monitoring: Connected to AI Vision Stream");
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === "AI_DETECTION_UPDATE") {
                    if (data.detections) setDetections(data.detections);
                    if (data.metrics) setMetrics(data.metrics);
                    if (data.active_visitors) setVisitors(data.active_visitors);
                }
            } catch (e) {
                console.error("Failed to parse websocket message", e);
            }
        };
        
        return () => ws.close();
    }, []);

    // ... (Animate pulse logic remains)

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">

            {/* Main Video Area */}
            <div className="flex-1 flex flex-col bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                    <div className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-brand-600" />
                        <h2 className="font-bold text-foreground">Cam 01: Front Counter</h2>
                        <div className="flex items-center gap-2 px-2 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full ml-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            LIVE
                        </div>
                    </div>
                </div>

                {/* Video Player Container */}
                <div className="relative flex-1 bg-black overflow-hidden group">
                    <LiveCamera className="w-full h-full" />

                    {/* AI Overlay Layer */}
                    <div className="absolute inset-0 z-10">
                        {/* Scanning Line */}
                        {isPlaying && (
                            <div
                                className="absolute w-full h-1 bg-brand-500/50 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-0"
                                style={{ top: `${pulseLine}%` }}
                            ></div>
                        )}

                        {/* Render Bounding Boxes */}
                        {isPlaying && detections.map((box) => (
                            <div
                                key={box.id}
                                className={`absolute border-2 border-brand-500 flex flex-col justify-end transition-all duration-100 linear`}
                                style={{
                                    left: `${box.x}%`,
                                    top: `${box.y}%`,
                                    width: `${box.w}%`,
                                    height: `${box.h}%`,
                                }}
                            >
                                                            {/* Bounding Box Information */}
                                    <div className={`absolute left-0 -top-6 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1 ${box.face_captured ? 'bg-green-600' : 'bg-brand-600'}`}>
                                        {box.face_captured && <ShieldAlert className="h-3 w-3" />}
                                        ID: {box.id} | {box.stay_duration}
                                    </div>
                                {/* Corner Accents */}
                                <div className={`absolute -top-1 -left-1 w-2 h-2 bg-brand-500`}></div>
                                <div className={`absolute -top-1 -right-1 w-2 h-2 bg-brand-500`}></div>
                            </div>
                        ))}
                    </div>

                    {/* Player Controls */}
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <div className="flex items-center gap-4 text-white">
                            <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-brand-400">
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                            </button>
                            <div className="text-sm font-medium">YOLOv8 Nano • Persistent Tracking Active</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar: Visitors & Metrics */}
            <div className="lg:w-80 flex flex-col gap-6">

                {/* Realtime Stats */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Users className="w-5 h-5 text-brand-600" />
                        Live Visitors ({visitors.length})
                    </h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {visitors.map((visitor) => (
                            <div key={visitor.id} className="p-3 bg-muted/50 border border-border rounded-xl">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${visitor.face_captured ? 'bg-green-500' : 'bg-brand-500'}`}></div>
                                            <span className="font-bold text-sm">Visitor #{visitor.id}</span>
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground">{Math.floor(visitor.duration / 60)}m {visitor.duration % 60}s</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {visitor.face_captured && (
                                            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <Camera className="h-3 w-3" /> Face Captured
                                            </span>
                                        )}
                                        {visitor.items && visitor.items.map((item: string) => (
                                            <span key={item} className="bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400 text-[10px] px-1.5 py-0.5 rounded capitalize">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs font-bold text-foreground">
                                        Spend: ${visitor.order_total?.toFixed(2) || "0.00"}
                                    </div>
                            </div>
                        ))}
                        {visitors.length === 0 && (
                            <p className="text-sm text-center py-4 text-muted-foreground italic">No visitors in view</p>
                        )}
                    </div>
                </div>

                {/* Performance */}
                <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Cpu className="w-5 h-5 text-brand-600" />
                        AI Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-muted rounded-lg p-3 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase opacity-70">Traffic</p>
                            <p className="text-xl font-bold mt-1 text-foreground">{metrics.active_customers}</p>
                        </div>
                        <div className="bg-muted rounded-lg p-3 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase opacity-70">Status</p>
                            <p className="text-xl font-bold mt-1 text-green-500">LIVE</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
