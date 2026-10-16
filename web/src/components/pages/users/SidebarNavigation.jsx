import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { navigationItems } from "./navigationItems";

export default function SidebarNavigation() {
  return (
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
  );
}
