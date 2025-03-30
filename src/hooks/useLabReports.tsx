import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type LabReport = {
  id: string;
  patient_id: string;
  test_name: string;
  result: string;
  normal_range: string | null;
  test_date: string;
  patient: {
    name: string;
  };
  status?: "completed" | "pending"; // Using a union type instead of string
};

export type LabReportFormData = {
  patient_id: string;
  test_date: string;
  tests?: Array<{
    test_name: string;
    result: string;
    normal_range?: string;
  }>;
  // For backward compatibility
  test_name?: string;
  result?: string;
  normal_range?: string;
};

export const useLabReports = () => {
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'saving' | 'error'>('idle');

  const fetchLabReports = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('lab_reports')
        .select(`
          id,
          patient_id,
          test_name,
          result,
          normal_range,
          test_date,
          patients (
            name
          )
        `)
        .order('test_date', { ascending: false });
        
      if (error) throw error;
      
      const formattedData = (data || []).map(report => {
        const status: "completed" | "pending" = 
          report.normal_range && report.result <= report.normal_range 
            ? 'completed' 
            : 'pending';
            
        return {
          id: report.id,
          patient_id: report.patient_id,
          test_name: report.test_name,
          result: report.result,
          normal_range: report.normal_range,
          test_date: report.test_date,
          patient: {
            name: report.patients?.name || 'Unknown Patient'
          },
          status
        };
      });
      
      setLabReports(formattedData);
    } catch (err) {
      console.error("Error fetching lab reports:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching lab reports'));
      toast.error("Failed to load lab reports");
    } finally {
      setLoading(false);
    }
  };

  const addLabReport = async (values: any) => {
    try {
      setLoadingState('saving');
      
      if (Array.isArray(values.tests) && values.tests.length > 0) {
        const labReports = values.tests.map((test: any) => ({
          patient_id: values.patient_id,
          test_name: test.test_name,
          result: test.result,
          normal_range: test.normal_range,
          test_date: values.test_date
        }));
        
        const { data, error } = await supabase
          .from('lab_reports')
          .insert(labReports)
          .select();
          
        if (error) throw error;
        
        if (data) {
          setLabReports((prev) => [...prev, ...data]);
          toast.success(`${data.length} lab reports added successfully`);
        }
      } else {
        const { data, error } = await supabase
          .from('lab_reports')
          .insert(values)
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          setLabReports((prev) => [...prev, data[0]]);
          toast.success('Lab report added successfully');
        }
      }
      
      setLoadingState('idle');
      return true;
    } catch (error) {
      console.error('Error adding lab report:', error);
      toast.error('Failed to add lab report');
      setLoadingState('error');
      return false;
    }
  };
  
  useEffect(() => {
    fetchLabReports();
    
    const channel = supabase
      .channel('public:lab_reports')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'lab_reports' 
      }, () => {
        fetchLabReports();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { 
    labReports, 
    loading, 
    error, 
    refetch: fetchLabReports,
    addLabReport,
    loadingState
  };
};
