import CardLeft from "../CardLeft";
import CardRight from "../CardRight";
import SignupForm from "./SignupForm";
import { AuthLayout } from "../AuthLayout";

export default function SignupMain() {
  return (
    <AuthLayout>
      <CardLeft />
      <CardRight
        heading="Sing up to get started"
        footer="Already have an account?"
        footerLink="/login"
        footerText="Sign in"
      >
        <SignupForm />
      </CardRight>
    </AuthLayout>
  );
}
