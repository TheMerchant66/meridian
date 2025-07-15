"use client";

import { AppSidebar } from "@/components/app-sidebar";

import { AppHeader } from "@/components/app-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import AccountStatementPage from "./account-statement-page";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Dashboard" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:px-10 md:py-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min w-full">
            <AccountStatementPage />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
