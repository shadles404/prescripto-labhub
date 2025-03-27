
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Prescription = {
  id: string;
  patient_id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  prescribed_date: string;
  remarks: string | null;
  patient?: {
    name: string;
  };
};

export const usePrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      
      // First fetch prescriptions
      const { data: prescriptionsData, error: prescriptionsError } = await supabase
        .from('prescriptions')
        .select(`
          id,
          patient_id,
          medicine_name,
          dosage,
          frequency,
          prescribed_date,
          remarks
        `)
        .order('prescribed_date', { ascending: false });
        
      if (prescriptionsError) throw prescriptionsError;
      
      // Then fetch patient information separately to avoid join errors
      const prescriptionsWithPatients = await Promise.all((prescriptionsData || []).map(async (prescription) => {
        // Get patient data for each prescription
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('name')
          .eq('id', prescription.patient_id)
          .single();
          
        return {
          ...prescription,
          patient: {
            name: patientData?.name || 'Unknown Patient'
          }
        };
      }));
      
      setPrescriptions(prescriptionsWithPatients);
    } catch (err) {
      console.error("Error fetching prescriptions:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching prescriptions'));
      toast.error("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  const addPrescription = async (prescriptionData: Omit<Prescription, 'id' | 'patient'>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('prescriptions')
        .insert([prescriptionData])
        .select();
        
      if (error) throw error;
      
      toast.success("Prescription added successfully");
      
      // Refresh the prescriptions list
      fetchPrescriptions();
      
      return data?.[0];
    } catch (err) {
      console.error("Error adding prescription:", err);
      toast.error("Failed to add prescription");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPrescriptions();
    
    // Set up real-time listener for changes
    const channel = supabase
      .channel('public:prescriptions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'prescriptions' 
      }, () => {
        fetchPrescriptions();
      })
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { 
    prescriptions, 
    loading, 
    error, 
    refetch: fetchPrescriptions,
    addPrescription
  };
};
