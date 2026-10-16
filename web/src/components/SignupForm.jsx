import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const signupSchema = z.object({
  name: z
    .string()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must be no more than 60 characters"),
  email: z.string().email("Enter a valid email address"),
  address: z.string().max(400, "Address must be no more than 400 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be no more than 16 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
});

const fields = [
  ["name", "Name", "text", "Enter your full name"],
  ["email", "Email", "email", "you@example.com"],
  ["address", "Address", "text", "Enter your address"],
  ["password", "Password", "password", "Enter a password"],
];

export default function SignupForm() {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", address: "", password: "" },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "USER" }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to create account");
      }

      toast.add({
        type: "success",
        title: "Account created",
        description: "You can now sign in with your account.",
      });
      navigate("/login");
    } catch (error) {
      toast.add({
        type: "error",
        title: "Signup failed",
        description: error.message,
      });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="overflow-hidden rounded-2xl border-slate-200/50 bg-white/80 py-0 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
          <CardHeader className="rounded-none bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19a6 6 0 00-12 0m6-8a4 4 0 100-8 4 4 0 000 8zm8-3v6m3-3h-6"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Create your account
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-blue-100">
              Sign up to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-8"
              noValidate
            >
              <FieldGroup>
                {fields.map(([name, label, type, placeholder]) => (
                  <Field
                    key={name}
                    data-invalid={Boolean(form.formState.errors[name])}
                  >
                    <FieldLabel htmlFor={`signup-${name}`}>{label}</FieldLabel>
                    <Input
                      id={`signup-${name}`}
                      type={type}
                      placeholder={placeholder}
                      autoComplete={name}
                      {...form.register(name)}
                      aria-invalid={Boolean(form.formState.errors[name])}
                      className="h-11 bg-white/50"
                    />
                    <FieldError errors={[form.formState.errors[name]]} />
                  </Field>
                ))}
              </FieldGroup>
              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
              >
                Create account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center rounded-none border-t border-slate-200 bg-slate-50/50 px-8 py-6">
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
