
import React from "react";
import { Users, FileText, TestTube, Calendar, Activity, RefreshCw } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import Chart from "@/components/dashboard/Chart";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";

const Dashboard = () => {
  const { stats, loading, error, refetch } = useDashboardStats();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header title="Dashboard" />
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-medium mb-1">Welcome back, Doctor</h2>
              <p className="text-muted-foreground">
                Here's what's happening in the hospital today
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-6 rounded-xl bg-card card-shadow border border-border/40">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-8 w-20 mb-4" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <StatCard 
                  title="Total Patients" 
                  value={stats.totalPatients.toString()} 
                  icon={Users}
                  trend={{ value: 12, isPositive: true }}
                />
                <StatCard 
                  title="Prescriptions" 
                  value={stats.totalPrescriptions.toString()} 
                  icon={FileText}
                  trend={{ value: 8, isPositive: true }}
                />
                <StatCard 
                  title="Lab Reports" 
                  value={stats.totalLabReports.toString()} 
                  icon={TestTube}
                  trend={{ value: 4, isPositive: true }}
                />
                <StatCard 
                  title="Appointments" 
                  value={stats.appointments.toString()} 
                  icon={Calendar}
                  trend={{ value: 2, isPositive: false }}
                />
              </>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <>
                {[1, 2].map((i) => (
                  <div key={i} className="p-6 rounded-xl bg-card card-shadow border border-border/40 h-[372px]">
                    <Skeleton className="h-6 w-40 mb-6" />
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <Chart 
                  title="Patient Growth" 
                  data={stats.patientData} 
                  dataKey="count" 
                />
                <Chart 
                  title="Prescriptions Issued" 
                  data={stats.prescriptionData} 
                  dataKey="count" 
                />
              </>
            )}
          </div>

          <div className="mt-8 bg-card rounded-xl p-6 border border-border/40 card-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-base font-medium">Recent Activity</h3>
              <button className="text-sm text-primary font-medium">
                View All
              </button>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center space-x-3 py-2 border-b border-border/40">
                    <div className="p-2 rounded-full bg-muted">
                      <Skeleton className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-full max-w-md mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { action: "Prescription created for Sarah Johnson", time: "5 mins ago" },
                  { action: "Lab report uploaded for Michael Chen", time: "1 hour ago" },
                  { action: "New patient registered: Emily Rodriguez", time: "3 hours ago" },
                  { action: "Prescription updated for David Wilson", time: "Yesterday" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2 border-b border-border/40 last:border-0">
                    <div className="p-2 rounded-full bg-muted">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
