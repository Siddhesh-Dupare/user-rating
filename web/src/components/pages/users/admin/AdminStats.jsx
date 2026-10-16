import { useEffect, useState } from "react";
import { Star, Store, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const statCards = [
  {
    key: "totalUsers",
    label: "Total users",
    icon: Users,
    iconClassName: "bg-[#1824ff]/10 text-[#1824ff]",
  },
  {
    key: "totalStores",
    label: "Total stores",
    icon: Store,
    iconClassName: "bg-[#1824ff]/10 text-[#1824ff]",
  },
  {
    key: "totalRatings",
    label: "Submitted ratings",
    icon: Star,
    iconClassName: "bg-[#1824ff]/10 text-[#1824ff]",
  },
];

export default function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStats() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/stats", {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load dashboard statistics");
        }

        setStats(result);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      }
    }

    loadStats();
    return () => controller.abort();
  }, []);

  if (error) {
    return (
      <p className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </p>
    );
  }

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      {statCards.map(({ key, label, icon: Icon, iconClassName }) => (
        <Card
          key={key}
          className="border-[#e1e5ec] bg-white text-[#172033] shadow-[0_8px_24px_rgba(31,43,68,0.06)] transition duration-200 hover:-translate-y-1 hover:border-[#1824ff]/40"
        >
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-[#6f788a]">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {stats ? stats[key].toLocaleString() : "—"}
              </p>
              <p className="mt-1 text-xs text-[#9aa2b1]">Across the platform</p>
            </div>
            <div className={`rounded-2xl p-3 ${iconClassName}`}>
              <Icon className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
