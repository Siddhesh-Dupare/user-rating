import CardLeft from "../CardLeft";
import CardRight from "../CardRight";
import LoginForm from "./LoginForm";
import { AuthLayout } from "../AuthLayout";

export default function LoginMain() {
  return (
    <AuthLayout>
      <CardLeft />
      <CardRight
        heading="Sign in to your account"
        footer="Don't have an account?"
        footerLink="/signup"
        footerText="Create one"
      >
        <LoginForm />
      </CardRight>
    </AuthLayout>
  );
}
