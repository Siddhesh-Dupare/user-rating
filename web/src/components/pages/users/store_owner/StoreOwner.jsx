import DashboardLayout from "../DashboardLayout";
import WelcomeMessage from "../WelcomeMessage";
import StoreOwnerRatings from "./StoreOwnerRatings";

export default function StoreOwner() {
  return (
    <DashboardLayout>
      <section className="p-6">
        <WelcomeMessage />
        <StoreOwnerRatings />
      </section>
    </DashboardLayout>
  );
}
