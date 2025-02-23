"use client";

import { NavigationBar } from "@/components/ui/navigation-bar";
import { SessionProvider } from "next-auth/react";

type ClientLayoutProps = {
  children: React.ReactNode;
};

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen bg-strava-gray-100">
        <NavigationBar />
        <main className="flex-1 pb-16 md:pb-8">{children}</main>
      </div>
    </SessionProvider>
  );
};
