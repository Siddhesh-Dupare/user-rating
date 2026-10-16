import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

const userSchema = z.object({
  name: z
    .string()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must be no more than 60 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be no more than 16 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
  address: z.string().max(400, "Address must be no more than 400 characters"),
  role: z.literal("USER"),
});

export default function CreateUser({ onCancel }) {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      role: "USER",
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("http://localhost:5000/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Unable to create user");
      toast.add({
        type: "success",
        title: "User created",
        description: result.message,
      });
      onCancel();
    } catch (error) {
      toast.add({
        type: "error",
        title: "User creation failed",
        description: error.message,
      });
    }
  }

  const fields = [
    ["name", "Name", "text", "Enter user name"],
    ["email", "Email", "email", "user@example.com"],
    ["password", "Password", "password", "Enter password"],
    ["address", "Address", "text", "Enter address"],
  ];

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create User</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <FieldGroup>
            {fields.map(([name, label, type, placeholder]) => (
              <Field
                key={name}
                data-invalid={Boolean(form.formState.errors[name])}
              >
                <FieldLabel htmlFor={`user-${name}`}>{label}</FieldLabel>
                <Input
                  id={`user-${name}`}
                  type={type}
                  placeholder={placeholder}
                  {...form.register(name)}
                  aria-invalid={Boolean(form.formState.errors[name])}
                />
                <FieldError errors={[form.formState.errors[name]]} />
              </Field>
            ))}
          </FieldGroup>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
