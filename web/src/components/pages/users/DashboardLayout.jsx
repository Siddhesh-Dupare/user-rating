import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { CircleUserRound, LayoutDashboard, Users } from "lucide-react";

const navigationItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Users", icon: Users },
];

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider className="bg-[#101114]">
      <Sidebar className="bg-[#17181c] text-zinc-100 [&_[data-slot=sidebar-inner]]:bg-[#17181c]">
        <SidebarHeader className="border-white/10 bg-[#17181c] text-center text-2xl font-semibold text-white">
          StoreRate
        </SidebarHeader>

        <SidebarContent className="bg-[#17181c]">
          <SidebarGroup className="text-zinc-100">
            <SidebarGroupLabel className="text-zinc-500">
              Navigation
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map(({ label, icon: Icon }) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton className="hover:bg-[#6842f5] hover:text-white">
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="min-h-svh flex-1 bg-[#101114] text-zinc-100">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <SidebarTrigger className="text-zinc-300 hover:bg-[#202126] hover:text-white" />
          <button
            type="button"
            aria-label="Open profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6842f5] text-white ring-2 ring-[#6842f5]/30 transition hover:ring-[#6842f5]/70"
          >
            <CircleUserRound className="h-6 w-6" />
          </button>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
