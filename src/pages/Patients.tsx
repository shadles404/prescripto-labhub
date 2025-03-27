
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import PatientList from "@/components/patients/PatientList";
import PatientForm from "@/components/patients/PatientForm";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Patients = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddPatient = () => {
    setShowAddDialog(true);
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
          
          <PatientList onAddPatient={handleAddPatient} />
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Register New Patient</DialogTitle>
              </DialogHeader>
              <PatientForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageTransition>
  );
};

export default Patients;
