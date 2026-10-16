
import DashboardLayout from "../DashboardLayout";
import WelcomeMessage from "../WelcomeMessage";
import AdminStats from "./AdminStats";
import AdminStoresTable from "./AdminStoresTable";
import AdminUsersTable from "./AdminUsersTable";

export default function Admin() {
  return (
    <DashboardLayout>
      <section className="p-6">
        <WelcomeMessage />
        <AdminStats />
        <div className="grid gap-6 md:grid-cols-2">
          <AdminUsersTable />
          <AdminStoresTable />
        </div>
      </section>
    </DashboardLayout>
  );
}
