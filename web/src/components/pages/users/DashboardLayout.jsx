import ProfileHoverCard from "./ProfileHoverCard";

export default function DashboardLayout({ children }) {
  return (
    <main className="min-h-svh bg-[#101114] text-zinc-100">
      <div className="flex justify-end border-b border-white/10 px-4 py-3">
        <ProfileHoverCard />
      </div>
      {children}
    </main>
  );
}
