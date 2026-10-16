import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be no more than 16 characters")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
});

export default function ChangePasswordDialog({ user, onClose }) {
  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("http://localhost:5000/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          email: user.email,
          role: user.role,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to change password");
      }

      toast.add({
        type: "success",
        title: "Password changed",
        description: result.message || "Your password was updated successfully.",
      });
      onClose();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Password change failed",
        description: error.message || "Unable to change your password.",
      });
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101114]/60 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e1e5ec] bg-white shadow-2xl shadow-[#1f2b44]/20">
        <div className="flex items-start justify-between border-b border-[#e1e5ec] bg-gradient-to-br from-[#1824ff]/10 to-transparent p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#1824ff]/10 p-3 text-[#1824ff]">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 id="change-password-title" className="text-xl font-semibold text-[#172033]">
                Change password
              </h2>
              <p className="mt-1 text-sm text-[#7b8494]">
                Keep your account secure with a strong password.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close change password dialog"
            className="rounded-lg p-2 text-[#8b94a5] transition hover:bg-[#f0f2f7] hover:text-[#172033]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5 p-6">
            <div>
              <label htmlFor="current-password" className="mb-2 block text-sm font-medium text-[#4f596b]">
                Current password
              </label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your current password"
                {...form.register("currentPassword")}
                aria-invalid={Boolean(form.formState.errors.currentPassword)}
                className="h-11 border-[#dfe4ed] bg-white text-[#172033] placeholder:text-[#a1a9b7] focus:border-[#1824ff] focus:ring-[#1824ff]"
              />
              {form.formState.errors.currentPassword && (
                <p className="mt-1.5 text-xs text-red-600">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-[#4f596b]">
                New password
              </label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a new password"
                {...form.register("newPassword")}
                aria-invalid={Boolean(form.formState.errors.newPassword)}
                className="h-11 border-[#dfe4ed] bg-white text-[#172033] placeholder:text-[#a1a9b7] focus:border-[#1824ff] focus:ring-[#1824ff]"
              />
              {form.formState.errors.newPassword && (
                <p className="mt-1.5 text-xs text-red-600">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-[#e1e5ec] bg-[#fbfcfe] px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#dfe4ed] text-[#4f596b] hover:bg-[#f0f2f7]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="bg-[#1824ff] text-white hover:bg-[#101dcc]"
            >
              {form.formState.isSubmitting ? "Updating..." : "Change password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
