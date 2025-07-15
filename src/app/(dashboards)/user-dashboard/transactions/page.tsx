"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { BankCard } from "@/components/bank-card";
import { TransactionChart } from "./transaction-chart";
import { ActivityTable } from "./activity-table";
import { HiArrowCircleUp } from "react-icons/hi";
import { IoMdListBox } from "react-icons/io";
import { AppHeader } from "@/components/app-header";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrowRightIcon } from "lucide-react";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title="Dashboard" />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-10 pt-0">
          <div className="min-h-[100vh] md:min-h-min flex-1 rounded-xl">
            <ActivityTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
