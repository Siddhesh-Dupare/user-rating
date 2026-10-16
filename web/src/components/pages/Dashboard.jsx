import {
  CircleUserRound,
  Plus,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Users,
  Store,
} from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import CreateAdmin from "./CreateAdmin";
import CreateUser from "./CreateUser";
import CreateStore from "./CreateStore";
import StoresTable from "./StoresTable";
import UsersTable from "./UsersTable";
import StoreListingsTable from "./StoreListingsTable";
import StoreOwnerRatings from "./StoreOwnerRatings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export default function Dashboard({ role }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [isCreateStoreOpen, setIsCreateStoreOpen] = useState(false);
  const [isStoresOpen, setIsStoresOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const dashboardRole = user?.role || role;
  const roleLabel = dashboardRole
    ? dashboardRole.charAt(0) + dashboardRole.slice(1).toLowerCase()
    : "User";
  const firstName = user?.name?.trim().split(/\s+/)[0] || roleLabel;
  const passwordForm = useForm({
    resolver: zodResolver(
      z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters")
          .max(16, "Password must be no more than 16 characters")
          .regex(/[A-Z]/, "Password must include an uppercase letter")
          .regex(/[a-z]/, "Password must include a lowercase letter")
          .regex(/[0-9]/, "Password must include a number")
          .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
      }),
    ),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  async function handleChangePassword(data) {
    try {
      const response = await fetch("http://localhost:5000/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, email: user?.email, role: user?.role }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to change password");
      toast.add({ type: "success", title: "Password changed", description: result.message });
      passwordForm.reset();
      setIsChangePasswordOpen(false);
    } catch (error) {
      toast.add({ type: "error", title: "Password change failed", description: error.message });
    }
  }

  useEffect(() => {
    if (dashboardRole !== "ADMIN") {
      return;
    }

    async function loadAdminStats() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/stats");
        if (!response.ok) {
          throw new Error("Unable to load dashboard statistics");
        }
        setAdminStats(await response.json());
      } catch (error) {
        console.error("Unable to load administrator statistics", error);
      }
    }

    loadAdminStats();
  }, [dashboardRole]);

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
                  <SidebarMenuButton
                    isActive={!isStoresOpen && !isUsersOpen}
                    tooltip="Dashboard"
                    onClick={() => {
                      setIsStoresOpen(false);
                      setIsUsersOpen(false);
                    }}
                  >
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
                {dashboardRole === "ADMIN" && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isUsersOpen}
                      tooltip="Users"
                      onClick={() => {
                        setIsUsersOpen(true);
                        setIsStoresOpen(false);
                      }}
                    >
                      <Users />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                {dashboardRole === "ADMIN" && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isStoresOpen}
                      tooltip="Stores"
                      onClick={() => {
                        setIsStoresOpen(true);
                        setIsUsersOpen(false);
                      }}
                    >
                      <Store />
                      <span>Stores</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
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
            {isProfileOpen &&
              (dashboardRole === "USER" || dashboardRole === "STORE_OWNER") && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  tooltip="Change password"
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  <Settings />
                  <span>Change password</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
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
        {isUsersOpen ? (
          <UsersTable onBack={() => setIsUsersOpen(false)} />
        ) : isStoresOpen ? (
          <StoresTable onBack={() => setIsStoresOpen(false)} />
        ) : (
          <>
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
                    <DropdownMenuItem onClick={() => setIsCreateStoreOpen(true)}>
                      Create Store
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsCreateAdminOpen(true)}
                    >
                      Create Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {dashboardRole === "ADMIN" && (
              <Card className="ml-4 mt-8 w-full max-w-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Platform Overview</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Users className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-semibold">
                        {adminStats?.totalUsers ?? "--"}
                      </p>
                      <p className="text-sm text-muted-foreground">Users</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Store className="size-5 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-semibold">
                        {adminStats?.totalStores ?? "--"}
                      </p>
                      <p className="text-sm text-muted-foreground">Stores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {dashboardRole === "USER" && (
              <StoreListingsTable userEmail={user?.email} />
            )}
            {dashboardRole === "STORE_OWNER" && (
              <StoreOwnerRatings ownerEmail={user?.email} />
            )}
          </>
        )}
      </main>
      {isChangePasswordOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Change password"
        >
          <Card className="w-full max-w-md bg-background/80 shadow-2xl backdrop-blur-md">
            <CardHeader>
              <CardTitle>Change password</CardTitle>
            </CardHeader>
            <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} noValidate>
              <CardContent className="space-y-4">
                <Field data-invalid={Boolean(passwordForm.formState.errors.currentPassword)}>
                  <FieldLabel htmlFor="current-password">Enter current password</FieldLabel>
                  <Input id="current-password" type="password" {...passwordForm.register("currentPassword")} />
                  <FieldError errors={[passwordForm.formState.errors.currentPassword]} />
                </Field>
                <Field data-invalid={Boolean(passwordForm.formState.errors.newPassword)}>
                  <FieldLabel htmlFor="new-password">Set new password</FieldLabel>
                  <Input id="new-password" type="password" {...passwordForm.register("newPassword")} />
                  <FieldError errors={[passwordForm.formState.errors.newPassword]} />
                </Field>
              </CardContent>
              <CardFooter className="justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsChangePasswordOpen(false)}
              >
                Cancel
              </Button>
                <Button type="submit">Change password</Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
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
      {isCreateStoreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Create Store"
        >
          <CreateStore onCancel={() => setIsCreateStoreOpen(false)} />
        </div>
      )}
    </SidebarProvider>
  );
}
