import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { StatCard } from '@/components/StatCard';
import { StudentListItem } from '@/components/StudentListItem';
import { Input } from '@/components/ui/input';
import { dashboardStats } from '@/data/mockData';
import { getStudents } from '@/lib/store';
import { Student } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAlumni, setShowAlumni] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter students based on state
  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roomNo.includes(searchQuery) ||
      student.mobile.includes(searchQuery);

    const matchesFilter = showAlumni ? student.isAlumni : !student.isAlumni;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <AppHeader title="All Student" />

      <main className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Student List Section */}
        <section className="space-y-4">
          <div className="flex p-1 bg-muted/50 rounded-xl">
            <button
              onClick={() => setShowAlumni(false)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${!showAlumni
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Current
            </button>
            <button
              onClick={() => setShowAlumni(true)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${showAlumni
                ? 'bg-white text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Alumni'S
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, room, mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-card/50 backdrop-blur-sm"
              />
            </div>
            <button
              onClick={() => navigate('/students/add')}
              className="px-4 bg-primary text-primary-foreground rounded-xl shadow-lg flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              <span className="font-semibold">Add</span>
            </button>
          </div>

          <div className="space-y-3 pb-safe">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <div
                  key={student.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <StudentListItem
                    student={student}
                    onClick={() => navigate(`/students/${student.id}`)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
