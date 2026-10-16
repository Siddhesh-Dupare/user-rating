import ProfileHoverCard from "./ProfileHoverCard";

export default function DashboardLayout({ children }) {
  return (
    <main className="min-h-svh bg-[#f4f5f7] text-[#172033]">
      <div className="flex justify-end border-b border-[#e1e5ec] bg-white px-4 py-3">
        <ProfileHoverCard />
      </div>
      {children}
    </main>
  );
}
