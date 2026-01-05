import { useState } from 'react';
import { DoorOpen, CreditCard, CheckSquare, ChevronRight, Plus } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { mockCategories } from '@/data/mockData';

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
    <div className="min-h-screen bg-background pb-6">
      <AppHeader title="Categories" />

      <main className="p-4 space-y-4 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category List */}
        <div className="space-y-3">
          {filteredCategories.map((category, index) => (
            <div
              key={category.id}
              className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-semibold text-sm">
                  {category.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          ))}
        </div>

        {/* FAB */}
        <Button
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </main>

    </div>
  );
};

export default Categories;
