import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = "https://whatsapp-api.onrender.com";

export default function Whatsapp() {
    const [data, setData] = useState<{ status: string; qr?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        // Initial start session to ensure backend is ready/generating
        fetch(`${API_BASE}/api/session/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: "harshil" })
        }).catch(console.error);

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`${API_BASE}/api/qr/harshil`);
                if (!res.ok) throw new Error(`Server Error: ${res.status}`);

                const result = await res.json();
                setData(result);
                setLoading(false);
                setError("");
            } catch (err: any) {
                setLoading(false);
                setError("Server Unreachable");
                console.error("Poll Error:", err);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [retryCount]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "connected": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "qr": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "connected": return "Connected";
            case "qr": return "Scan QR Code";
            case "waiting": return "Waiting for Server...";
            default: return "Initializing";
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center animate-fade-in">
            <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-soft-lg border-white/40 space-y-8">

                <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        WhatsApp Verification
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium">
                        Link your device to enable automation
                    </p>
                </div>

                {/* Status Indicator */}
                <div className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-semibold transition-all duration-300",
                    error ? "text-red-500 bg-red-500/10 border-red-500/20" : getStatusColor(data?.status || "")
                )}>
                    {error ? (
                        <AlertCircle className="w-5 h-5" />
                    ) : data?.status === "connected" ? (
                        <CheckCircle2 className="w-5 h-5" />
                    ) : (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    <span>{error || getStatusText(data?.status || "")}</span>
                </div>

                {/* content area */}
                <div className="min-h-[250px] flex flex-col items-center justify-center rounded-2xl bg-white/50 border-2 border-dashed border-slate-200 p-4 relative overflow-hidden">
                    {error ? (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground max-w-[200px]">
                                Unable to connect to WhatsApp Server. It might be offline or sleeping.
                            </p>
                            <button
                                onClick={() => setRetryCount(c => c + 1)}
                                className="px-4 py-2 text-xs font-bold bg-primary text-white rounded-lg shadow-soft hover:shadow-soft-lg transition-all"
                            >
                                Retry Connection
                            </button>
                        </div>
                    ) : data?.status === "connected" ? (
                        <div className="text-center space-y-4 animate-scale-in">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                            <p className="font-bold text-foreground">Device is Linked!</p>
                        </div>
                    ) : data?.qr ? (
                        <div className="space-y-4 animate-slide-in">
                            <img
                                src={data.qr}
                                alt="Scan QR"
                                className="w-64 h-64 object-contain rounded-xl shadow-md border-4 border-white"
                            />
                            <p className="text-xs text-muted-foreground font-medium animate-pulse">
                                QR code refreshes automatically
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                            <p className="text-sm text-muted-foreground font-medium">Generating QR...</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
