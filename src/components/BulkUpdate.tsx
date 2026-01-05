import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Download, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student } from '@/types';
import { toast } from 'sonner';

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
        <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 shadow-sm border space-y-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Bulk Update via Excel</h3>
                        <p className="text-muted-foreground text-sm mt-1">
                            Download the current data, edit in Excel, and upload to update multiple records at once.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Button
                        variant="outline"
                        className="h-auto py-4 flex flex-col items-center gap-2 border-dashed border-2 hover:bg-muted/50"
                        onClick={handleDownload}
                    >
                        <Download className="w-6 h-6 text-primary" />
                        <div className="text-center">
                            <span className="font-medium block">Download Excel</span>
                            <span className="text-xs text-muted-foreground">Current Database</span>
                        </div>
                    </Button>

                    <div className="relative">
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <Button
                            variant="outline"
                            className="w-full h-full min-h-[5rem] flex flex-col items-center justify-center gap-2 border-dashed border-2 hover:bg-muted/50"
                        >
                            <Upload className="w-6 h-6 text-primary" />
                            <div className="text-center">
                                <span className="font-medium block">Upload Edited Excel</span>
                                <span className="text-xs text-muted-foreground">Click or Drag & Drop</span>
                            </div>
                        </Button>
                    </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg text-xs space-y-2">
                    <p className="font-medium">Instructions:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>Do not modify the <strong>id</strong> column for existing students.</li>
                        <li>Add new rows with unique IDs to add new students.</li>
                        <li>Ensure dates are in <strong>YYYY-MM-DD</strong> format.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
