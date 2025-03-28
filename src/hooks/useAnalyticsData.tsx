
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AnalyticsData = {
  medicineData: { name: string; count: number }[];
  testData: { name: string; count: number }[];
  monthlyData: { name: string; patients: number; prescriptions: number; tests: number }[];
  genderData: { name: string; value: number }[];
  ageData: { name: string; count: number }[];
};

export const useAnalyticsData = () => {
  const [data, setData] = useState<AnalyticsData>({
    medicineData: [],
    testData: [],
    monthlyData: [],
    genderData: [],
    ageData: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch medicine data - most prescribed medicines
      const { data: medicineData, error: medicineError } = await supabase
        .from('prescriptions')
        .select('medicine_name')
        .order('medicine_name', { ascending: true });
        
      if (medicineError) throw medicineError;
      
      // Count occurrences of each medicine
      const medicineCounts: Record<string, number> = {};
      medicineData?.forEach(item => {
        medicineCounts[item.medicine_name] = (medicineCounts[item.medicine_name] || 0) + 1;
      });
      
      // Convert to required format and sort by count (descending)
      const formattedMedicineData = Object.entries(medicineCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Take top 5
      
      // Fetch test data - most common lab tests
      const { data: testData, error: testError } = await supabase
        .from('lab_reports')
        .select('test_name');
        
      if (testError) throw testError;
      
      // Count occurrences of each test
      const testCounts: Record<string, number> = {};
      testData?.forEach(item => {
        testCounts[item.test_name] = (testCounts[item.test_name] || 0) + 1;
      });
      
      // Convert to required format and sort by count (descending)
      const formattedTestData = Object.entries(testCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Take top 5
      
      // Fetch monthly data - patients, prescriptions, and tests per month
      // We'll need to get data for the last 7 months
      const months = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        months.push({
          month: date.getMonth(),
          year: date.getFullYear(),
          name: date.toLocaleString('default', { month: 'short' })
        });
      }
      
      // Prepare monthly data array
      const monthlyData = await Promise.all(months.map(async ({ month, year, name }) => {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        // Format dates for Supabase queries
        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();
        
        // Count patients created in this month
        const { count: patientsCount, error: patientsError } = await supabase
          .from('patients')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDateStr)
          .lte('created_at', endDateStr);
          
        if (patientsError) throw patientsError;
        
        // Count prescriptions in this month
        const { count: prescriptionsCount, error: prescriptionsError } = await supabase
          .from('prescriptions')
          .select('*', { count: 'exact', head: true })
          .gte('prescribed_date', startDateStr)
          .lte('prescribed_date', endDateStr);
          
        if (prescriptionsError) throw prescriptionsError;
        
        // Count lab tests in this month
        const { count: testsCount, error: testsError } = await supabase
          .from('lab_reports')
          .select('*', { count: 'exact', head: true })
          .gte('test_date', startDateStr)
          .lte('test_date', endDateStr);
          
        if (testsError) throw testsError;
        
        return {
          name,
          patients: patientsCount || 0,
          prescriptions: prescriptionsCount || 0,
          tests: testsCount || 0
        };
      }));
      
      // Fetch gender data - patient distribution by gender
      const { data: genderData, error: genderError } = await supabase
        .from('patients')
        .select('gender');
        
      if (genderError) throw genderError;
      
      // Count patients by gender
      const genderCounts: Record<string, number> = {};
      genderData?.forEach(item => {
        genderCounts[item.gender] = (genderCounts[item.gender] || 0) + 1;
      });
      
      // Convert to required format
      const formattedGenderData = Object.entries(genderCounts)
        .map(([name, value]) => ({ name, value }));
      
      // Fetch age data - patient distribution by age
      const { data: ageData, error: ageError } = await supabase
        .from('patients')
        .select('age');
        
      if (ageError) throw ageError;
      
      // Group patients by age range
      const ageRanges = {
        '0-18': 0,
        '19-35': 0,
        '36-50': 0,
        '51-65': 0,
        '65+': 0
      };
      
      ageData?.forEach(item => {
        const age = item.age;
        if (age <= 18) ageRanges['0-18']++;
        else if (age <= 35) ageRanges['19-35']++;
        else if (age <= 50) ageRanges['36-50']++;
        else if (age <= 65) ageRanges['51-65']++;
        else ageRanges['65+']++;
      });
      
      // Convert to required format
      const formattedAgeData = Object.entries(ageRanges)
        .map(([name, count]) => ({ name, count }));
      
      // Update state with all the analytics data
      setData({
        medicineData: formattedMedicineData,
        testData: formattedTestData,
        monthlyData,
        genderData: formattedGenderData,
        ageData: formattedAgeData
      });
      
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching analytics data'));
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnalyticsData();
    
    // Set up real-time listeners for changes
    const patientsChannel = supabase
      .channel('public:patients:analytics')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'patients' 
      }, () => {
        fetchAnalyticsData();
      })
      .subscribe();
      
    const prescriptionsChannel = supabase
      .channel('public:prescriptions:analytics')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'prescriptions' 
      }, () => {
        fetchAnalyticsData();
      })
      .subscribe();
      
    const labReportsChannel = supabase
      .channel('public:lab_reports:analytics')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'lab_reports' 
      }, () => {
        fetchAnalyticsData();
      })
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(patientsChannel);
      supabase.removeChannel(prescriptionsChannel);
      supabase.removeChannel(labReportsChannel);
    };
  }, []);
  
  return { data, loading, error, refetch: fetchAnalyticsData };
};
