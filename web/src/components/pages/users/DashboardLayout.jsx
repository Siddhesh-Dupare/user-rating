import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from "@/components/ui/sidebar";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

import { CircleUserRound } from "lucide-react";
import SidebarNavigation from "./SidebarNavigation";

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
          <HoverCard>
            <HoverCardTrigger delay={100} closeDelay={200}>
              <button
                type="button"
                aria-label="Open profile"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6842f5] text-white ring-2 ring-[#6842f5]/30 transition hover:ring-[#6842f5]/70"
              >
                <CircleUserRound className="h-6 w-6" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent>
              Hello hover card
            </HoverCardContent>
          </HoverCard>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
