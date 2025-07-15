import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { BankCard } from "@/components/bank-card";
import { InvestmentHistory } from "../investment-transactions";
import { HiArrowCircleUp } from "react-icons/hi";
import { IoMdListBox } from "react-icons/io";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ArrowRightIcon } from "lucide-react";
import { InvestmentPlans } from "../investment-plans";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-17">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 py-4 px-10 pt-0">
        
        
         
          <div className=" min-h-[100vh] flex-1 rounded-xl md:min-h-min">
            <InvestmentHistory />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
