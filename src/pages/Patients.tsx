
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import PatientList from "@/components/patients/PatientList";
import PatientForm from "@/components/patients/PatientForm";
import PatientDetailDialog from "@/components/patients/PatientDetailDialog";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { type Patient } from "@/hooks/usePatients";

const Patients = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const handleAddPatient = () => {
    setShowAddDialog(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetailDialog(true);
  };

  const handleSubmit = (values: any) => {
    setShowAddDialog(false);
    toast.success("Patient registered successfully");
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header title="Patients" />
        
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-medium mb-1">Patient Management</h2>
            <p className="text-muted-foreground">
              View and manage your patient records
            </p>
          </div>
          
          <PatientList 
            onAddPatient={handleAddPatient} 
            onViewPatient={handleViewPatient}
          />
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Register New Patient</DialogTitle>
              </DialogHeader>
              <PatientForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>

          <PatientDetailDialog 
            patient={selectedPatient} 
            open={showDetailDialog} 
            onOpenChange={setShowDetailDialog} 
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Patients;
