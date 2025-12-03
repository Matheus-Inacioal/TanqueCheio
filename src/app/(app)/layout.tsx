"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Car,
  LayoutDashboard,
  PlusCircle,
  Settings,
  BarChart3,
  HelpCircle,
} from "lucide-react";

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserNav } from "@/components/layout/user-nav";
import { AddFillUpDialog } from "@/components/fuel/add-fill-up-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { vehicles } from "@/lib/dummy-data";
import { FuelPumpIcon } from "@/components/icons";
import { useUser } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  { href: "/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/vehicles", icon: <Car />, label: "Veículos" },
  { href: "/reports", icon: <BarChart3 />, label: "Relatórios" },
  { href: "/profile", icon: <Settings />, label: "Perfil" },
];

function MobileSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };
  
  return (
    <div className="flex h-full w-full flex-col">
      <SheetHeader className="p-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
          <FuelPumpIcon className="size-8 text-primary" />
          <SheetTitle className="text-xl font-semibold">TanqueCheio</SheetTitle>
        </Link>
      </SheetHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
              >
                <Link href={item.href} onClick={handleLinkClick}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 mt-auto border-t">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/help" onClick={handleLinkClick}>
            <HelpCircle className="mr-2"/>
            <span>Ajuda & Suporte</span>
          </Link>
        </Button>
      </SidebarFooter>
    </div>
  );
}


function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { openMobile, setOpenMobile, setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <FuelPumpIcon className="size-12 text-primary animate-pulse" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    )
  }

  return (
      <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-r border-sidebar-border hidden md:flex"
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
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-[18rem] p-0 flex sm:max-w-xs">
            <MobileSidebar />
        </SheetContent>
      </Sheet>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <SidebarTrigger className="flex md:hidden" />
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
         <div className="md:hidden fixed bottom-4 right-4 z-40">
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
