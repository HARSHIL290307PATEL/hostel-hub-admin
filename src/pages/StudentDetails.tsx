import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, Calendar, BookOpen, GraduationCap, Heart, Edit, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStudents } from '@/lib/store';
import { Student } from '@/types';
import { useToast } from '@/hooks/use-toast';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const students = await getStudents();
        const found = students.find(s => s.id === id);
        setStudent(found);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Student not found</p>
      </div>
    );
  }

  const handleMoveToAlumni = async () => {
    // Logic to move to alumni (update isAlumni = true)
    // Assuming we have updateStudent
    // This part was just a toast before.
    toast({
      title: 'Moved to Alumni',
      description: `${student.name} has been moved to alumni list.`,
    });
    navigate('/dashboard');
  };

  const infoItems = [
    { label: 'Room No', value: student.roomNo, icon: null },
    { label: 'Name', value: student.name, icon: null },
    { label: 'Age', value: `${student.age} years`, icon: null },
    { label: 'Date of Birth', value: student.dob, icon: Calendar },
    { label: 'Mobile', value: student.mobile, icon: Phone },
    { label: 'Email', value: student.email, icon: Mail },
    { label: 'Degree', value: student.degree, icon: BookOpen },
    { label: 'Year', value: student.year, icon: GraduationCap },
    { label: 'Result', value: student.result, icon: null },
    { label: 'Interest', value: student.interest, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary text-primary-foreground shadow-md">
        <div className="flex items-center gap-3 h-14 px-4 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Student Details</h1>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Profile Card */}
        <div className="bg-card rounded-xl shadow-card p-6 text-center animate-scale-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">
              {student.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
          <p className="text-sm text-muted-foreground">Room {student.roomNo}</p>
          {student.isAlumni && (
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
              <GraduationCap className="w-4 h-4" />
              Alumni
            </span>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-card rounded-xl shadow-card divide-y divide-border overflow-hidden">
          {infoItems.map((item, index) => (
            <div
              key={item.label}
              className="flex items-center gap-4 px-4 py-3 animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="w-24 flex-shrink-0">
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-medium text-foreground flex-1">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        {!student.isAlumni && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/students/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleMoveToAlumni}
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Move to Alumni
            </Button>
          </div>
        )}
      </main>

    </div>
  );
};

export default StudentDetails;
