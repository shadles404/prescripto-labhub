
import React, { useState, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { FileText, Download, Printer, Eye } from "lucide-react";
import { Prescription } from "@/hooks/usePrescriptions";
import { format } from "date-fns";
import { toast } from "sonner";

interface PrescriptionsListProps {
  prescriptions: Prescription[];
}

// Helper function to generate prescription PDF content as HTML
const generatePrescriptionHTML = (prescription: Prescription) => {
  const date = prescription.prescribed_date 
    ? format(new Date(prescription.prescribed_date), 'MMMM d, yyyy')
    : 'Unknown date';
  
  return `
    <html>
      <head>
        <title>Prescription - ${prescription.patient?.name || 'Unknown Patient'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
          .header h1 { margin: 0; color: #333; font-size: 24px; }
          .header p { margin: 5px 0; color: #666; }
          .details { margin-bottom: 20px; }
          .details h2 { margin: 0 0 10px 0; font-size: 18px; color: #444; }
          .medicine { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
          .medicine h3 { margin: 0 0 5px 0; font-size: 16px; }
          .medicine p { margin: 5px 0; color: #555; }
          .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
          .footer p { font-style: italic; color: #777; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Medical Prescription</h1>
          <p>Date: ${date}</p>
          <p>Patient: ${prescription.patient?.name || 'Unknown Patient'}</p>
          <p>Patient ID: ${prescription.patient_id.substring(0, 8)}</p>
        </div>
        
        <div class="details">
          <h2>Medicine Details</h2>
          <div class="medicine">
            <h3>${prescription.medicine_name}</h3>
            <p><strong>Dosage:</strong> ${prescription.dosage}</p>
            <p><strong>Frequency:</strong> ${prescription.frequency}</p>
          </div>
          
          ${prescription.remarks ? `
          <h2>Special Instructions</h2>
          <p>${prescription.remarks}</p>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>This prescription was issued electronically through the Medical Records System.</p>
        </div>
      </body>
    </html>
  `;
};

const PrescriptionCard = ({ prescription, onViewDetails }: { 
  prescription: Prescription;
  onViewDetails: (prescription: Prescription) => void;
}) => {
  // Format the date for display
  const displayDate = prescription.prescribed_date 
    ? format(new Date(prescription.prescribed_date), 'MMM d, yyyy')
    : 'Unknown date';

  return (
    <Card className="hover:border-border transition-medium card-shadow hover:shadow-md cursor-pointer">
      <CardHeader className="cursor-pointer" onClick={() => onViewDetails(prescription)}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">
              {prescription.patient?.name || 'Unknown Patient'}
            </CardTitle>
            <CardDescription>
              Patient ID: {prescription.patient_id.substring(0, 8)} • {displayDate}
            </CardDescription>
          </div>
          <div className="p-2 rounded-md bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="cursor-pointer" onClick={() => onViewDetails(prescription)}>
        <div className="mb-3">
          <p className="text-sm font-medium">Medicine Details</p>
          <div className="text-sm p-2 bg-muted/30 rounded-md mt-2">
            <p className="font-medium">{prescription.medicine_name} - {prescription.dosage}</p>
            <p className="text-muted-foreground text-xs">
              {prescription.frequency}
            </p>
          </div>
        </div>
        
        {prescription.remarks && (
          <div>
            <p className="text-sm font-medium">Remarks</p>
            <p className="text-sm mt-1 line-clamp-2">{prescription.remarks}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(prescription);
          }}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              printPrescription(prescription);
            }}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              downloadPrescription(prescription);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Function to print a prescription
const printPrescription = (prescription: Prescription) => {
  const prescriptionHTML = generatePrescriptionHTML(prescription);
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(prescriptionHTML);
    printWindow.document.close();
    
    // Wait for content to load before printing
    printWindow.onload = function() {
      printWindow.print();
      // Don't close the window to allow user to see print preview
    };
  } else {
    toast.error("Couldn't open print window. Please check your popup settings.");
  }
};

// Function to download a prescription as HTML file
const downloadPrescription = (prescription: Prescription) => {
  const prescriptionHTML = generatePrescriptionHTML(prescription);
  
  // Create a blob with the HTML content
  const blob = new Blob([prescriptionHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger the download
  const link = document.createElement('a');
  link.href = url;
  
  // Create a filename using patient name and date
  const date = prescription.prescribed_date 
    ? format(new Date(prescription.prescribed_date), 'yyyy-MM-dd')
    : 'unknown-date';
  const filename = `prescription-${prescription.patient?.name || 'unknown'}-${date}.html`;
  
  link.download = filename.replace(/\s+/g, '-').toLowerCase();
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
  toast.success("Prescription downloaded successfully");
};

const PrescriptionDetails = ({ 
  prescription, 
  open, 
  onOpenChange 
}: { 
  prescription: Prescription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!prescription) return null;
  
  const displayDate = prescription.prescribed_date 
    ? format(new Date(prescription.prescribed_date), 'MMMM d, yyyy')
    : 'Unknown date';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Prescription Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Patient</p>
              <p className="text-lg font-medium">{prescription.patient?.name || 'Unknown Patient'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>{displayDate}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Medicine Information</p>
            <div className="bg-muted/30 p-4 rounded-md">
              <div className="mb-3">
                <p className="text-sm font-medium text-muted-foreground">Medicine Name</p>
                <p className="text-lg font-medium">{prescription.medicine_name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dosage</p>
                  <p>{prescription.dosage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                  <p>{prescription.frequency}</p>
                </div>
              </div>
            </div>
          </div>
          
          {prescription.remarks && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Remarks & Instructions</p>
              <div className="bg-muted/30 p-4 rounded-md">
                <p>{prescription.remarks}</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline"
            onClick={() => printPrescription(prescription)}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            onClick={() => downloadPrescription(prescription)}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PrescriptionsList = ({ prescriptions }: PrescriptionsListProps) => {
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setDetailsOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prescriptions.map((prescription) => (
          <PrescriptionCard 
            key={prescription.id} 
            prescription={prescription} 
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <PrescriptionDetails 
        prescription={selectedPrescription} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};

export default PrescriptionsList;
