
import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout;
