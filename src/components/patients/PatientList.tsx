
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, UserPlus, Filter } from "lucide-react";
import PatientCard from "./PatientCard";

// Sample data - would come from API/database in a real app
const SAMPLE_PATIENTS = [
  {
    id: "p1",
    name: "Sarah Johnson",
    age: 42,
    gender: "Female",
    contact: "+1 (555) 123-4567",
    email: "sarah.j@example.com",
    lastVisit: "June 12, 2023",
  },
  {
    id: "p2",
    name: "Michael Chen",
    age: 35,
    gender: "Male",
    contact: "+1 (555) 987-6543",
    email: "michael.c@example.com",
    lastVisit: "August 3, 2023",
  },
  {
    id: "p3",
    name: "Emily Rodriguez",
    age: 28,
    gender: "Female",
    contact: "+1 (555) 456-7890",
    email: "emily.r@example.com",
    lastVisit: "September 15, 2023",
  },
  {
    id: "p4",
    name: "David Wilson",
    age: 51,
    gender: "Male",
    contact: "+1 (555) 246-8102",
    email: "david.w@example.com",
    lastVisit: "May 22, 2023",
  },
];

interface PatientListProps {
  onAddPatient: () => void;
}

const PatientList = ({ onAddPatient }: PatientListProps) => {
  const [patients] = useState(SAMPLE_PATIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState("all");

  const handleEdit = (id: string) => {
    console.log("Edit patient with ID:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete patient with ID:", id);
  };

  const handleViewPrescriptions = (id: string) => {
    console.log("View prescriptions for patient with ID:", id);
  };

  // Filter patients based on search term and filter option
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterOption === "all") return matchesSearch;
    return matchesSearch && patient.gender.toLowerCase() === filterOption;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search patients..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={filterOption} onValueChange={setFilterOption}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={onAddPatient}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>
      </div>
      
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No patients found. Try different search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewPrescriptions={handleViewPrescriptions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientList;
