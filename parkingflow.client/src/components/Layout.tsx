
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-primary-50">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-primary-200 flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-primary-600 hover:text-primary-700" />
              <h1 className="text-xl font-semibold text-primary-900">CRM Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-primary-700">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.displayName}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-primary-300 text-primary-700 hover:bg-primary-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
