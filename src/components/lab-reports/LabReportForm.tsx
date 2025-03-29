
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
import { ChevronDown, ChevronUp, Plus, Search, Trash2, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const [isTestsCollapsed, setIsTestsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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

  const handlePatientChange = (patient: any) => {
    setSelectedPatient(patient);
    form.setValue("patient_id", patient.id);
    setSearchTerm(patient.name);
    setIsPopoverOpen(false);
  };

  const clearPatientSelection = () => {
    setSelectedPatient(null);
    form.setValue("patient_id", "");
    setSearchTerm("");
  };

  const filteredPatients = patients.filter((patient) => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.id.includes(searchTerm)
  );

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
    setSelectedPatient(null);
    setSearchTerm("");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="rounded-lg border border-border/40 p-4 card-shadow">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>Patient</FormLabel>
                <div>
                  <Popover open={isPopoverOpen && searchTerm.length > 0 && !selectedPatient}
                           onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setIsPopoverOpen(e.target.value.length > 0 && !selectedPatient);
                          }}
                          onClick={() => {
                            if (searchTerm.length > 0 && !selectedPatient) {
                              setIsPopoverOpen(true);
                            }
                          }}
                          placeholder="Search patient by name or ID..."
                          className="pl-9 pr-10"
                        />
                        {searchTerm && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                            onClick={clearPatientSelection}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <ScrollArea className="max-h-60">
                        {loadingPatients ? (
                          <div className="p-4 text-center text-muted-foreground">Loading patients...</div>
                        ) : filteredPatients.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">No patients found</div>
                        ) : (
                          <div className="p-1">
                            {filteredPatients.map((patient) => (
                              <Button
                                key={patient.id}
                                type="button"
                                variant="ghost"
                                className={cn(
                                  "flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left",
                                  selectedPatient?.id === patient.id && "bg-accent"
                                )}
                                onClick={() => handlePatientChange(patient)}
                              >
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {patient.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{patient.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {patient.age} years • {patient.gender}
                                  </p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={clearPatientSelection}
              >
                Change
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border/40 p-4 card-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Test Details</h3>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ test_name: "", result: "", normal_range: "" })}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Another Test
              </Button>
              {fields.length > 3 && (
                <Collapsible 
                  open={!isTestsCollapsed} 
                  onOpenChange={(open) => setIsTestsCollapsed(!open)}
                  className="inline-flex"
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {isTestsCollapsed ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              )}
            </div>
          </div>

          {/* Table Headers */}
          <div className="grid grid-cols-12 gap-3 mb-2 px-4 py-2 bg-muted/50 rounded-t-md">
            <Label className="col-span-5 text-xs font-medium">Test Name</Label>
            <Label className="col-span-3 text-xs font-medium">Result</Label>
            <Label className="col-span-3 text-xs font-medium">Normal Range</Label>
            <div className="col-span-1"></div> {/* For delete button */}
          </div>

          <Collapsible open={!isTestsCollapsed || fields.length <= 3}>
            <CollapsibleContent>
              <ScrollArea className="max-h-[300px] overflow-auto">
                <div className="space-y-2 pr-2">
                  {fields.map((field, index) => (
                    <div 
                      key={field.id} 
                      className="grid grid-cols-12 gap-3 px-3 py-2 bg-muted/30 rounded-md border border-border/40 items-center"
                    >
                      <FormField
                        control={form.control}
                        name={`tests.${index}.test_name`}
                        render={({ field }) => (
                          <FormItem className="col-span-5 mb-0">
                            <FormControl>
                              <Input placeholder="e.g., Blood Glucose" {...field} className="h-9" />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`tests.${index}.result`}
                        render={({ field }) => (
                          <FormItem className="col-span-3 mb-0">
                            <FormControl>
                              <Input placeholder="e.g., 120 mg/dL" {...field} className="h-9" />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`tests.${index}.normal_range`}
                        render={({ field }) => (
                          <FormItem className="col-span-3 mb-0">
                            <FormControl>
                              <Input placeholder="e.g., 70-100 mg/dL" {...field} className="h-9" />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <div className="col-span-1 text-right">
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
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>

          {isTestsCollapsed && fields.length > 3 && (
            <div className="text-center text-sm text-muted-foreground py-2">
              {fields.length} tests added. Click to expand.
            </div>
          )}
          
          <FormField
            control={form.control}
            name="test_date"
            render={({ field }) => (
              <FormItem className="mt-4">
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
