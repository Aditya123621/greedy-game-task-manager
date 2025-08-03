import DrawerContainer from "@/components/DrawerContainer";
import Header from "@/components/Header";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <DrawerContainer />
      <Header />
      <div className="pt-18 min-h-screen max-w-8xl mx-auto">{children}</div>
    </>
  );
};

export default MainLayout;
