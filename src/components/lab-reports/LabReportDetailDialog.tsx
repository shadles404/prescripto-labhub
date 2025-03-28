
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from "lucide-react";
import { type LabReport } from "@/hooks/useLabReports";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface LabReportDetailDialogProps {
  report: LabReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const LabReportDetailDialog = ({ report, open, onOpenChange }: LabReportDetailDialogProps) => {
  if (!report) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('lab-report-print');
    const originalContents = document.body.innerHTML;
    
    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      toast.error("Could not print lab report");
    }
  };

  const handleDownload = () => {
    if (!report) return;
    
    const reportData = {
      id: report.id,
      patientId: report.patient_id,
      patientName: report.patient.name,
      testName: report.test_name,
      result: report.result,
      normalRange: report.normal_range || "Not specified",
      testDate: new Date(report.test_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      status: report.status
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `lab-report-${reportData.testName.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Lab report downloaded successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Lab Report Details</DialogTitle>
          <DialogDescription>
            Complete information about the {report.test_name} test
          </DialogDescription>
        </DialogHeader>
        
        <div id="lab-report-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Badge className={`${getStatusColor(report.status || 'pending')} capitalize`}>
                {report.status || 'pending'}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Patient Name</h3>
              <p className="text-base font-medium">{report.patient.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Test Name</h3>
              <p className="text-base font-medium">{report.test_name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Result</h3>
              <p className="text-base">{report.result}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Normal Range</h3>
              <p className="text-base">{report.normal_range || "Not specified"}</p>
            </div>
            
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">Test Date</h3>
              <p className="text-base">{new Date(report.test_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LabReportDetailDialog;
