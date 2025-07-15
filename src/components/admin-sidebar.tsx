"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
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
import { useContext } from "react"
import { UserContext } from "@/contexts/UserContext"

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
} from "@/components/ui/sidebar"

import {
  MdDashboard,
  MdReceipt,
  MdDescription,
  MdPieChart,
  MdMessage,
  MdSettings,
  MdAttachMoney,
} from "react-icons/md"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useContext(UserContext);

  const data = {
    user: {
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email || "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Aveline Tellez",
        logo: Command,
        plan: "ID: 1234567890",
      }
    ],
    navMain: [
      {
        title: "Overview",
        url: "/admin-dashboard",
        icon: MdDashboard,
      },
      {
        title: "Manage-Users",
        url: "/admin-dashboard/manage-users",
        icon: MdReceipt,
      },
      {
        title: "Transactions",
        url: "/admin-dashboard/transactions",
        icon: MdDescription,
      },
      {
        title: "Settings",
        url: "/admin-dashboard/admin-settings",
        icon: MdSettings,
      },
    ],
  }

  return (
    <Sidebar className="p-3" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
