import Image from "next/image";
import React, { ReactNode } from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/auth-panel-image.svg"
          alt="Authentication panel"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
