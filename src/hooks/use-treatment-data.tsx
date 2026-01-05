import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TreatmentCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  procedure_count?: number;
}

export interface TreatmentProcedure {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  benefits: string | null;
  aftercare: string | null;
  procedure_details: string | null;
  display_order: number;
  category?: TreatmentCategory;
}

// Fetch all treatment categories with procedure counts
export const useTreatmentCategories = () => {
  return useQuery({
    queryKey: ['treatment-categories'],
    queryFn: async () => {
      const { data: categories, error: catError } = await supabase
        .from('treatment_categories')
        .select('*')
        .order('display_order');

      if (catError) throw catError;

      // Get procedure counts for each category
      const categoriesWithCounts = await Promise.all(
        (categories || []).map(async (category) => {
          const { count } = await supabase
            .from('treatment_procedures')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);

          return {
            ...category,
            procedure_count: count || 0,
          };
        })
      );

      return categoriesWithCounts;
    },
  });
};

// Fetch procedures for a specific category or all procedures
export const useTreatmentProcedures = (categoryId?: string) => {
  return useQuery({
    queryKey: ['treatment-procedures', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('treatment_procedures')
        .select('*, category:treatment_categories(*)')
        .order('display_order');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as TreatmentProcedure[];
    },
  });
};

// Fetch a single procedure with full details
export const useTreatmentProcedureDetails = (procedureId: string | null) => {
  return useQuery({
    queryKey: ['treatment-procedure', procedureId],
    queryFn: async () => {
      if (!procedureId) return null;

      const { data, error } = await supabase
        .from('treatment_procedures')
        .select('*, category:treatment_categories(*)')
        .eq('id', procedureId)
        .single();

      if (error) throw error;
      return data as TreatmentProcedure;
    },
    enabled: !!procedureId,
  });
};
