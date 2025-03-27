
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatients } from "@/hooks/usePatients";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Please select a patient.",
  }),
  test_name: z.string().min(1, "Test name is required"),
  result: z.string().min(1, "Result is required"),
  normal_range: z.string().optional(),
  test_date: z.string().default(() => new Date().toISOString().split('T')[0])
});

type FormValues = z.infer<typeof formSchema>;

interface LabReportFormProps {
  onSubmit: (values: FormValues) => void;
}

const LabReportForm = ({ onSubmit }: LabReportFormProps) => {
  const { patients, loading: loadingPatients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      test_name: "",
      result: "",
      normal_range: "",
      test_date: new Date().toISOString().split('T')[0]
    },
  });

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    form.setValue("patient_id", patientId);
  };

  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="rounded-lg border border-border/40 p-4 card-shadow">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient</FormLabel>
                <Select onValueChange={handlePatientChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingPatients ? "Loading patients..." : "Select a patient"} />
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
          <h3 className="text-sm font-medium mb-3">Test Details</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="test_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blood Glucose, CBC, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Result</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 120 mg/dL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="normal_range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Normal Range (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 70-100 mg/dL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="test_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Date</FormLabel>
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
            Add Lab Report
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LabReportForm;
