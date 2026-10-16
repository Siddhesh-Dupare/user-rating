
import DashboardLayout from "../DashboardLayout";
import WelcomeMessage from "../WelcomeMessage";
import AdminStats from "./AdminStats";

export default function Admin() {
  return (
    <DashboardLayout>
      <section className="p-6">
        <WelcomeMessage />
        <AdminStats />
      </section>
    </DashboardLayout>
  );
}
