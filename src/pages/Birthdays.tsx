import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cake, Sparkles, Send, Settings } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { getStudents, getSetting, updateSetting } from '@/lib/store';
import { Student } from '@/types';
import api from '@/lib/api';
import { toast } from 'sonner';

const Birthdays = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [messageTemplate, setMessageTemplate] = useState("Happy Birthday, {name}! 🎉🎂 Wishing you a fantastic day filled with joy and happiness!");
    const [isEditingTemplate, setIsEditingTemplate] = useState(false);
    const [tempTemplate, setTempTemplate] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getStudents();
                setStudents(data || []);
            } catch (error) {
                setStudents([]);
            }
        };
        fetchStudents();
    }, []);

    useEffect(() => {
        const loadTemplate = async () => {
            const saved = await getSetting('birthday_template');
            if (saved) setMessageTemplate(saved);
        };
        loadTemplate();
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

    const handleSaveTemplate = async () => {
        try {
            await updateSetting('birthday_template', tempTemplate);
            setMessageTemplate(tempTemplate);
            setIsEditingTemplate(false);
            toast.success("Birthday template updated!");
        } catch (error) {
            toast.error("Failed to save template");
        }
    };

    return (
        <div className="min-h-screen pb-20 relative animate-fade-in">
            <AppHeader title="Hari-Saurabh Hostel" />

            <main className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="relative overflow-hidden rounded-3xl p-8 glass-card animate-slide-in flex items-center justify-between">
                    <div className="absolute inset-0 gradient-primary opacity-5"></div>
                    <div className="relative z-10 space-y-2">
                        <h2 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                            <Cake className="w-8 h-8 text-primary" />
                            Birthdays
                        </h2>
                        <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Celebrate with your students today</p>
                    </div>


                </div>

                {isEditingTemplate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 space-y-6 animate-in zoom-in-95 duration-200">
                            <div>
                                <h3 className="text-xl font-bold">Edit Message Template</h3>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-sm text-muted-foreground">
                                        Customize the birthday wish.
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 text-xs font-mono bg-muted/50 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
                                        onClick={() => setTempTemplate(prev => prev + "{name}")}
                                    >
                                        {`{name}`}
                                    </Button>
                                </div>
                            </div>
                            <textarea
                                value={tempTemplate}
                                onChange={(e) => setTempTemplate(e.target.value)}
                                className="w-full h-32 p-4 rounded-xl border bg-muted/30 focus:ring-2 ring-primary/20 outline-none resize-none text-sm"
                                placeholder="Type your message..."
                            />
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 rounded-xl font-bold"
                                    onClick={() => setIsEditingTemplate(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 rounded-xl font-bold bg-primary text-white hover:bg-primary/90"
                                    onClick={handleSaveTemplate}
                                >
                                    Save Template
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <section className="space-y-6 animate-slide-up">
                    <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-foreground/80">
                            Today's Celebrations
                        </h3>
                        <span className="px-3 py-1 gradient-primary text-white text-xs font-bold rounded-full shadow-soft">
                            {birthdayStudents.length}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-sm border-primary/20 hover:bg-white hover:text-primary transition-all shadow-sm"
                            onClick={() => {
                                setTempTemplate(messageTemplate);
                                setIsEditingTemplate(true);
                            }}
                        >
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-4 pb-safe">
                        {birthdayStudents.length > 0 ? (
                            birthdayStudents.map((student, index) => (
                                <div
                                    key={student.id}
                                    className="animate-slide-in w-full flex items-center justify-between p-5 bg-white border border-border/50 rounded-2xl shadow-soft transition-all duration-300 hover:shadow-soft-lg"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div
                                        className="flex items-center gap-4 flex-1 cursor-pointer min-w-0"
                                        onClick={() => navigate(`/students/${student.id}`)}
                                    >
                                        <div className="w-14 h-14 rounded-2xl bg-primary flex flex-col items-center justify-center shadow-soft shrink-0">
                                            <span className="text-white font-bold text-lg leading-none">{student.roomNo}</span>
                                            <span className="text-white/70 font-bold text-[10px] uppercase tracking-tighter mt-0.5">Room</span>
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="font-bold text-lg text-foreground truncate">{student.name}</h3>
                                            <p className="text-sm font-medium text-muted-foreground truncate">{student.mobile || 'No Mobile'}</p>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (!student.mobile) {
                                                toast.error("No mobile number found");
                                                return;
                                            }
                                            try {
                                                const message = messageTemplate.replace('{name}', student.name);
                                                toast.info(`Sending wish to ${student.name}...`);

                                                await api.post('/api/send', {
                                                    number: student.mobile,
                                                    message: message
                                                });
                                                toast.success(`Birthday wish sent to ${student.name}!`);
                                            } catch (error) {
                                                toast.error(`Failed to send wish to ${student.name}`);
                                            }
                                        }}
                                        className="rounded-xl font-bold gap-2 bg-primary text-white hover:bg-primary/90 shadow-md"
                                    >
                                        <Send className="w-4 h-4" /> Send Wish
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 glass-card border-dashed border-2 border-border/50 rounded-3xl animate-fade-in flex flex-col items-center justify-center gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center animate-pulse">
                                    <Sparkles className="w-10 h-10 text-muted-foreground/40" />
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
        </div >
    );
};

export default Birthdays;
