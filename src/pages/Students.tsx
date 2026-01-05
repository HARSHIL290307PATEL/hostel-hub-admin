import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { StudentListItem } from '@/components/StudentListItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getStudents } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/types';

const Students = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlumni, setShowAlumni] = useState(false);
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students', error);
      toast({
        title: "Error",
        description: "Failed to load students. Check connection.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roomNo.includes(searchQuery) ||
      student.mobile.includes(searchQuery);

    const matchesFilter = showAlumni ? student.isAlumni : !student.isAlumni;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background pb-6">
      <AppHeader title="Students" />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Search & Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, room, mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showAlumni ? 'default' : 'outline'}
            size="icon"
            onClick={() => setShowAlumni(!showAlumni)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowAlumni(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!showAlumni
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
              }`}
          >
            Current ({students.filter(s => !s.isAlumni).length})
          </button>
          <button
            onClick={() => setShowAlumni(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${showAlumni
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
              }`}
          >
            Alumni ({students.filter(s => s.isAlumni).length})
          </button>
        </div>

        {/* Student List */}
        <div className="space-y-3">
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

        {/* FAB */}
        <Button
          onClick={() => navigate('/students/add')}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </main>

    </div>
  );
};

export default Students;
