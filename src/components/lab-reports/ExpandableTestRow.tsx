
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { LabReport } from "@/hooks/useLabReports";

interface ExpandableTestRowProps {
  patientId: string;
  patientName: string;
  tests: LabReport[];
  onViewReport: (report: LabReport) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-medical-green/10 text-medical-green border-medical-green/20";
    case "pending":
      return "bg-medical-orange/10 text-medical-orange border-medical-orange/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const ExpandableTestRow: React.FC<ExpandableTestRowProps> = ({ 
  patientId, 
  patientName, 
  tests, 
  onViewReport 
}) => {
  const latestTest = tests[0]; // Assuming tests are sorted by date (newest first)
  const testCount = tests.length;
  
  return (
    <AccordionItem value={patientId} className="border-0">
      <TableRow className="cursor-pointer">
        <TableCell className="p-0" colSpan={5}>
          <AccordionTrigger className="py-4 px-4 w-full hover:no-underline">
            <div className="flex flex-1 items-center">
              <div className="flex-1">
                <p className="font-medium">{patientName}</p>
                <p className="text-xs text-muted-foreground">ID: {patientId.substring(0, 8)}</p>
              </div>
              <div className="flex-1">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {testCount} {testCount === 1 ? 'Test' : 'Tests'}
                </Badge>
              </div>
              <div className="flex-1">
                {new Date(latestTest.test_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <Badge className={`${getStatusColor(latestTest.status || 'pending')} capitalize`}>
                    Latest: {latestTest.status || 'pending'}
                  </Badge>
                </div>
              </div>
            </div>
          </AccordionTrigger>
        </TableCell>
      </TableRow>
      <AccordionContent className="pb-0 pt-0">
        <div className="px-4 pb-4">
          <div className="rounded-md border bg-muted/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id} className="bg-background">
                    <TableCell>{test.test_name}</TableCell>
                    <TableCell>
                      {new Date(test.test_date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(test.status || 'pending')} capitalize`}>
                        {test.status || 'pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>{test.result}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewReport(test);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ExpandableTestRow;
