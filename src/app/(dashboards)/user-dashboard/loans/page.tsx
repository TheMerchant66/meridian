"use client"

import { AppSidebar } from "@/components/app-sidebar";

import { LoansSection } from "./loans-section";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppHeader } from "@/components/app-header";
import { LoanFAQ } from "./loan-faq"


export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Dashboard" />
        <div className="flex flex-1 flex-col gap-4 px-4 sm:px-6 md:px-10 py-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <LoansSection />
            <div className="mt-6">
              <LoanFAQ />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
