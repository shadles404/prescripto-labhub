
import React from "react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileUp, Filter, Flask, Download, Eye } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Sample data for lab reports
const LAB_REPORTS = [
  {
    id: "lab1",
    patientName: "Sarah Johnson",
    patientId: "P001",
    testName: "Complete Blood Count",
    date: "2023-10-15",
    status: "completed"
  },
  {
    id: "lab2",
    patientName: "Michael Chen",
    patientId: "P002",
    testName: "Lipid Panel",
    date: "2023-09-28",
    status: "completed"
  },
  {
    id: "lab3",
    patientName: "Emily Rodriguez",
    patientId: "P003",
    testName: "Thyroid Function Test",
    date: "2023-10-02",
    status: "pending"
  },
  {
    id: "lab4",
    patientName: "David Wilson",
    patientId: "P004",
    testName: "Liver Function Test",
    date: "2023-10-18",
    status: "completed"
  },
  {
    id: "lab5",
    patientName: "Sarah Johnson",
    patientId: "P001",
    testName: "Urinalysis",
    date: "2023-10-10",
    status: "completed"
  },
  {
    id: "lab6",
    patientName: "Michael Chen",
    patientId: "P002",
    testName: "HbA1c",
    date: "2023-09-15",
    status: "completed"
  },
];

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
              <Button variant="outline">
                <FileUp className="h-4 w-4 mr-2" />
                Upload Report
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Test Request
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
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select>
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
                {LAB_REPORTS.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{report.patientName}</p>
                        <p className="text-xs text-muted-foreground">ID: {report.patientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                          <Flask className="h-4 w-4 text-primary" />
                        </div>
                        {report.testName}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(report.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(report.status)} capitalize`}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                              <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LabReports;
