
import { GovernmentHeader } from "./GovernmentHeader";
import { PlatformInfo } from "./PlatformInfo";
import { AuthForm } from "./AuthForm";
import { FooterInfo } from "./FooterInfo";

export const AuthPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex flex-col">
      <GovernmentHeader />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <PlatformInfo />
          <AuthForm />
          <FooterInfo />
        </div>
      </div>
    </div>
  );
};
