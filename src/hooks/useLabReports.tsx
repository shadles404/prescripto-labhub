
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
  status?: "completed" | "pending";
};

export const useLabReports = () => {
  const [labReports, setLabReports] = useState<LabReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
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
      
      // Transform the data to match our component's expectations
      const formattedData = (data || []).map(report => ({
        id: report.id,
        patient_id: report.patient_id,
        test_name: report.test_name,
        result: report.result,
        normal_range: report.normal_range,
        test_date: report.test_date,
        patient: {
          name: report.patients?.name || 'Unknown Patient'
        },
        // For display purposes, we consider any result outside normal range as "pending"
        status: report.normal_range && report.result <= report.normal_range 
          ? 'completed' 
          : 'pending'
      }));
      
      setLabReports(formattedData);
    } catch (err) {
      console.error("Error fetching lab reports:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching lab reports'));
      toast.error("Failed to load lab reports");
    } finally {
      setLoading(false);
    }
  };

  const addLabReport = async (reportData: Omit<LabReport, 'id' | 'patient'>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('lab_reports')
        .insert([{
          patient_id: reportData.patient_id,
          test_name: reportData.test_name,
          result: reportData.result,
          normal_range: reportData.normal_range,
          test_date: reportData.test_date
        }])
        .select();
        
      if (error) throw error;
      
      toast.success("Lab report added successfully");
      
      // Refresh the lab reports list
      fetchLabReports();
      
      return data;
    } catch (err) {
      console.error("Error adding lab report:", err);
      toast.error("Failed to add lab report");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLabReports();
    
    // Set up real-time listener for changes
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
    
    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { 
    labReports, 
    loading, 
    error, 
    refetch: fetchLabReports,
    addLabReport
  };
};
