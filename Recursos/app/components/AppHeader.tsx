import { Bell, ChevronLeft, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  showNotifications?: boolean;
  notificationCount?: number;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  action?: React.ReactNode;
}

export function AppHeader({ 
  title, 
  subtitle, 
  showNotifications = true,
  notificationCount = 0,
  showBack = false,
  onBack,
  showMenu = false,
  action,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-border z-40 safe-area-top">
      <div className="max-w-screen-sm mx-auto px-5 py-4">
        <div className="flex items-center justify-between">
          {showBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="mr-2 -ml-2 hover:bg-slate-100"
              aria-label="Volver"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-slate-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-1 ml-3">
            {action}
            
            {showNotifications && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-slate-100 text-slate-600"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge 
                    className="absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 flex items-center justify-center p-0 text-[10px] bg-rose-500 text-white border-2 border-white"
                  >
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Badge>
                )}
              </Button>
            )}
            
            {showMenu && (
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-slate-100 text-slate-600"
                aria-label="Menú"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
