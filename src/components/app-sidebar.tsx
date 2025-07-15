"use client"

import * as React from "react"
import { useContext } from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  User,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  Receipt,
  FileText,
  MessageSquare,
  Banknote,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { UserContext } from "@/contexts/UserContext"
import Logo from "./common/Logo"

import {
  MdDashboard,
  MdReceipt,
  MdDescription,
  MdPieChart,
  MdMessage,
  MdSettings,
  MdAttachMoney,
} from "react-icons/md"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { user } = useContext(UserContext);
  
  const data = {
    user: {
      name: "shadcn",
      email:`${user?.firstName}`,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User Name',
        logo: User,
        plan: `ACC NO: ${user?.checkingAccount?.accountNumber || '***********'}`,
      }
    ],
    navMain: [
      {
        title: "Overview",
        url: "/user-dashboard",
        icon: MdDashboard,
      },
      {
        title: "Transactions",
        url: "/user-dashboard/transactions",
        icon: MdReceipt,
      },
      {
        title: "Account Statement",
        url: "/user-dashboard/account-statement",
        icon: MdDescription,
      },
      // {
      //   title: "Investments",
      //   url: "#",
      //   icon: MdPieChart,
      //   isDropdown: true,
      //   items: [
      //     {
      //       title: "Overview",
      //       url: "/user-dashboard/investments",
      //     },
      //     {
      //       title: "Plans",
      //       url: "/user-dashboard/investments/plans",
      //     },
      //     {
      //       title: "History",
      //       url: "/user-dashboard/investments/transactions",
      //     },
      //   ],
      // },
      {
        title: "Contact Us",
        url: "/user-dashboard/contact-us",
        icon: MdMessage,
      },
      {
        title: "Settings",
        url: "/user-dashboard/profile-settings",
        icon: MdSettings,
      },
      {
        title: "Loans",
        url: "/user-dashboard/loans",
        icon: MdAttachMoney,
      },
    ],
  }

  return (
    <Sidebar className="p-3" collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center mt-2.5 mb-8  p-3 rounded-xl w-48 mx-auto">
          
          {state === "expanded" && (
           <Logo size="large" variant="black" />
          )}
        </div>
        {state === "expanded" && <TeamSwitcher teams={data.teams} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
