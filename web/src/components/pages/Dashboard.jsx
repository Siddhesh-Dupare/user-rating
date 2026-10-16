import {
  CircleUserRound,
  Plus,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { clearCredentials } from "@/store/authSlice";
import CreateAdmin from "./CreateAdmin";
import CreateUser from "./CreateUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard({ role }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const dashboardRole = user?.role || role;
  const roleLabel = dashboardRole
    ? dashboardRole.charAt(0) + dashboardRole.slice(1).toLowerCase()
    : "User";
  const firstName = user?.name?.trim().split(/\s+/)[0] || roleLabel;

  function handleLogout() {
    dispatch(clearCredentials());
    navigate("/login");
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-3 text-lg font-semibold">
          {roleLabel} Dashboard
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{roleLabel} Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Ratings">
                    <Star />
                    <span>Ratings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Users">
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {isProfileOpen && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  tooltip="Log out"
                  onClick={handleLogout}
                  className="text-destructive hover:text-destructive"
                >
                  <LogOut />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="h-auto items-center py-2"
                tooltip="Administrator profile"
                onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
              >
                <CircleUserRound className="size-8" />
                <span className="flex min-w-0 flex-col items-start">
                  <span className="truncate font-medium">
                    {user?.name || roleLabel}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email || "No email available"}
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main className="flex-1 p-2">
        <SidebarTrigger />
        <div className="mt-8 flex items-center justify-between gap-4 px-4">
          <h1 className="text-2xl font-semibold">Welcome {firstName}</h1>
          {dashboardRole === "ADMIN" && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Plus className="size-4" />
                Create
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsCreateUserOpen(true)}>
                  Create User
                </DropdownMenuItem>
                <DropdownMenuItem>Create Owner</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsCreateAdminOpen(true)}
                >
                  Create Admin
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </main>
      {isCreateAdminOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Create Admin"
        >
          <CreateAdmin onCancel={() => setIsCreateAdminOpen(false)} />
        </div>
      )}
      {isCreateUserOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Create User"
        >
          <CreateUser onCancel={() => setIsCreateUserOpen(false)} />
        </div>
      )}
    </SidebarProvider>
  );
}
