
import DashboardLayout from "../DashboardLayout";
import WelcomeMessage from "../WelcomeMessage";

export default function Admin() {
  return (
    <DashboardLayout>
      <section className="p-6">
        <WelcomeMessage />
      </section>
    </DashboardLayout>
  );
}
