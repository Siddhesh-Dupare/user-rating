import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Button } from "@/components/ui/button";
import { setCredentials } from "@/store/authSlice";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { loginSchema } from "@/schema/authLogin.schema";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(loginSchema),
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

      dispatch(setCredentials(result.user));

      toast.add({
        type: "success",
        title: "Login successful",
        description: result.message,
      });

      if (result.user.role === "ADMIN") navigate("/admin/dashboard");
      else if (result.user.role === "USER") navigate("/user/dashboard");
      else if (result.user.role === "STORE_OWNER")
        navigate("/store-owner/dashboard");
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
    <form
      id="form-submit"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <FieldGroup className="gap-5">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="text-sm text-zinc-300"
                htmlFor="form-email"
              >
                Email address
              </FieldLabel>
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                <Input
                  {...field}
                  id="form-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-12 rounded-xl border-white/10 bg-[#202126] pl-11 text-white placeholder:text-zinc-600 focus:border-[#6668f5] focus:ring-[#6668f5]"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex items-center justify-between">
                <FieldLabel
                  className="text-sm text-zinc-300"
                  htmlFor="form-password"
                >
                  Password
                </FieldLabel>
              </div>
              <div className="relative">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="18" height="11" x="3" y="10" rx="2" />
                  <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                </svg>
                <Input
                  {...field}
                  id="form-password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-12 rounded-xl border-white/10 bg-[#202126] pl-11 text-white placeholder:text-zinc-600 focus:border-[#6668f5] focus:ring-[#6668f5]"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        form="form-submit"
        className="h-12 w-full rounded-xl bg-[#5d60ef] text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-[#7072f5]"
      >
        Sign in
      </Button>
    </form>
  );
}
