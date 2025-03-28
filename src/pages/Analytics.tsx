
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Colors for charts
const GENDER_COLORS = ["#0A84FF", "#BF5AF2", "#64D2FF", "#30D158", "#FF9F0A"];

const Analytics = () => {
  const { data, loading, error } = useAnalyticsData();
  
  const renderSkeletonChart = (height: number = 350) => (
    <div className="w-full flex flex-col space-y-2 p-4">
      <Skeleton className="h-4 w-1/4 mb-4" />
      <Skeleton className="h-[calc(100%-32px)] w-full" style={{ height: `${height - 32}px` }} />
    </div>
  );
  
  const renderErrorState = () => (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Unable to load analytics data. Please try again later.
      </AlertDescription>
    </Alert>
  );
  
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
          
          {error && renderErrorState()}
          
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
                      {loading ? (
                        renderSkeletonChart()
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data.monthlyData}>
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
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Most Prescribed Medicines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      {loading ? (
                        renderSkeletonChart()
                      ) : data.medicineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.medicineData} layout="vertical">
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
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No prescription data available yet</p>
                        </div>
                      )}
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
                      {loading ? (
                        renderSkeletonChart(300)
                      ) : data.testData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.testData}>
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
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No lab test data available yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Patient Demographics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {loading ? (
                        renderSkeletonChart(300)
                      ) : data.genderData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data.genderData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {data.genderData.map((entry, index) => (
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
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No patient data available yet</p>
                        </div>
                      )}
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
                      {loading ? (
                        renderSkeletonChart(350)
                      ) : data.ageData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.ageData}>
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
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No patient data available yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Gender Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                    <div className="h-[350px] w-full">
                      {loading ? (
                        renderSkeletonChart(350)
                      ) : data.genderData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data.genderData}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {data.genderData.map((entry, index) => (
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
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No patient data available yet</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="prescriptions">
              <div className="grid grid-cols-1 gap-6">
                <Card className="card-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">Most Prescribed Medicines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      renderSkeletonChart(400)
                    ) : data.medicineData.length > 0 ? (
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.medicineData}>
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
                              fill="#30D158" 
                              radius={[4, 4, 0, 0]} 
                              barSize={50}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No prescription data available yet</p>
                      </div>
                    )}
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
                    {loading ? (
                      renderSkeletonChart(400)
                    ) : data.testData.length > 0 ? (
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.testData}>
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
                              fill="#64D2FF" 
                              radius={[4, 4, 0, 0]} 
                              barSize={50}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-muted-foreground">No lab test data available yet</p>
                      </div>
                    )}
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
