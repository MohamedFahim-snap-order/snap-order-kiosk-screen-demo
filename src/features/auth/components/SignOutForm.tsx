"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { signOutAction } from "@/features/auth/actions/auth.actions";
import { LaneTransit } from "@/features/auth/components/LaneTransit";
import styles from "@/features/auth/styles/lane-transit.module.css";

type SignOutFormProps = {
  label: string;
  pendingLabel: string;
  className?: string;
  children?: ReactNode;
};

export function SignOutForm({ label, pendingLabel, className, children }: SignOutFormProps) {
  return (
    <form className={styles.form} action={signOutAction}>
      <SignOutSubmit label={label} pendingLabel={pendingLabel} className={className}>
        {children}
      </SignOutSubmit>
    </form>
  );
}

function SignOutSubmit({ label, pendingLabel, className, children }: SignOutFormProps) {
  const { pending } = useFormStatus();

  return (
    <>
      <button className={className} type="submit" aria-label={label} title={label} disabled={pending}>
        {children ?? label}
      </button>
      {pending ? <LaneTransit label={pendingLabel} /> : null}
    </>
  );
}
