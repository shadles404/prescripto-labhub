
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from "lucide-react";
import { type Patient } from "@/hooks/usePatients";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface PatientDetailDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientDetailDialog = ({ patient, open, onOpenChange }: PatientDetailDialogProps) => {
  if (!patient) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('patient-detail-print');
    const originalContents = document.body.innerHTML;
    
    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      toast.error("Could not print patient details");
    }
  };

  const handleDownload = () => {
    if (!patient) return;
    
    const patientData = {
      name: patient.name,
      id: patient.id,
      age: patient.age,
      gender: patient.gender,
      contact: patient.contact || "Not provided",
      address: patient.address || "Not provided",
      registeredOn: formatDate(patient.created_at)
    };
    
    const dataStr = JSON.stringify(patientData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `patient-${patient.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Patient details downloaded successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete information about {patient.name}
          </DialogDescription>
        </DialogHeader>
        
        <div id="patient-detail-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-base font-medium">{patient.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Patient ID</h3>
              <p className="text-base font-mono">{patient.id.substring(0, 8)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Age</h3>
              <p className="text-base">{patient.age} years</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Gender</h3>
              <p className="text-base capitalize">{patient.gender}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
              <p className="text-base">{patient.contact || "Not provided"}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <p className="text-base">{patient.address || "Not provided"}</p>
            </div>
            
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Registered On</h3>
              <p className="text-base">{formatDate(patient.created_at)}</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailDialog;
