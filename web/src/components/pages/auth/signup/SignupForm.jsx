import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, Mail, MapPin, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { signupSchema } from "@/schema/signup.schema";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const fields = [
  ["name", "Name", "text", "Enter your full name", UserRound],
  ["email", "Email", "email", "you@example.com", Mail],
  ["address", "Address", "text", "Enter your address", MapPin],
  ["password", "Password", "password", "Enter a password", LockKeyhole],
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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
    >
      <FieldGroup className="gap-5">
        {fields.map(([name, label, type, placeholder, Icon]) => (
          <Field key={name} data-invalid={Boolean(form.formState.errors[name])}>
            <FieldLabel
              className="text-sm text-zinc-300"
              htmlFor={`signup-${name}`}
            >
              {label}
            </FieldLabel>
            <div className="relative">
              <Icon
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
              />
              <Input
                id={`signup-${name}`}
                type={type}
                placeholder={placeholder}
                autoComplete={name}
                {...form.register(name)}
                aria-invalid={Boolean(form.formState.errors[name])}
                className="h-12 rounded-xl border-white/10 bg-[#202126] pl-11 text-white placeholder:text-zinc-600 focus:border-[#6668f5] focus:ring-[#6668f5]"
              />
            </div>
            <FieldError errors={[form.formState.errors[name]]} />
          </Field>
        ))}
      </FieldGroup>
      <Button
        type="submit"
        className="h-12 w-full rounded-xl bg-[#5d60ef] text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:bg-[#7072f5]"
      >
        Create account
      </Button>
    </form>
  );
}
