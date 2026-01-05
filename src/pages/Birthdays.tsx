import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cake } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { StudentListItem } from '@/components/StudentListItem';
import { getStudents } from '@/lib/store';
import { Student } from '@/types';

const Birthdays = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getStudents();
            setStudents(data);
        };
        fetchStudents();
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

    return (
        <div className="min-h-screen bg-background pb-20 relative">
            <AppHeader title="Birthdays" />

            <main className="p-4 space-y-6 max-w-7xl mx-auto">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xl font-semibold text-primary">
                        <Cake className="w-6 h-6" />
                        <h2>Today's Birthdays ({birthdayStudents.length})</h2>
                    </div>

                    <div className="space-y-3 pb-safe">
                        {birthdayStudents.length > 0 ? (
                            birthdayStudents.map((student, index) => (
                                <div
                                    key={student.id}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <StudentListItem
                                        student={student}
                                        onClick={() => navigate(`/students/${student.id}`)}
                                        whatsappMessage="HAPPY BIRTHDAY"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-2">
                                <Cake className="w-12 h-12 text-muted-foreground/30" />
                                <p>No birthdays today.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Birthdays;
