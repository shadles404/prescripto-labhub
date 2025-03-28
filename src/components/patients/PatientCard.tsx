
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { 
  Card,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type Patient } from "@/hooks/usePatients";

interface PatientCardProps {
  patient: Patient;
  onViewPatient: (patient: Patient) => void;
}

const PatientCard = ({ patient, onViewPatient }: PatientCardProps) => {
  return (
    <Card className="overflow-hidden card-shadow hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewPatient(patient)}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {patient.name.split(" ").map(n => n[0]).join("").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.age} years • {patient.gender}
            </p>
          </div>
        </div>
        
        <div className="mb-2">
          {patient.contact && (
            <p className="text-sm flex items-center gap-1">
              <span className="text-muted-foreground">Contact:</span> {patient.contact}
            </p>
          )}
          {patient.address && (
            <p className="text-sm flex items-center gap-1">
              <span className="text-muted-foreground">Address:</span> {patient.address}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0 gap-2">
        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
          <FileText className="h-4 w-4 mr-2" />
          Records
        </Button>
        <Button variant="outline" size="sm" onClick={(e) => {
          e.stopPropagation();
          onViewPatient(patient);
        }}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
