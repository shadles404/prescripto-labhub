
import React from "react";
import PageTransition from "@/components/layout/PageTransition";
import Header from "@/components/layout/Header";
import { 
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer 
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

// Sample data for charts
const MEDICINE_DATA = [
  { name: "Amoxicillin", count: 124 },
  { name: "Amlodipine", count: 98 },
  { name: "Lisinopril", count: 86 },
  { name: "Metformin", count: 72 },
  { name: "Atorvastatin", count: 65 },
];

const TEST_DATA = [
  { name: "Complete Blood Count", count: 48 },
  { name: "Lipid Panel", count: 39 },
  { name: "HbA1c", count: 35 },
  { name: "Liver Function", count: 28 },
  { name: "Urinalysis", count: 25 },
];

const MONTHLY_DATA = [
  { name: "Jan", patients: 45, prescriptions: 78, tests: 32 },
  { name: "Feb", patients: 52, prescriptions: 85, tests: 37 },
  { name: "Mar", patients: 49, prescriptions: 90, tests: 42 },
  { name: "Apr", patients: 63, prescriptions: 108, tests: 46 },
  { name: "May", patients: 59, prescriptions: 102, tests: 41 },
  { name: "Jun", patients: 65, prescriptions: 118, tests: 50 },
  { name: "Jul", patients: 61, prescriptions: 110, tests: 45 },
];

const GENDER_DATA = [
  { name: "Male", value: 285 },
  { name: "Female", value: 348 },
  { name: "Other", value: 15 },
];

const GENDER_COLORS = ["#0A84FF", "#BF5AF2", "#64D2FF"];

const AGE_DATA = [
  { name: "0-18", count: 78 },
  { name: "19-35", count: 142 },
  { name: "36-50", count: 169 },
  { name: "51-65", count: 153 },
  { name: "65+", count: 106 },
];

const Analytics = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Header title="Analytics" />
        
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-medium mb-1">Analytics & Reports</h2>
            <p className="text-muted-foreground">
              Insights and statistics for your medical practice
            </p>
          </div>
          
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              <TabsTrigger value="tests">Lab Tests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Monthly Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={MONTHLY_DATA}>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              borderRadius: "0.5rem",
                              border: "1px solid hsl(var(--border))",
                            }}
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="patients" 
                            stroke="#0A84FF" 
                            strokeWidth={2} 
                            dot={{ r: 3 }} 
                            activeDot={{ r: 5 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="prescriptions" 
                            stroke="#30D158" 
                            strokeWidth={2} 
                            dot={{ r: 3 }} 
                            activeDot={{ r: 5 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="tests" 
                            stroke="#BF5AF2" 
                            strokeWidth={2} 
                            dot={{ r: 3 }} 
                            activeDot={{ r: 5 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Most Prescribed Medicines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MEDICINE_DATA} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} horizontal={true} vertical={false} />
                          <XAxis type="number" />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            width={120} 
                            tick={{ fontSize: 12 }} 
                          />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              borderRadius: "0.5rem",
                              border: "1px solid hsl(var(--border))",
                            }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="#0A84FF" 
                            radius={[0, 4, 4, 0]} 
                            barSize={20}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="card-shadow lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-base">Common Lab Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={TEST_DATA}>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              borderRadius: "0.5rem",
                              border: "1px solid hsl(var(--border))",
                            }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="#64D2FF" 
                            radius={[4, 4, 0, 0]} 
                            barSize={40}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Patient Demographics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={GENDER_DATA}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {GENDER_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              borderRadius: "0.5rem",
                              border: "1px solid hsl(var(--border))",
                            }}
                            formatter={(value) => [`${value} patients`, 'Count']}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="patients">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Age Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={AGE_DATA}>
                          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              borderRadius: "0.5rem",
                              border: "1px solid hsl(var(--border))",
                            }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="#BF5AF2" 
                            radius={[4, 4, 0, 0]} 
                            barSize={50}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={GENDER_DATA}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {GENDER_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              borderRadius: "0.5rem",
                              border: "1px solid hsl(var(--border))",
                            }}
                            formatter={(value) => [`${value} patients`, 'Count']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="prescriptions">
              <div className="grid grid-cols-1 gap-6">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Prescription Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-10 text-muted-foreground">
                      Detailed prescription analytics will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tests">
              <div className="grid grid-cols-1 gap-6">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Lab Test Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center py-10 text-muted-foreground">
                      Detailed lab test analytics will be available soon.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
};

export default Analytics;
