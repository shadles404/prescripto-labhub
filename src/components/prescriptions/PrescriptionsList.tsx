
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer } from "lucide-react";
import { Prescription } from "@/hooks/usePrescriptions";
import { format } from "date-fns";

interface PrescriptionsListProps {
  prescriptions: Prescription[];
}

const PrescriptionCard = ({ prescription }: { prescription: Prescription }) => {
  // Format the date for display
  const displayDate = prescription.prescribed_date 
    ? format(new Date(prescription.prescribed_date), 'MMM d, yyyy')
    : 'Unknown date';

  return (
    <Card className="hover:border-border transition-medium card-shadow">
      <CardHeader>
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
      
      <CardContent>
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
            <p className="text-sm mt-1">{prescription.remarks}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

const PrescriptionsList = ({ prescriptions }: PrescriptionsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {prescriptions.map((prescription) => (
        <PrescriptionCard key={prescription.id} prescription={prescription} />
      ))}
    </div>
  );
};

export default PrescriptionsList;
