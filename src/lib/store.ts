import { supabase } from '@/lib/supabase';
import { Student } from '@/types';
import { mockStudents } from '@/data/mockData';

export const getStudents = async (): Promise<Student[]> => {
    try {
        const { data, error } = await supabase
            .from('students')
            .select('*');

        if (error) {
            console.error('Error fetching students:', error);
            // Fallback to empty or mock if disconnected? 
            // Better to throw so we can show error state
            return [];
        }

        return (data as Student[]) || [];
    } catch (error) {
        console.error('Unexpected error fetching students:', error);
        return [];
    }
};

export const addStudent = async (student: Omit<Student, 'id' | 'createdAt'>) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .insert([{
                ...student,
                // Supabase will handle id and createdAt if columns are set up right
                // But type expects them.
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error adding student:', error);
        throw error;
    }
};

export const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
};

export const deleteStudent = async (id: string) => {
    try {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
};

export const upsertStudents = async (students: Student[]) => {
    try {
        const { data, error } = await supabase
            .from('students')
            .upsert(students)
            .select();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error upserting students:', error);
        throw error;
    }
};
