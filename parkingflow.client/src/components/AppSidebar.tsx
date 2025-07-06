
import { useState } from "react";
import { BarChart3, Users, Package, ShoppingCart, Home, Plus } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { set } from "date-fns";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Pay for parking", url: "/pay", icon: Users },
  { title: "Parking areas", url: "/parkingareas", icon: Package },
  { title: "Parking fees", url: "/parkingfees", icon: ShoppingCart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary-200 text-primary-900 font-medium border-r-2 border-primary-500"
      : "hover:bg-primary-100 text-primary-700 hover:text-primary-900";

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} bg-primary-50 border-r border-primary-200`}
    >
      <SidebarContent>
        <div className="p-4">
          <div className={`flex items-center gap-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <span className="font-bold text-orange-600 text-lg">ParkingFlow</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-primary-600 px-4">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavCls}
                      end={item.url === '/'}
                      onClick={() => {
                        if (state === "expanded") {
                        }
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
