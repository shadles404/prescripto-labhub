
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow,
  TableCell 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Accordion } from "@/components/ui/accordion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useLabReports, type LabReport } from "@/hooks/useLabReports";
import LabReportForm from "@/components/lab-reports/LabReportForm";
import LabReportDetailDialog from "@/components/lab-reports/LabReportDetailDialog";
import ExpandableTestRow from "@/components/lab-reports/ExpandableTestRow";

const LabReports = () => {
  const { labReports, loading, addLabReport } = useLabReports();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Filter reports based on search term and status filter
  const filteredReports = labReports.filter(report => {
    const matchesSearch = 
      report.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.test_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && report.status === statusFilter;
  });

  // Group reports by patient
  const groupedReports = filteredReports.reduce((acc, report) => {
    const patientId = report.patient_id;
    
    if (!acc[patientId]) {
      acc[patientId] = {
        patientId,
        patientName: report.patient.name,
        tests: []
      };
    }
    
    acc[patientId].tests.push(report);
    
    return acc;
  }, {} as Record<string, { patientId: string; patientName: string; tests: LabReport[] }>);

  // Sort tests within each patient by date (newest first)
  Object.values(groupedReports).forEach(group => {
    group.tests.sort((a, b) => 
      new Date(b.test_date).getTime() - new Date(a.test_date).getTime()
    );
  });

  const handleAddLabReport = async (formData: any) => {
    try {
      await addLabReport(formData);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding lab report:", error);
    }
  };

  const handleViewReport = (report: LabReport) => {
    setSelectedReport(report);
    setShowDetailDialog(true);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header title="Lab Reports" />
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-medium mb-1">Lab Reports</h2>
              <p className="text-muted-foreground">
                Manage laboratory test reports for your patients
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Lab Report
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by patient name or test..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden card-shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead colSpan={5}>Patient & Tests Information</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Show skeleton loading state
                  Array(3).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                          <Skeleton className="h-6 w-20 rounded-full" />
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-6 w-24 rounded-full" />
                          <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : Object.values(groupedReports).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">No lab reports found. Try different search criteria or create a new report.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {Object.values(groupedReports).map(({ patientId, patientName, tests }) => (
                      <ExpandableTestRow 
                        key={patientId}
                        patientId={patientId}
                        patientName={patientName}
                        tests={tests}
                        onViewReport={handleViewReport}
                      />
                    ))}
                  </Accordion>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Lab Report</DialogTitle>
            </DialogHeader>
            <LabReportForm onSubmit={handleAddLabReport} />
          </DialogContent>
        </Dialog>

        <LabReportDetailDialog 
          report={selectedReport} 
          open={showDetailDialog} 
          onOpenChange={setShowDetailDialog} 
        />
      </div>
    </PageTransition>
  );
};

export default LabReports;
