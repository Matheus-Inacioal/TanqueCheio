
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  ChevronDown,
  LayoutDashboard,
  PanelLeft,
  PlusCircle,
  Settings,
  BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserNav } from "@/components/layout/user-nav";
import { Logo } from "@/components/icons";
import { AddFillUpDialog } from "@/components/fuel/add-fill-up-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { vehicles } from "@/lib/dummy-data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(isMobile ? false : true);

  // This is a workaround to force re-render on path change
  // until a better solution is found for active links in the sidebar
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    setKey(prev => prev + 1);
  }, [pathname]);

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/vehicles", icon: <Car />, label: "Veículos" },
    { href: "/reports", icon: <BarChart3 />, label: "Relatórios" },
    { href: "/settings", icon: <Settings />, label: "Configurações" },
  ];

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border"
      >
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              TanqueCheio
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    className: "dark:bg-sidebar-background",
                  }}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto">
            <Settings className="mr-2 group-data-[collapsible=icon]:mr-0"/>
            <span className="group-data-[collapsible=icon]:hidden">Ajuda & Suporte</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
            <PanelLeft className="size-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="flex w-full items-center justify-end gap-4">
            <div className="hidden md:flex items-center gap-4">
               <Select defaultValue="main-vehicle">
                <SelectTrigger className="w-[200px] bg-transparent border-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Selecionar Veículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                     <SelectItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AddFillUpDialog>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Novo Abastecimento
                </Button>
              </AddFillUpDialog>
            </div>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
         <div className="md:hidden fixed bottom-4 right-4">
            <AddFillUpDialog>
                <Button size="icon" className="w-14 h-14 rounded-full shadow-lg">
                  <PlusCircle className="h-6 w-6" />
                   <span className="sr-only">Novo Abastecimento</span>
                </Button>
              </AddFillUpDialog>
          </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
