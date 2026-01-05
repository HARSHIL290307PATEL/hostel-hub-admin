import React from 'react';
import { ChevronRight, GraduationCap, Phone } from 'lucide-react';
import { Student } from '@/types';
import { Button } from '@/components/ui/button';

interface StudentListItemProps {
  student: Student;
  onClick: () => void;
  hideContactActions?: boolean;
  whatsappMessage?: string;
}

export const StudentListItem = ({ student, onClick, hideContactActions = false, whatsappMessage }: StudentListItemProps) => {
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${student.mobile}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Remove all non-numeric characters for the WhatsApp API
    const cleanNumber = student.mobile.replace(/[^0-9]/g, '');
    const url = whatsappMessage
      ? `https://wa.me/${cleanNumber}?text=${encodeURIComponent(whatsappMessage)}`
      : `https://wa.me/${cleanNumber}`;
    window.open(url, '_blank');
  };

  return (
    <div
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-card rounded-xl shadow-card transition-all duration-200 hover:shadow-card-hover active:scale-[0.99] animate-fade-in text-left cursor-pointer group"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="text-primary font-semibold text-sm">
          {student.roomNo}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate">{student.name}</h3>
          {student.isAlumni && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-medium rounded-full">
              <GraduationCap className="w-3 h-3" />
              Alumni
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{student.mobile}</p>
      </div>

      <div className="flex items-center gap-2">
        {!hideContactActions && (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="h-10 w-10 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={handleWhatsApp}
            >
              <img src="/whatsapp-icon.png" alt="WhatsApp" className="w-7 h-7 object-contain" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={handleCall}
            >
              <Phone className="w-5 h-5" />
            </Button>
          </>
        )}
        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};
