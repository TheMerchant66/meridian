"use client";

import { AppSidebar } from "@/components/app-sidebar";
import ContactUsPage from "@/components/user-dashboard/contact-us-page"
import { AppHeader } from "@/components/app-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";


export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Contact-Us" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-10 pt-0">
          <div className="min-h-[100vh] md:min-h-min flex-1 rounded-xl">
            <ContactUsPage />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
