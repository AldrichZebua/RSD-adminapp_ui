"use client";

import { SessionProvider } from "next-auth/react";
import TopMenu from "@/components/layouts/TopMenu";
// import SidebarPanelFull from "@/components/layouts/SidebarPanelFull";
import { ProgressProvider } from '@bprogress/next/app';

export default function SetLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProgressProvider>
      <SessionProvider>
        <div className="flex flex-col min-h-screen">
          <div className="flex">
            <div className="flex-grow">
              <TopMenu />
            </div>
          </div>
          
          <main className="flex-grow w-full bg-gray-100 lg:ml-[250px] p-6">
            {children}
          </main>
        </div>
      </SessionProvider>
    </ProgressProvider>
  );
}
