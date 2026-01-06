import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cake, Sparkles, Send } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { StudentListItem } from '@/components/StudentListItem';
import { getStudents } from '@/lib/store';
import { Student } from '@/types';
import { io } from 'socket.io-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Birthdays = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [sendingState, setSendingState] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getStudents();
            setStudents(data);
        };
        fetchStudents();

        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WhatsApp server');
        });

        newSocket.on('message_response', (response: any) => {
            if (response.success) {
                toast.success(`Birthday wish sent to ${response.number}!`);
                setSendingState(prev => ({ ...prev, [response.number]: false })); // Reset loading
            } else {
                toast.error(`Failed to send to ${response.number}: ${response.error}`);
                setSendingState(prev => ({ ...prev, [response.number]: false }));
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Filter students whose birthday is TODAY
    const birthdayStudents = students.filter(student => {
        if (!student.dob) return false;

        const today = new Date();
        const currentMonth = today.getMonth() + 1; // 0-indexed
        const currentDay = today.getDate();

        const [year, month, day] = student.dob.split('-').map(Number);

        return month === currentMonth && day === currentDay;
    });

    const handleSendWish = (student: Student) => {
        if (!socket) {
            toast.error("Not connected to WhatsApp server");
            return;
        }

        // Remove '+' if present, ensure country code
        let number = student.mobile.replace(/\D/g, '');
        if (number.length === 10) number = '91' + number; // Default to India 91 if 10 digits

        const message = `🎉 Happy Birthday ${student.name}! 🎂\n\nWishing you a day filled with happiness and success!\n\n- Hostel Hub Team`;

        setSendingState(prev => ({ ...prev, [number]: true }));
        socket.emit('send_message', { number, message });
    };

    return (
        <div className="min-h-screen bg-background pb-20 relative animate-fade-in">
            <AppHeader title="Hostel Hub" />

            <main className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="space-y-1">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                        <Cake className="w-8 h-8 text-primary" />
                        Birthdays
                    </h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Celebrate with your students today</p>
                </div>

                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground/80 flex items-center gap-2">
                            Today's Celeberations
                            <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full border border-primary/10">
                                {birthdayStudents.length}
                            </span>
                        </h3>
                    </div>

                    <div className="space-y-4 pb-safe">
                        {birthdayStudents.length > 0 ? (
                            birthdayStudents.map((student, index) => (
                                <div
                                    key={student.id}
                                    className="animate-slide-in group relative"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <StudentListItem
                                        student={student}
                                        onClick={() => navigate(`/students/${student.id}`)}
                                        whatsappMessage="Wishing you a very Happy Birthday! 🎂✨"
                                        hideContactActions={true}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden group-hover:block sm:block">
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            className="gap-2 shadow-sm hover:bg-green-100 hover:text-green-700 transition-all"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSendWish(student);
                                            }}
                                            disabled={sendingState[student.mobile?.replace(/\D/g, '').length === 10 ? '91' + student.mobile?.replace(/\D/g, '') : student.mobile?.replace(/\D/g, '') || '']}
                                        >
                                            <Send className="w-4 h-4" />
                                            {sendingState[student.mobile?.replace(/\D/g, '').length === 10 ? '91' + student.mobile?.replace(/\D/g, '') : student.mobile?.replace(/\D/g, '') || ''] ? 'Sending...' : 'Send Wish'}
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white/50 border border-dashed border-border rounded-3xl animate-fade-in flex flex-col items-center justify-center gap-3">
                                <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center animate-pulse">
                                    <Sparkles className="w-10 h-10 text-muted-foreground/30" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">No birthdays today</h3>
                                    <p className="text-muted-foreground mt-1">Check back tomorrow for more celebrations!</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Birthdays;
