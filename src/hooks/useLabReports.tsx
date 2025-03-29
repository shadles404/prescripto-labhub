
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
      
      // Transform the data to include patient name and status with correct typing
      const formattedData = (data || []).map(report => {
        // Determine status as a union type, not a general string
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

  const addLabReport = async (reportData: LabReportFormData) => {
    try {
      setLoading(true);
      
      // Handle both single test and multiple tests format
      if (reportData.tests && reportData.tests.length > 0) {
        // Multiple tests - insert each test as a separate row
        const insertPromises = reportData.tests.map(test => 
          supabase
            .from('lab_reports')
            .insert([{
              patient_id: reportData.patient_id,
              test_name: test.test_name,
              result: test.result,
              normal_range: test.normal_range || null,
              test_date: reportData.test_date
            }])
        );
        
        await Promise.all(insertPromises);
        toast.success(`${reportData.tests.length} lab tests added successfully`);
      } else if (reportData.test_name) {
        // Single test (old format)
        await supabase
          .from('lab_reports')
          .insert([{
            patient_id: reportData.patient_id,
            test_name: reportData.test_name,
            result: reportData.result || '',
            normal_range: reportData.normal_range || null,
            test_date: reportData.test_date
          }]);
          
        toast.success("Lab report added successfully");
      }
      
      // Refresh the lab reports list
      fetchLabReports();
      
      return true;
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
