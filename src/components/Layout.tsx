"use client";
import { ReactNode } from "react";
import Sidebar from "@/components/ui/sidebar";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex">
      {/* Sidebar is fixed and will be on the left */}
      <Sidebar />
      {/* Main content area, offset by the width of the sidebar */}
      <main className="ml-64 p-4 w-full">{children}</main>
    </div>
  );
};

export default Layout;
