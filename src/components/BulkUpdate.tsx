import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student } from '@/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BulkUpdateProps {
    students: Student[];
    onUpdate: (students: Student[]) => void;
}

export const BulkUpdate = ({ students, onUpdate }: BulkUpdateProps) => {
    const handleDownload = () => {
        const ws = XLSX.utils.json_to_sheet(students);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");
        XLSX.writeFile(wb, "hostel_students_data.xlsx");
        toast.success("Excel file downloaded successfully");
    };

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            toast.error("Please upload a valid Excel file (.xlsx or .xls)");
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const bstr = evt.target?.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws) as Student[];

                if (data.length === 0) {
                    toast.error("The uploaded file is empty");
                    return;
                }

                // Validate basic structure (check if 'id' exists in first row)
                if (!('id' in data[0])) {
                    toast.error("Invalid file format. Please use the downloaded template.");
                    return;
                }

                onUpdate(data);
                toast.success(`Successfully loaded ${data.length} students records`);
            } catch (error) {
                console.error("Excel processing error:", error);
                toast.error("Failed to process Excel file");
            }
        };
        reader.readAsBinaryString(file);
        // Reset input value to allow uploading same file again
        e.target.value = '';
    }, [onUpdate]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="space-y-6">
                <div className="flex items-start gap-5">
                    <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-10 h-10 text-success" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-extrabold text-2xl text-foreground tracking-tight">Excel Integration</h3>
                        <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                            Manage your entire database efficiently using standard Excel templates. Download, edit, and re-upload with ease.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <Button
                        variant="outline"
                        className="h-auto py-8 flex flex-col items-center gap-4 bg-white border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-[2rem] transition-all group"
                        onClick={handleDownload}
                    >
                        <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <Download className="w-8 h-8 text-primary" />
                        </div>
                        <div className="text-center">
                            <span className="font-extrabold text-lg block text-foreground">Extract Data</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">Download current database</span>
                        </div>
                    </Button>

                    <div className="relative group">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <Button
                            variant="outline"
                            className="w-full h-full py-8 flex flex-col items-center justify-center gap-4 bg-white border-2 border-dashed border-border/50 hover:border-success/50 hover:bg-success/5 rounded-[2rem] transition-all"
                        >
                            <div className="p-4 bg-success/10 rounded-2xl group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-success" />
                            </div>
                            <div className="text-center">
                                <span className="font-extrabold text-lg block text-foreground">Import List</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">Upload edited template</span>
                            </div>
                        </Button>
                    </div>
                </div>

                <div className="bg-muted/30 border border-border/50 p-6 rounded-3xl space-y-4">
                    <p className="font-bold text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Optimization Guidelines
                    </p>
                    <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                        <li className="flex items-start gap-4">
                            <span className="w-6 h-6 rounded-lg bg-white border border-border flex items-center justify-center text-[10px] font-bold shrink-0">01</span>
                            <span>Do not modify the <strong className="text-foreground">ID</strong> column for existing student records.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-lg bg-white border border-border flex items-center justify-center text-[10px] font-bold shrink-0">02</span>
                            <span>Add new entries by providing unique identifiers in the first column.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-lg bg-white border border-border flex items-center justify-center text-[10px] font-bold shrink-0">03</span>
                            <span>Maintain dates in the <strong className="text-foreground">YYYY-MM-DD</strong> standard format.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
