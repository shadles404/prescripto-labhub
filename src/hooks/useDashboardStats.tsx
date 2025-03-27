
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type DashboardStats = {
  totalPatients: number;
  totalPrescriptions: number;
  totalLabReports: number;
  appointments: number;
  patientData: {name: string; count: number}[];
  prescriptionData: {name: string; count: number}[];
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalPrescriptions: 0,
    totalLabReports: 0,
    appointments: 0,
    patientData: [],
    prescriptionData: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total counts
      const { count: totalPatients, error: patientsError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });
        
      const { count: totalPrescriptions, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select('*', { count: 'exact', head: true });
        
      const { count: totalLabReports, error: labReportsError } = await supabase
        .from('lab_reports')
        .select('*', { count: 'exact', head: true });
      
      if (patientsError) throw patientsError;
      if (prescriptionsError) throw prescriptionsError;
      if (labReportsError) throw labReportsError;
      
      // Calculate patient growth data (mock data for now, will be replaced with actual queries)
      const patientData = [
        { name: "Jan", count: 65 },
        { name: "Feb", count: 59 },
        { name: "Mar", count: 80 },
        { name: "Apr", count: 81 },
        { name: "May", count: 56 },
        { name: "Jun", count: 55 },
        { name: "Jul", count: 40 },
      ];
      
      // Calculate prescription data (mock data for now, will be replaced with actual queries)
      const prescriptionData = [
        { name: "Jan", count: 45 },
        { name: "Feb", count: 52 },
        { name: "Mar", count: 49 },
        { name: "Apr", count: 63 },
        { name: "May", count: 59 },
        { name: "Jun", count: 80 },
        { name: "Jul", count: 51 },
      ];
      
      // Update state
      setStats({
        totalPatients: totalPatients || 0,
        totalPrescriptions: totalPrescriptions || 0,
        totalLabReports: totalLabReports || 0,
        appointments: 53, // Mock data for appointments
        patientData,
        prescriptionData
      });
      
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching stats'));
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStats();
    
    // Set up real-time listeners for changes
    const patientsChannel = supabase
      .channel('public:patients')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'patients' 
      }, () => {
        fetchStats();
      })
      .subscribe();
      
    const prescriptionsChannel = supabase
      .channel('public:prescriptions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'prescriptions' 
      }, () => {
        fetchStats();
      })
      .subscribe();
      
    const labReportsChannel = supabase
      .channel('public:lab_reports')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'lab_reports' 
      }, () => {
        fetchStats();
      })
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(patientsChannel);
      supabase.removeChannel(prescriptionsChannel);
      supabase.removeChannel(labReportsChannel);
    };
  }, []);
  
  return { stats, loading, error, refetch: fetchStats };
};
