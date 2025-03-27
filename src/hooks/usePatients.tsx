
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string | null;
  address: string | null;
  created_at: string;
};

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setPatients(data || []);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching patients'));
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<Patient, 'id' | 'created_at'>) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select();
        
      if (error) throw error;
      
      toast.success("Patient added successfully");
      
      // Refresh the patients list
      fetchPatients();
      
      return data?.[0];
    } catch (err) {
      console.error("Error adding patient:", err);
      toast.error("Failed to add patient");
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatients();
    
    // Set up real-time listener for changes
    const channel = supabase
      .channel('public:patients')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'patients' 
      }, () => {
        fetchPatients();
      })
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return { 
    patients, 
    loading, 
    error, 
    refetch: fetchPatients,
    addPatient
  };
};
