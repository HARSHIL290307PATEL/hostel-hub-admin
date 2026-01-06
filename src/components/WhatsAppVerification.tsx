import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';

interface WhatsAppVerificationProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WhatsAppVerification({ open, onOpenChange }: WhatsAppVerificationProps) {
    const [socket, setSocket] = useState<any>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 120 seconds for expiring logic
    const [status, setStatus] = useState<'connecting' | 'scan' | 'expired' | 'verified'>('connecting');

    useEffect(() => {
        if (!open) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WhatsApp server');
            setStatus('connecting');
        });

        newSocket.on('qr', (qr: string) => {
            console.log('QR Code received');
            setQrCode(qr);
            setStatus('scan');
            setTimeLeft(120); // Reset timer on new QR
        });

        newSocket.on('ready', () => {
            console.log('WhatsApp is ready!');
            setIsConnected(true);
            setStatus('verified');
            setQrCode(null);
        });

        newSocket.on('authenticated', () => {
            console.log('Authenticated');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
        });


        return () => {
            newSocket.disconnect();
        };
    }, [open]);

    // Timer logic
    useEffect(() => {
        if (status !== 'scan' || !open) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setStatus('expired');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [status, open]);

    const handleRegenerate = () => {
        setStatus('connecting');
        setQrCode(null);
        if (socket) {
            socket.emit('regenerate_qr');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Verify WhatsApp</DialogTitle>
                    <DialogDescription>
                        Scan the QR code with your WhatsApp to verify and enable automation features.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-6 space-y-4 min-h-[300px]">
                    {status === 'connecting' && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Connecting to WhatsApp Client...</p>
                        </div>
                    )}

                    {status === 'scan' && qrCode && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm border">
                                <QRCode value={qrCode} size={200} />
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                Scan within <span className="font-bold text-foreground">{timeLeft}s</span>
                            </p>
                        </div>
                    )}

                    {status === 'expired' && (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-[200px] h-[200px] bg-muted flex items-center justify-center rounded-lg border border-dashed">
                                <p className="text-sm text-muted-foreground">QR Code Expired</p>
                            </div>
                            <Button onClick={handleRegenerate} variant="outline" className="gap-2">
                                <RefreshCw className="w-4 h-4" />
                                Regenerate QR
                            </Button>
                        </div>
                    )}

                    {status === 'verified' && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-semibold text-lg text-green-700">Verified Successfully</h3>
                                <p className="text-sm text-muted-foreground">Your WhatsApp is now connected.</p>
                            </div>
                            <Button onClick={() => onOpenChange(false)} variant="default" className="mt-2 bg-green-600 hover:bg-green-700">
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
