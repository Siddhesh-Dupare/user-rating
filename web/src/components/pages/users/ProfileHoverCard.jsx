import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { clearCredentials } from "@/store/authSlice";
import { CircleUserRound, KeyRound, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChangePasswordDialog from "./ChangePasswordDialog";

export default function ProfileHoverCard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const canChangePassword =
    user?.role === "USER" || user?.role === "STORE_OWNER";

  function handleLogout() {
    dispatch(clearCredentials());
    navigate("/login");
  }

  return (
    <>
      <HoverCard>
        <HoverCardTrigger delay={100} closeDelay={200}>
          <button
            type="button"
            aria-label="Open profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1824ff] text-white ring-2 ring-[#1824ff]/20 transition hover:ring-[#1824ff]/50"
          >
            <CircleUserRound className="h-6 w-6" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent
          align="end"
          className="w-72 border-[#e1e5ec] bg-white p-0 text-[#172033] shadow-2xl shadow-[#1f2b44]/10"
        >
          <div className="border-b border-[#e1e5ec] bg-gradient-to-br from-[#1824ff]/10 to-transparent p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1824ff] text-lg font-semibold text-white">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#172033]">
                  {user?.name || "User"}
                </p>
                <p className="truncate text-xs text-[#7b8494]">
                  {user?.email || "No email available"}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-1 p-2">
            {canChangePassword && (
              <button
                type="button"
                onClick={() => setIsPasswordDialogOpen(true)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#4f596b] transition hover:bg-[#1824ff] hover:text-white"
              >
                <KeyRound className="h-4 w-4" />
                <span>Change password</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        </HoverCardContent>
      </HoverCard>
      {isPasswordDialogOpen && (
        <ChangePasswordDialog
          user={user}
          onClose={() => setIsPasswordDialogOpen(false)}
        />
      )}
    </>
  );
}
