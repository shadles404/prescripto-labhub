
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePatients } from "@/hooks/usePatients";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, Trash2 } from "lucide-react";

const testSchema = z.object({
  test_name: z.string().min(1, "Test name is required"),
  result: z.string().min(1, "Result is required"),
  normal_range: z.string().optional(),
});

const formSchema = z.object({
  patient_id: z.string({
    required_error: "Please select a patient.",
  }),
  tests: z.array(testSchema).min(1, "At least one test is required"),
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
      tests: [
        { test_name: "", result: "", normal_range: "" }
      ],
      test_date: new Date().toISOString().split('T')[0]
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "tests",
    control: form.control,
  });

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatient(patient);
    form.setValue("patient_id", patientId);
  };

  const handleFormSubmit = (values: FormValues) => {
    // Transform multi-test format to match expected API format if needed
    // For backward compatibility, we'll take the first test's details if only one test
    if (values.tests.length === 1) {
      const singleTest = {
        patient_id: values.patient_id,
        test_name: values.tests[0].test_name,
        result: values.tests[0].result,
        normal_range: values.tests[0].normal_range,
        test_date: values.test_date
      };
      onSubmit(singleTest as any);
    } else {
      // Pass the multi-test format directly
      onSubmit(values);
    }
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
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Test Details</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => append({ test_name: "", result: "", normal_range: "" })}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Another Test
            </Button>
          </div>

          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="p-3 bg-muted/30 rounded-md mb-3 border border-border/40"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Test #{index + 1}</h4>
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
              
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name={`tests.${index}.test_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Test Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Blood Glucose, CBC, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`tests.${index}.result`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Result</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 120 mg/dL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`tests.${index}.normal_range`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Normal Range (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 70-100 mg/dL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
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
