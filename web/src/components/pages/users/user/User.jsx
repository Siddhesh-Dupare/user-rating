import DashboardLayout from "../DashboardLayout";
import WelcomeMessage from "../WelcomeMessage";
import UserStoresTable from "./UserStoresTable";

export default function User() {
  return (
    <DashboardLayout>
      <section className="p-6">
        <WelcomeMessage />
        <UserStoresTable />
      </section>
    </DashboardLayout>
  );
}
