"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

export default function LiveCamera({ className = "" }: { className?: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const startCamera = async () => {
        setLoading(true);
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            setError(err.name === "NotAllowedError" ? "Camera permission denied" : "Could not access camera");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (error) {
        return (
            <div className={`flex flex-col items-center justify-center bg-zinc-900 text-white p-6 rounded-2xl ${className}`}>
                <CameraOff className="w-12 h-12 text-zinc-600 mb-4" />
                <p className="text-sm font-medium mb-4">{error}</p>
                <button 
                    onClick={startCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded-xl text-xs font-bold transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={`relative bg-black rounded-2xl overflow-hidden ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-brand-600/30 border-t-brand-600 rounded-full animate-spin"></div>
                        <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Initializing AI Feed...</p>
                    </div>
                </div>
            )}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
            />
            {/* UI Overlays could go here or in parent */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-white tracking-wider">AI OPTIMIZED FEED</span>
            </div>
        </div>
    );
}
