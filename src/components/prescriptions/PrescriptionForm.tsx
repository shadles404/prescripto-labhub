import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePatients } from "@/hooks/usePatients";

const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  instruction: z.string().optional(),
});

const formSchema = z.object({
  patientId: z.string({
    required_error: "Please select a patient.",
  }),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  medicines: z.array(medicineSchema).min(1, "At least one medicine is required"),
  advice: z.string().optional(),
  followUpDate: z.string().optional(),
});

interface PrescriptionFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

const PrescriptionForm = ({ onSubmit }: PrescriptionFormProps) => {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const { patients, loading } = usePatients();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      diagnosis: "",
      medicines: [
        { name: "", dosage: "", frequency: "", duration: "", instruction: "" }
      ],
      advice: "",
      followUpDate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "medicines",
    control: form.control,
  });

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    form.setValue("patientId", patientId);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border border-border/40 p-4 card-shadow">
          <FormField
            control={form.control}
            name="patientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select onValueChange={handlePatientChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={loading ? "Loading patients..." : "Select a patient"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.age} years, {patient.gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedPatient && (
            <div className="mt-4 p-3 bg-muted/50 rounded-md flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedPatient.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedPatient.name}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPatient.age} years • {selectedPatient.gender}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border/40 p-4 card-shadow">
          <h3 className="text-sm font-medium mb-3">Diagnosis & Treatment</h3>
          <FormField
            control={form.control}
            name="diagnosis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diagnosis</FormLabel>
                <FormControl>
                  <Textarea placeholder="Patient diagnosis..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-lg border border-border/40 p-4 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Medications</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => append({ name: "", dosage: "", frequency: "", duration: "", instruction: "" })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Medication
            </Button>
          </div>

          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="p-3 bg-muted/30 rounded-md mb-3 border border-border/40"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Medication #{index + 1}</h4>
                {fields.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-destructive" 
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`medicines.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Medicine name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`medicines.${index}.dosage`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`medicines.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Frequency</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Twice daily" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`medicines.${index}.duration`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 7 days" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`medicines.${index}.instruction`}
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel className="text-xs">Special Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Take after meals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/40 p-4 card-shadow">
          <h3 className="text-sm font-medium mb-3">Additional Instructions</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="advice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>General Advice (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Rest instructions, dietary advice, etc."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="followUpDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Follow-up Date (Optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">
            Create Prescription
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PrescriptionForm;
