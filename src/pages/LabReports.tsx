
import React, { useState } from "react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, TestTube, Download, Eye, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useLabReports, type LabReport } from "@/hooks/useLabReports";
import LabReportForm from "@/components/lab-reports/LabReportForm";
import LabReportDetailDialog from "@/components/lab-reports/LabReportDetailDialog";

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
                  <TableHead>Patient</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  // Show skeleton loading state
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                          </div>
                          <Skeleton className="h-5 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">No lab reports found. Try different search criteria or create a new report.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewReport(report)}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.patient.name}</p>
                          <p className="text-xs text-muted-foreground">ID: {report.patient_id.substring(0, 8)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <TestTube className="h-4 w-4 text-primary" />
                          </div>
                          {report.test_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(report.test_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(report.status || 'pending')} capitalize`}>
                          {report.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleViewReport(report);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReport(report);
                              const printContent = document.getElementById('lab-report-print');
                              if (printContent) {
                                const originalContents = document.body.innerHTML;
                                document.body.innerHTML = printContent.innerHTML;
                                window.print();
                                document.body.innerHTML = originalContents;
                                window.location.reload();
                              }
                            }}>
                              <Printer className="h-4 w-4 mr-2" />
                              Print
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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
