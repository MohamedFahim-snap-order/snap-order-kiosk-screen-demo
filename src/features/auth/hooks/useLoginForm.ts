"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInAction } from "@/features/auth/actions/auth.actions";
import { signInSchema, type SignInValues } from "@/features/auth/schemas/sign-in.schema";

export function useLoginForm() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInValues) {
    setRootError(null);
    setLeaving(true);
    try {
      const result = await signInAction(values);
      if (!result) return;
      setLeaving(false);
      if (result.fieldErrors?.email) form.setError("email", { message: result.fieldErrors.email });
      if (result.fieldErrors?.password) form.setError("password", { message: result.fieldErrors.password });
      if (!result.fieldErrors?.email && !result.fieldErrors?.password) {
        setRootError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      const digest = typeof error === "object" && error !== null && "digest" in error ? String(error.digest) : "";
      if (!digest.startsWith("NEXT_REDIRECT")) setLeaving(false);
      throw error;
    }
  }

  return {
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    leaving,
    visible,
    setVisible,
    rootError,
    fillEmail: (email: string) => form.setValue("email", email, { shouldValidate: true }),
    submit: form.handleSubmit(onSubmit),
  };
}
