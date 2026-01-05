import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getStudents, addStudent, updateStudent } from '@/lib/store';
import { Student } from '@/types';
import { cn } from '@/lib/utils';

const AddStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    roomNo: '',
    name: '',
    age: '',
    dob: '',
    mobile: '',
    email: '',
    degree: '',
    year: '',
    result: '',
    interest: '',
  });

  useEffect(() => {
    const fetchStudent = async () => {
      if (isEditMode && id) {
        try {
          const students = await getStudents();
          const student = students.find(s => s.id === id);
          if (student) {
            setFormData({
              roomNo: student.roomNo || '',
              name: student.name || '',
              age: student.age.toString() || '',
              dob: student.dob || '',
              mobile: student.mobile || '',
              email: student.email || '',
              degree: student.degree || '',
              year: student.year || '',
              result: student.result || '',
              interest: student.interest || '',
            });
          } else {
            // Handle not found
            toast({ title: "Error", description: "Student not found", variant: "destructive" });
            navigate('/dashboard');
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchStudent();
  }, [id, isEditMode, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        await updateStudent(id, {
          ...formData,
          age: Number(formData.age),
        });
        toast({
          title: 'Student Updated',
          description: `${formData.name} has been updated successfully.`,
        });
      } else {
        // New Student
        await addStudent({
          ...formData,
          age: Number(formData.age),
          isAlumni: false,
        });
        toast({
          title: 'Student Added',
          description: `${formData.name} has been added successfully.`,
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to save student. Check console/network.',
        variant: 'destructive',
      });
    }
  };

  const fields = [
    { name: 'roomNo', label: 'Room Number', type: 'text', placeholder: '101' },
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter name' },
    { name: 'age', label: 'Age', type: 'number', placeholder: '20' },
    { name: 'dob', label: 'Date of Birth', type: 'date', placeholder: '' },
    { name: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '+91 9876543210' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'email@example.com' },
    { name: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Tech' },
    { name: 'year', label: 'Year', type: 'text', placeholder: '2nd Year' },
    { name: 'result', label: 'Result/CGPA', type: 'text', placeholder: '8.5 CGPA' },
    { name: 'interest', label: 'Interests', type: 'text', placeholder: 'Sports, Music' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 relative animate-fade-in">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-soft">
        <div className="flex items-center gap-4 h-16 px-4 max-w-7xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{isEditMode ? 'Edit Student Details' : 'Registration'}</h1>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-5xl mx-auto space-y-8 mt-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-primary" />
            {isEditMode ? 'Update Information' : 'New Admission'}
          </h2>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Fill in the details below to proceed</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white border border-border/50 rounded-3xl shadow-soft p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {fields.map((field, index) => (
              <div
                key={field.name}
                className="space-y-2 animate-slide-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Label htmlFor={field.name} className="text-sm font-bold text-foreground/80 ml-1">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  className="h-12 bg-background/50 border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl transition-all font-medium"
                  required
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-soft hover:shadow-soft-lg hover:scale-[1.01] active:scale-[0.99] transition-all bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isEditMode ? 'Save Changes' : 'Confirm Admission'}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AddStudent;
