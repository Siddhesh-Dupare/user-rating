import { LayoutDashboard, Settings, Star, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r bg-background p-4">
      <div className="px-3 py-2 text-lg font-semibold">User Rating</div>
      <Separator className="my-4" />

      <nav className="flex flex-1 flex-col gap-2">
        <Button variant="secondary" className="justify-start gap-3">
          <LayoutDashboard />
          Dashboard
        </Button>
        <Button variant="ghost" className="justify-start gap-3">
          <Star />
          Ratings
        </Button>
        <Button variant="ghost" className="justify-start gap-3">
          <Users />
          Users
        </Button>
        <Button variant="ghost" className="justify-start gap-3">
          <Settings />
          Settings
        </Button>
      </nav>
    </aside>
  );
}
