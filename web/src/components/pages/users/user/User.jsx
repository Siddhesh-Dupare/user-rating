import DashboardLayout from "../DashboardLayout";
import WelcomeMessage from "../WelcomeMessage";

export default function User() {
  return (
    <DashboardLayout>
      <section className="p-6">
        <WelcomeMessage />
      </section>
    </DashboardLayout>
  );
}
