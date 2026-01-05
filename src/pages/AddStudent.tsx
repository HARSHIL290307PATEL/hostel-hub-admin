import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getStudents, addStudent, updateStudent } from '@/lib/store';
import { Student } from '@/types';

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
    { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
    { name: 'degree', label: 'Degree', type: 'text', placeholder: 'B.Tech' },
    { name: 'year', label: 'Year', type: 'text', placeholder: '2nd Year' },
    { name: 'result', label: 'Result/CGPA', type: 'text', placeholder: '8.5 CGPA' },
    { name: 'interest', label: 'Interests', type: 'text', placeholder: 'Sports, Music' },
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
          <h1 className="text-lg font-semibold">{isEditMode ? 'Edit Student' : 'Add Student'}</h1>
        </div>
      </header>

      <main className="p-4 max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-card rounded-xl shadow-card p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div
                key={field.name}
                className="space-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>

          <Button type="submit" size="lg" className="w-full">
            {isEditMode ? 'Update Student' : 'Add Student'}
          </Button>
        </form>
      </main>

    </div>
  );
};

export default AddStudent;
