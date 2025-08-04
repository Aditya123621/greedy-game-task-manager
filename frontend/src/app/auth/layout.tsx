import { ReactNode } from "react";
import AuthLeftPanelImage from "@@/images/auth-panel-image.svg";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex overflow-hidden">
      <AuthLeftPanelImage className="hidden lg:block h-screen" />

      <div className="flex-auto flex items-center justify-center p-6 lg:p-12 bg-white">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
