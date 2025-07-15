import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MdNotifications, MdSettings } from "react-icons/md";
import { FaGem } from "react-icons/fa";
import { AccountLevel } from "@/lib/enums/role.enum";
import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { FaUser, FaHistory, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { LogOut } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  showNotifications?: boolean;
  showSettings?: boolean;
  className?: string;
}

export function AppHeader({
  title = 'Dashboard',
  showNotifications = true,
  showSettings = true,
  className,
}: AppHeaderProps) {
  const router = useRouter();
  const { user, logout } = useContext(UserContext);

  const accountLevel = user?.accountLevel || AccountLevel.REGULAR;
  const levelColors: Record<AccountLevel, string> = {
    [AccountLevel.PLATINUM]: 'text-emerald-700 bg-emerald-100',
    [AccountLevel.GOLD]: 'text-yellow-700 bg-yellow-100',
    [AccountLevel.RUBY]: 'text-red-700 bg-red-100',
    [AccountLevel.REGULAR]: 'text-gray-700 bg-gray-100',
  };

  const handleLogout = () => {
    logout();
    toast({ title: "Success", description: "Logged out successfully" });
    router.push('/login');
  };

  return (
    <header
      className={`sticky border bg-muted/50 rounded-lg mt-3 mb-5 mx-2 top-3 z-50 flex h-18 shrink-0 items-center gap-2 transition-all duration-300 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-17 backdrop-blur-lg border-b ${className}`}
    >
      <div className="flex items-center justify-between w-full px-4">
        <div className="flex items-center gap-8">
          <SidebarTrigger className="-ml-1" />
          <div
            className={`flex items-center gap-1.5 font-semibold text-[13px] px-3.5 py-1.5 rounded-lg ${levelColors[accountLevel]} uppercase tracking-wide`}
          >
            <FaGem className="animate-pulse" size={14} />
            {accountLevel} Account
          </div>
        </div>
        <div className="flex items-center gap-4">
         
          {showSettings && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MdSettings size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <FaUser className="mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FaHistory className="mr-2" />
                  Transactions
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Button 
                  variant="outline" 
                  className="gap-2 w-full md:w-auto rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-200 transition-all duration-200 flex items-center justify-center" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}