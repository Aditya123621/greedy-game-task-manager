"use client";
import ApplicationSideBar from "@/components/ApplicationSideBar";
import DrawerContainer from "@/components/DrawerContainer";
import Header from "@/components/Header";
import { useGetUserInfo } from "@/hooks/useUserProfile";
import { RootState } from "@/store/store";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const MainLayout = ({ children }: { children: ReactNode }) => {
  const { data: userInfo } = useGetUserInfo();
  const isOpen = useSelector((state: RootState) => state.common.isSidebarOpen);
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <DrawerContainer />
      <ApplicationSideBar />
      <div
        className={`flex-1 transition-all duration-300 ${
          userInfo?.role === "super_admin" ? (isOpen ? "ml-80" : "ml-18") : ""
        }`}
      >
        <Header />
        <div className="pt-18 min-h-screen max-w-8xl mx-auto flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
