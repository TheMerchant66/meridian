"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import {
  BarChart3,
  Bell,
  ChevronDown,
  CreditCard,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Menu,
  Package2,
  Settings,
  Shield,
  Users,
  User,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface DashboardLayoutProps {
  children: ReactNode
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/admin-dashboard/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Customers",
    href: "/admin-dashboard/manage-users",
    icon: Users,
    badge: null,
  },
 
  {
    title: "Transactions",
    href: "/admin-dashboard/transactions",
    icon: DollarSign,
    badge: "43",
  },
  
  
  {
    title: "Settings",
    href: "/admin-dashboard/settings",
    icon: Settings,
    badge: null,
  },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const NavItem = ({ item, mobile = false }: { item: (typeof navigationItems)[0]; mobile?: boolean }) => {
    const active = isActive(item.href)

    return (
      <Link
        href={item.href}
        onClick={() => mobile && setIsSheetOpen(false)}
        className={`
          flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
          ${
            active
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }
        `}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1">{item.title}</span>
        {item.badge && (
          <Badge variant={active ? "secondary" : "outline"} className="ml-auto h-5 px-1.5 text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col">
          {/* Logo Section */}
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package2 className="h-4 w-4" />
              </div>
              <span className="text-lg">BankAdmin</span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid gap-1 px-4">
              <div className="mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
                  Main Menu
                </p>
              </div>
              {navigationItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </nav>

            <Separator className="my-4 mx-4" />

            {/* Quick Actions */}
            <div className="px-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2 mb-2">
                Quick Actions
              </p>
              <div className="grid gap-1">
                <Button variant="ghost" size="sm" className="justify-start gap-2 h-9">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </Button>
              </div>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                    <AvatarFallback>JA</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">John Admin</p>
                    <p className="text-xs text-muted-foreground">admin@bank.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Preferences
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 md:hidden lg:h-[60px] lg:px-6">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex h-full flex-col">
                {/* Mobile Logo */}
                <div className="flex h-14 items-center border-b px-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Package2 className="h-4 w-4" />
                    </div>
                    <span className="text-lg">BankAdmin</span>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="flex-1 overflow-auto py-4">
                  <nav className="grid gap-1 px-4">
                    <div className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
                        Main Menu
                      </p>
                    </div>
                    {navigationItems.map((item) => (
                      <NavItem key={item.href} item={item} mobile />
                    ))}
                  </nav>
                </div>

                {/* Mobile User Profile */}
                <div className="border-t p-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                      <AvatarFallback>JA</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">John Admin</p>
                      <p className="text-xs text-muted-foreground">admin@bank.com</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-3 justify-start gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Mobile Title */}
          <div className="flex-1">
            <h1 className="text-lg font-semibold">BankAdmin</h1>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
              <AvatarFallback>JA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
