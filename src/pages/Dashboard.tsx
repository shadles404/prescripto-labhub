
import React from "react";
import { Users, FileText, TestTube, Calendar, Activity } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import StatCard from "@/components/dashboard/StatCard";
import Chart from "@/components/dashboard/Chart";

// Sample data for charts
const patientData = [
  { name: "Jan", count: 65 },
  { name: "Feb", count: 59 },
  { name: "Mar", count: 80 },
  { name: "Apr", count: 81 },
  { name: "May", count: 56 },
  { name: "Jun", count: 55 },
  { name: "Jul", count: 40 },
];

const prescriptionData = [
  { name: "Jan", count: 45 },
  { name: "Feb", count: 52 },
  { name: "Mar", count: 49 },
  { name: "Apr", count: 63 },
  { name: "May", count: 59 },
  { name: "Jun", count: 80 },
  { name: "Jul", count: 51 },
];

const Dashboard = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header title="Dashboard" />
        
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-medium mb-1">Welcome back, Dr. Johnson</h2>
            <p className="text-muted-foreground">
              Here's what's happening in your practice today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Patients" 
              value="648" 
              icon={Users}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard 
              title="Prescriptions" 
              value="2,356" 
              icon={FileText}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard 
              title="Lab Reports" 
              value="842" 
              icon={TestTube}
              trend={{ value: 4, isPositive: true }}
            />
            <StatCard 
              title="Appointments" 
              value="53" 
              icon={Calendar}
              trend={{ value: 2, isPositive: false }}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Chart 
              title="Patient Growth" 
              data={patientData} 
              dataKey="count" 
            />
            <Chart 
              title="Prescriptions Issued" 
              data={prescriptionData} 
              dataKey="count" 
            />
          </div>

          <div className="mt-8 bg-card rounded-xl p-6 border border-border/40 card-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-base font-medium">Recent Activity</h3>
              <button className="text-sm text-primary font-medium">
                View All
              </button>
            </div>
            
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
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
