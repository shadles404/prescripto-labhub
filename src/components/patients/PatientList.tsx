
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";
import PatientCard from "./PatientCard";
import { usePatients, type Patient } from "@/hooks/usePatients";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientListProps {
  onAddPatient: () => void;
  onViewPatient: (patient: Patient) => void;
}

const PatientList = ({ onAddPatient, onViewPatient }: PatientListProps) => {
  const { patients, loading } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "all") return matchesSearch;
    return matchesSearch && patient.gender.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search patients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9" 
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            className="border p-2 rounded-md text-sm bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Patients</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          
          <Button onClick={onAddPatient}>
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-3/4 mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No patients found with the current search criteria.</p>
          <Button onClick={onAddPatient} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {filteredPatients.map((patient) => (
            <PatientCard 
              key={patient.id} 
              patient={patient} 
              onViewPatient={onViewPatient} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;
