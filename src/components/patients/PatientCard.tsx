
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, FileText, Edit, Trash2 } from "lucide-react";

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    contact: string;
    email: string;
    lastVisit?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewPrescriptions: (id: string) => void;
}

const PatientCard = ({ patient, onEdit, onDelete, onViewPrescriptions }: PatientCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden transition-medium hover:border-border card-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-medium">{patient.name}</CardTitle>
              <CardDescription>
                {patient.age} years • {patient.gender}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(patient.id)}
            >
              <Edit className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive" 
              onClick={() => onDelete(patient.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Phone className="h-3.5 w-3.5 mr-2" />
            {patient.contact}
          </div>
          {patient.email && (
            <div className="flex items-center text-muted-foreground">
              <Mail className="h-3.5 w-3.5 mr-2" />
              {patient.email}
            </div>
          )}
          {patient.lastVisit && (
            <div className="text-xs text-muted-foreground mt-2">
              Last visit: {patient.lastVisit}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={() => onViewPrescriptions(patient.id)}
        >
          <FileText className="h-3.5 w-3.5 mr-2" />
          View Prescriptions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
