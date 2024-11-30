import { Outlet, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  LogOut,
  ChevronRight,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/use-theme';
import { toast } from 'sonner';

export default function ClientLayout() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Function to get header title based on current path
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case '/client':
        return 'Dashboard';
      case '/client/profile':
        return 'Profile';
      case location.pathname.match(/^\/client\/projects\/\d+/)?.input:
        return 'Project Details';
      default:
        return 'Dashboard';
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/client",
    },
    {
      title: "Profile",
      icon: User,
      href: "/client/profile",
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card">
        {/* Logo Section */}
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Client Portal
          </h1>
        </div>
        
        <Separator />

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  "hover:bg-accent group",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <Separator className="my-4" />

        {/* User Section */}
        <div className="p-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Client User</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="mr-2"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start mt-2 text-muted-foreground hover:text-destructive"
            onClick={() => {
              logout();
              toast.success('Logged out successfully');
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center justify-between px-6">
          <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
          <div className="flex items-center gap-4">
            {/* Add header actions here if needed */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 