import React, { useState } from 'react';
import { useTreatmentCategories, useTreatmentProcedures } from '@/hooks/use-treatment-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreatmentSelectorProps {
  onSelect: (procedureId: string, procedureName: string, categoryName: string) => void;
  selectedProcedureId?: string;
}

export const TreatmentSelector: React.FC<TreatmentSelectorProps> = ({
  onSelect,
  selectedProcedureId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { data: categories, isLoading: categoriesLoading } = useTreatmentCategories();
  const { data: allProcedures, isLoading: proceduresLoading } = useTreatmentProcedures();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredProcedures = allProcedures?.filter((procedure) =>
    procedure.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProceduresForCategory = (categoryId: string) => {
    return filteredProcedures?.filter((p) => p.category_id === categoryId) || [];
  };

  if (categoriesLoading || proceduresLoading) {
    return <div className="text-sm text-muted-foreground">Loading treatments...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search treatments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Categories and Procedures */}
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {categories?.map((category) => {
            const procedures = getProceduresForCategory(category.id);
            const isExpanded = expandedCategories.has(category.id);

            if (searchQuery && procedures.length === 0) return null;

            return (
              <Collapsible
                key={category.id}
                open={isExpanded || searchQuery.length > 0}
                onOpenChange={() => toggleCategory(category.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto hover:bg-accent"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded || searchQuery ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium text-left">{category.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                      {procedures.length}
                    </span>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="pl-6 pt-1 space-y-1">
                  {procedures.map((procedure) => (
                    <Button
                      key={procedure.id}
                      variant={selectedProcedureId === procedure.id ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start text-left h-auto py-2 px-3',
                        selectedProcedureId === procedure.id && 'bg-primary/10 text-primary'
                      )}
                      onClick={() =>
                        onSelect(procedure.id, procedure.name, category.name)
                      }
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-normal">{procedure.name}</span>
                        {procedure.description && (
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {procedure.description}
                          </span>
                        )}
                      </div>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
