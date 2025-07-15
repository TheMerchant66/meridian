"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { BankCard } from "@/components/bank-card";
import ProfileSettingsPage from "./profile-settings";
import { HiArrowCircleUp } from "react-icons/hi";
import { IoMdListBox } from "react-icons/io";
import { AppHeader } from "@/components/app-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrowRightIcon } from "lucide-react";
import { ActivityTable } from "../transactions/activity-table";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Dashboard" />
        <div className="flex flex-1 flex-col gap-4 px-4 sm:px-6 md:px-10 py-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min w-full">
            <ProfileSettingsPage />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
