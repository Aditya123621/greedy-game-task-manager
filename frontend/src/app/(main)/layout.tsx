import DrawerContainer from "@/components/Common/DrawerContainer";
import Header from "@/components/Common/Header";
import React, { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Header />
      <div className="pt-18 min-h-screen">{children}</div>
      <DrawerContainer />
    </>
  );
};

export default MainLayout;
