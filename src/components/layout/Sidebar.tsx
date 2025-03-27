
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Users, 
  FileText, 
  TestTube, 
  BarChart, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Patients", icon: Users, path: "/patients" },
    { name: "Prescriptions", icon: FileText, path: "/prescriptions" },
    { name: "Lab Reports", icon: TestTube, path: "/lab-reports" },
    { name: "Analytics", icon: BarChart, path: "/analytics" },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col border-r border-border card-shadow",
        "bg-sidebar transition-medium relative",
        collapsed ? "w-[80px]" : "w-[250px]"
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-border">
        <div className="flex items-center space-x-2 overflow-hidden">
          <div className="w-8 h-8 rounded-md bg-medical-blue flex items-center justify-center">
            <span className="text-white font-semibold">Rx</span>
          </div>
          <h1 
            className={cn(
              "font-semibold text-lg transition-medium", 
              collapsed ? "opacity-0 w-0" : "opacity-100"
            )}
          >
            PrescriptoLab
          </h1>
        </div>
      </div>

      <div className="flex-1 py-6">
        <nav className="px-2 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-3 rounded-lg transition-medium group",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon 
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  location.pathname === item.path 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-foreground"
                )} 
              />
              <span 
                className={cn(
                  "ml-3 font-medium transition-medium", 
                  collapsed ? "opacity-0 w-0" : "opacity-100"
                )}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-background rounded-full border border-border flex items-center justify-center card-shadow"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
