import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/toast";

const formSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email is required" })
    .pipe(z.email({ message: "Invalid email address. " })),

  password: z
    .string()
    .min(8, { message: "Password must be 8 characters long." })
    .max(16, { message: "Password is too long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export default function LoginForm() {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      toast.add({
        type: "success",
        title: "Login successful",
        description: result.message,
      });

      if (result.user.role === "ADMIN")
        navigate("/admin/dashboard");

    } catch (error) {
      console.error("Unable to connect to the server ", error);
      toast.add({
        type: "error",
        title: "Login failed",
        description: error.message || "Invalid email or password.",
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <Card className="overflow-hidden rounded-2xl border-slate-200/50 bg-white/80 py-0 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
          {/* Header */}
          <CardHeader className="rounded-none bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Welcome Back
              </CardTitle>
            </div>
            <CardDescription className="text-blue-100 text-sm">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          {/* Form */}
          <CardContent className="p-0">
            <form
              id="form-submit"
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-8 space-y-6"
              noValidate
            >
              <FieldGroup>
                {/* Email Field */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="form-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="example@gmail.com"
                        autoComplete="email"
                        className="h-11 bg-white/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password Field */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor="form-password">
                          Password
                        </FieldLabel>
                        <a
                          href="#"
                          className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <Input
                        {...field}
                        id="form-password"
                        type="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="h-11 bg-white/50"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {/* Remember me & Submit */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 transition-colors"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
              </div>

              <Button
                type="submit"
                form="form-submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base
                hover:from-blue-700 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2
                transition-all duration-200
                shadow-lg shadow-blue-500/25
                flex items-center justify-center gap-2"
              >
                Sign In
              </Button>
            </form>
          </CardContent>

          {/* Footer */}
          <CardFooter className="justify-center rounded-none border-t border-slate-200 bg-slate-50/50 px-8 py-6">
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Create one
              </a>
            </p>
          </CardFooter>
        </Card>

        {/* Footer note */}
        <p className="text-center text-sm text-slate-500 mt-6">
          By signing in, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:text-blue-700 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
