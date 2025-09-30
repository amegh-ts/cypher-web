import React from "react";
import { Header } from "./header";
import AdvanceSidebar from "./AdvanceSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <AdvanceSidebar>
      <Header />
      {children}
    </AdvanceSidebar>
  );
};

export default MainLayout;
