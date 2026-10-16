import { useSelector } from "react-redux";

export default function WelcomeMessage() {
  const user = useSelector((state) => state.auth.user);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "Admin";

  return (
    <h1 className="text-3xl font-bold text-white">
      Welcome, {firstName}
    </h1>
  );
}
