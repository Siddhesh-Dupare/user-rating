import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { clearCredentials } from "@/store/authSlice";
import { CircleUserRound, KeyRound, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ProfileHoverCard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(clearCredentials());
    navigate("/login");
  }

  return (
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
      <HoverCardContent
        align="end"
        className="w-72 border-white/10 bg-[#202126] p-0 text-zinc-100 shadow-2xl shadow-black/40"
      >
        <div className="border-b border-white/10 bg-gradient-to-br from-[#6842f5]/25 to-transparent p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#6842f5] text-lg font-semibold text-white">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-zinc-400">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-1 p-2">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-[#6842f5] hover:text-white"
          >
            <KeyRound className="h-4 w-4" />
            <span>Change password</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
