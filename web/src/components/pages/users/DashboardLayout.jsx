import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";

import SidebarNavigation from "./SidebarNavigation";
import ProfileHoverCard from "./ProfileHoverCard";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider className="bg-[#101114]">
      <Sidebar className="bg-[#17181c] text-zinc-100 [&_[data-slot=sidebar-inner]]:bg-[#17181c]">
        <SidebarHeader className="border-white/10 bg-[#17181c] text-center text-2xl font-semibold text-white">
          StoreRate
        </SidebarHeader>

        <SidebarContent className="bg-[#17181c]">
          <SidebarNavigation />
        </SidebarContent>
      </Sidebar>
      <main className="min-h-svh flex-1 bg-[#101114] text-zinc-100">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <SidebarTrigger className="text-zinc-300 hover:bg-[#202126] hover:text-white" />
          <ProfileHoverCard />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
