import React, { useState, useEffect, useRef } from "react";
import { Check, X, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type Patient = Tables<'patients'>;

interface PatientSearchSelectorProps {
  selectedPatient: Patient | null;
  onPatientSelect: (patient: Patient | null) => void;
  className?: string;
}

const PatientSearchSelector = ({ 
  selectedPatient, 
  onPatientSelect,
  className 
}: PatientSearchSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchPatients(searchTerm);
    } else if (searchTerm.length === 0) {
      setPatients([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Add click outside listener
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchPatients = async (term: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .or(`name.ilike.%${term}%,id::text.ilike.%${term}%`)
        .limit(10);

      if (error) {
        console.error('Error searching patients:', error);
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    onPatientSelect(patient);
    setSearchTerm("");
    setIsFocused(false);
  };

  const handleClearSelection = () => {
    onPatientSelect(null);
    setSearchTerm("");
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchTerm.length >= 2) {
      searchPatients(searchTerm);
    }
  };

  // If patient is selected, show patient info with option to change
  if (selectedPatient) {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        <label className="text-sm font-medium">Selected Patient</label>
        <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-medium">{selectedPatient.name}</span>
              <span className="text-xs text-muted-foreground">
                ID: {selectedPatient.id.substring(0, 8)}...
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearSelection}
            className="h-8 w-8 p-0" 
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Otherwise show search input
  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <label className="text-sm font-medium">Search Patient</label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          className="pl-10"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {isFocused && searchTerm.length >= 2 && (
        <div className="absolute z-10 mt-1 w-full bg-card rounded-md border shadow-md max-h-60 overflow-auto">
          {patients.length > 0 ? (
            <ul className="py-1">
              {patients.map((patient) => (
                <li 
                  key={patient.id}
                  className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                  onClick={() => handleSelectPatient(patient)}
                >
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Age: {patient.age} • Gender: {patient.gender}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {patient.id.substring(0, 8)}...
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {searchTerm.length < 2 
                ? "Type at least 2 characters to search"
                : "No patients found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearchSelector;
