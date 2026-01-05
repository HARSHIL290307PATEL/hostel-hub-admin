import { useState } from 'react';
import { DoorOpen, CreditCard, CheckSquare, ChevronRight, Plus, Tags } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { mockCategories } from '@/data/mockData';
import { cn } from '@/lib/utils';

type CategoryType = 'room' | 'fee' | 'task';

const categoryTabs = [
  { type: 'room' as CategoryType, label: 'Room', icon: DoorOpen },
  { type: 'fee' as CategoryType, label: 'Fee', icon: CreditCard },
  { type: 'task' as CategoryType, label: 'Task', icon: CheckSquare },
];

const Categories = () => {
  const [activeTab, setActiveTab] = useState<CategoryType>('room');

  const filteredCategories = mockCategories.filter(cat => cat.type === activeTab);

  return (
    <div className="min-h-screen bg-background pb-20 relative animate-fade-in">
      <AppHeader title="Hostel Hub" />

      <main className="p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Tags className="w-8 h-8 text-primary" />
            Categories
          </h2>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Organize and manage your hostel data</p>
        </div>

        {/* Tabs */}
        <div className="flex p-1.5 bg-muted/30 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm w-full">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                  isActive
                    ? "bg-primary text-white shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category List */}
        <div className="space-y-4 mb-20">
          {filteredCategories.map((category, index) => (
            <div
              key={category.id}
              className="flex items-center gap-4 p-5 bg-white border border-border/50 rounded-2xl shadow-soft transition-all duration-300 hover:shadow-soft-lg group animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <span className="text-primary font-bold text-xl">
                  {category.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-foreground tracking-tight">{category.name}</h3>
                {category.description && (
                  <p className="text-sm font-medium text-muted-foreground mt-0.5">{category.description}</p>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {/* FAB */}
        <Button
          className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl shadow-soft-lg bg-primary hover:bg-primary/90 hover:scale-[1.1] active:scale-[0.9] transition-all z-50 group"
          size="icon"
        >
          <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </main>
    </div>
  );
};

export default Categories;
