
import DashboardLayout from "../DashboardLayout";
import WelcomeMessage from "../WelcomeMessage";
import AdminStats from "./AdminStats";
import AdminUsersTable from "./AdminUsersTable";

export default function Admin() {
  return (
    <DashboardLayout>
      <section className="p-6">
        <WelcomeMessage />
        <AdminStats />
        <AdminUsersTable />
      </section>
    </DashboardLayout>
  );
}
