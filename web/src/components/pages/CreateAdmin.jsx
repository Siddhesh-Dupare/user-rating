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

const adminSchema = z.object({
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
  role: z.literal("ADMIN"),
});

export default function CreateAdmin({ onCancel }) {
  const form = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      role: "ADMIN",
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("http://localhost:5000/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create administrator");
      }

      toast.add({
        type: "success",
        title: "Administrator created",
        description: result.message,
      });
      onCancel();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Administrator creation failed",
        description: error.message,
      });
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.name)}>
              <FieldLabel htmlFor="admin-name">Name</FieldLabel>
              <Input
                id="admin-name"
                {...form.register("name")}
                aria-invalid={Boolean(form.formState.errors.name)}
                placeholder="Enter admin name"
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.email)}>
              <FieldLabel htmlFor="admin-email">Email</FieldLabel>
              <Input
                id="admin-email"
                type="email"
                {...form.register("email")}
                aria-invalid={Boolean(form.formState.errors.email)}
                placeholder="admin@example.com"
              />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.password)}>
              <FieldLabel htmlFor="admin-password">Password</FieldLabel>
              <Input
                id="admin-password"
                type="password"
                {...form.register("password")}
                aria-invalid={Boolean(form.formState.errors.password)}
                placeholder="Enter password"
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>

            <Field data-invalid={Boolean(form.formState.errors.address)}>
              <FieldLabel htmlFor="admin-address">Address</FieldLabel>
              <Input
                id="admin-address"
                {...form.register("address")}
                aria-invalid={Boolean(form.formState.errors.address)}
                placeholder="Enter address"
              />
              <FieldError errors={[form.formState.errors.address]} />
            </Field>
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
