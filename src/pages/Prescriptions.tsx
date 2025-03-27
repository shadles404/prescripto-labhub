
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Plus } from "lucide-react";
import PrescriptionForm from "@/components/prescriptions/PrescriptionForm";
import { toast } from "sonner";

// Sample data for prescriptions
const SAMPLE_PRESCRIPTIONS = [
  {
    id: "rx1",
    patientName: "Sarah Johnson",
    patientId: "P001",
    date: "2023-10-15",
    diagnosis: "Seasonal Allergy",
    medicines: [
      { name: "Cetirizine", dosage: "10mg", frequency: "Once daily", duration: "10 days" },
      { name: "Montelukast", dosage: "10mg", frequency: "Once at bedtime", duration: "10 days" }
    ]
  },
  {
    id: "rx2",
    patientName: "Michael Chen",
    patientId: "P002",
    date: "2023-09-28",
    diagnosis: "Hypertension",
    medicines: [
      { name: "Amlodipine", dosage: "5mg", frequency: "Once daily", duration: "30 days" },
      { name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily", duration: "30 days" }
    ]
  },
  {
    id: "rx3",
    patientName: "Emily Rodriguez",
    patientId: "P003",
    date: "2023-10-02",
    diagnosis: "Respiratory Infection",
    medicines: [
      { name: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", duration: "7 days" },
      { name: "Guaifenesin", dosage: "400mg", frequency: "Every 12 hours", duration: "5 days" }
    ]
  },
];

const PrescriptionCard = ({ prescription }: { prescription: any }) => {
  return (
    <Card className="hover:border-border transition-medium card-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-medium">{prescription.patientName}</CardTitle>
            <CardDescription>
              Patient ID: {prescription.patientId} • {new Date(prescription.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </CardDescription>
          </div>
          <div className="p-2 rounded-md bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="mb-3">
          <p className="text-sm font-medium">Diagnosis</p>
          <p className="text-sm">{prescription.diagnosis}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2">Medications</p>
          <div className="space-y-2">
            {prescription.medicines.map((medicine: any, index: number) => (
              <div key={index} className="text-sm p-2 bg-muted/30 rounded-md">
                <p className="font-medium">{medicine.name} - {medicine.dosage}</p>
                <p className="text-muted-foreground text-xs">
                  {medicine.frequency} for {medicine.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
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

const Prescriptions = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleNewPrescription = () => {
    setShowAddDialog(true);
  };

  const handleSubmit = (values: any) => {
    console.log("New prescription data:", values);
    setShowAddDialog(false);
    toast.success("Prescription created successfully");
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header title="Prescriptions" />
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-medium mb-1">Prescriptions</h2>
              <p className="text-muted-foreground">
                Manage medical prescriptions for your patients
              </p>
            </div>
            
            <Button onClick={handleNewPrescription}>
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Prescriptions</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_PRESCRIPTIONS.map((prescription) => (
                <PrescriptionCard key={prescription.id} prescription={prescription} />
              ))}
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Recent prescriptions will appear here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="archived">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Archived prescriptions will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
          
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Prescription</DialogTitle>
              </DialogHeader>
              <PrescriptionForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </PageTransition>
  );
};

export default Prescriptions;
