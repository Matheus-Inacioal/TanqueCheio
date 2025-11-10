
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
  HelpCircle,
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
  useSidebar,
  SidebarTrigger,
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
import { AddFillUpDialog } from "@/components/fuel/add-fill-up-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { vehicles } from "@/lib/dummy-data";
import { FuelPumpIcon } from "@/components/icons";


function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { open, setOpen, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isMobile, setOpen]);
  
  // This is a workaround to force re-render on path change
  // until a better solution is found for active links in the sidebar
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    setKey(prev => prev + 1);
    if(isMobile && open){
        setOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const navItems = [
    { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
    { href: "/vehicles", icon: <Car />, label: "Veículos" },
    { href: "/reports", icon: <BarChart3 />, label: "Relatórios" },
    { href: "/profile", icon: <Settings />, label: "Perfil" },
  ];

  return (
      <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border"
      >
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <FuelPumpIcon className="size-8 text-primary" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              TanqueCheio
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu key={key}>
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
          <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto" asChild>
            <Link href="/help">
              <HelpCircle className="mr-2 group-data-[collapsible=icon]:mr-0"/>
              <span className="group-data-[collapsible=icon]:hidden">Ajuda & Suporte</span>
            </Link>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
          <SidebarTrigger className="md:hidden" onClick={toggleSidebar} />
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
      </>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  )
}
