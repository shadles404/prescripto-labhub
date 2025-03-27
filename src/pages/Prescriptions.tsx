
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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PrescriptionForm from "@/components/prescriptions/PrescriptionForm";
import PrescriptionsList from "@/components/prescriptions/PrescriptionsList";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import { Skeleton } from "@/components/ui/skeleton";

const Prescriptions = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { prescriptions, loading, error, addPrescription } = usePrescriptions();

  const handleNewPrescription = () => {
    setShowAddDialog(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      await addPrescription({
        patient_id: values.patientId,
        medicine_name: values.medicines[0].name,
        dosage: values.medicines[0].dosage,
        frequency: values.medicines[0].frequency,
        prescribed_date: new Date().toISOString(),
        remarks: values.advice || null
      });
      
      setShowAddDialog(false);
    } catch (err) {
      console.error("Error submitting prescription:", err);
    }
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
            
            <TabsContent value="all">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <Skeleton className="h-4 w-1/2 mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12 text-destructive">
                  <p>Error loading prescriptions. Please try again later.</p>
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No prescriptions found. Create your first prescription.</p>
                </div>
              ) : (
                <PrescriptionsList prescriptions={prescriptions} />
              )}
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
