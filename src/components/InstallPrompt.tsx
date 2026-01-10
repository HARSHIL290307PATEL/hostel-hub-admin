import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, X } from 'lucide-react';
import { toast } from 'sonner';

export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already dismissed or installed
        const hasDismissed = localStorage.getItem('pwa_prompt_dismissed');

        // Check if already in standalone mode (installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://');

        if (hasDismissed || isStandalone) return;

        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsOpen(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            toast.success("Thank you for installing!");
            setDeferredPrompt(null);
            setIsOpen(false);
        } else {
            // User dismissed the native prompt
            // We can decide if we want to show it again next time or respect this as a dismissal
        }
    };

    const handleDismiss = () => {
        // Save to local storage so we don't annoy the user
        localStorage.setItem('pwa_prompt_dismissed', 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && setIsOpen(false)}>
            <DialogContent className="sm:max-w-md w-[90vw] rounded-3xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden">
                <div className="relative p-6 pt-12 flex flex-col items-center text-center">
                    {/* Close button absolute top right */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground/50 hover:text-foreground"
                        onClick={handleDismiss}
                    >
                        <X className="w-4 h-4" />
                    </Button>

                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-violet-600 shadow-xl flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500">
                        <Smartphone className="w-10 h-10 text-white" />
                    </div>

                    <DialogHeader className="space-y-2 mb-2">
                        <DialogTitle className="text-2xl font-extrabold text-foreground">
                            Install App
                        </DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground max-w-[280px] mx-auto">
                            Add Hostel Hub to your home screen for quick access and a better experience.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 w-full mt-8">
                        <Button
                            size="lg"
                            className="w-full rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                            onClick={handleInstall}
                        >
                            <Download className="w-4 h-4" />
                            Install Now
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full rounded-xl font-medium text-muted-foreground hover:bg-muted/50"
                            onClick={handleDismiss}
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
