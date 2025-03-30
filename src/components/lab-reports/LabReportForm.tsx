
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PatientSearchSelector from "@/components/patients/PatientSearchSelector";
import { Tables } from "@/integrations/supabase/types";

// Define the form schema
const testSchema = z.object({
  test_name: z.string().min(1, "Test name is required"),
  result: z.string().min(1, "Result is required"),
  normal_range: z.string().optional(),
});

const formSchema = z.object({
  patient_id: z.string().uuid("Patient is required"),
  test_date: z.date({
    required_error: "Test date is required",
  }),
  tests: z.array(testSchema).min(1, "At least one test is required"),
});

type FormValues = z.infer<typeof formSchema>;
type Patient = Tables<'patients'>;

interface LabReportFormProps {
  onSubmit: (values: any) => void;
}

const LabReportForm = ({ onSubmit }: LabReportFormProps) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patient_id: "",
      test_date: new Date(),
      tests: [{ test_name: "", result: "", normal_range: "" }],
    },
  });

  // Setup field array for multiple tests
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tests",
  });

  // Handle patient selection
  const handlePatientSelect = (patient: Patient | null) => {
    setSelectedPatient(patient);
    if (patient) {
      form.setValue("patient_id", patient.id);
    } else {
      form.setValue("patient_id", "");
    }
  };

  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values);
    form.reset();
    setSelectedPatient(null);
  };

  const addTest = () => {
    append({ test_name: "", result: "", normal_range: "" });
  };

  const removeTest = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Selector */}
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormControl>
                  <PatientSearchSelector
                    selectedPatient={selectedPatient}
                    onPatientSelect={handlePatientSelect}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Test Date */}
          <FormField
            control={form.control}
            name="test_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Test Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Tests Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Test Information</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTest}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Test
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-card/50"
              >
                {/* Test Name */}
                <FormField
                  control={form.control}
                  name={`tests.${index}.test_name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Blood Glucose" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Result */}
                <FormField
                  control={form.control}
                  name={`tests.${index}.result`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Result</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 95 mg/dL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Normal Range */}
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`tests.${index}.normal_range`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Normal Range (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 70-99 mg/dL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTest(index)}
                      className="mb-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Submit Lab Report
        </Button>
      </form>
    </Form>
  );
};

export default LabReportForm;
