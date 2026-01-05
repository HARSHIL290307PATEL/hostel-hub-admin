import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Trash2, Edit, UserX } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student } from '@/types';
import { StudentListItem } from '@/components/StudentListItem';
import { BulkUpdate } from '@/components/BulkUpdate';
import { toast } from 'sonner';
import { getStudents, deleteStudent, upsertStudents } from '@/lib/store';

const Update = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('single');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<Student[]>([]);

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

  const filteredStudents = students.filter(student => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.id.toLowerCase().includes(query) ||
      student.roomNo.toLowerCase().includes(query)
    );
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        const updatedList = students.filter(s => s.id !== id);
        setStudents(updatedList);
        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleUpdate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/students/${id}`);
  };

  const handleBulkUpdate = async (updatedStudents: Student[]) => {
    try {
      await upsertStudents(updatedStudents);
      setStudents(updatedStudents); // Ideally fetch fresh
      setActiveTab('single');
      toast.success('List updated. Switched to view mode.');
    } catch (error) {
      toast.error('Failed to bulk update');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Update Records" />

      <main className="p-4 max-w-7xl mx-auto space-y-6">
        <Tabs defaultValue="single" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="single">Single Update & View</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Update (Excel)</TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by ID, Name or Room No..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <div key={student.id} className="relative group">
                    <StudentListItem
                      student={student}
                      onClick={() => navigate(`/students/${student.id}`)}
                      hideContactActions={true}
                    />
                    {/* Action Overlay */}
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/80 backdrop-blur-sm p-1 rounded-lg">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={(e) => handleUpdate(student.id, e)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Update
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => handleDelete(student.id, e)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <UserX className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  {searchQuery ? `No students found matching "${searchQuery}"` : 'No students found.'}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="bulk">
            <BulkUpdate students={students} onUpdate={handleBulkUpdate} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Update;
