"use client";

import { money } from "@/features/catalog/demo-menu";
import styles from "./half-million.module.css";

type CheckoutSheetProps = {
  open: boolean;
  total: number;
  confirmed: string;
  pay: string;
  windowHint: string;
  next: string;
  onNextCustomer: () => void;
};

export function CheckoutSheet({ open, total, confirmed, pay, windowHint, next, onNextCustomer }: CheckoutSheetProps) {
  if (!open) return null;

  return (
    <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="order-confirmed">
      <div className={styles.sheet}>
        <p>{confirmed}</p>
        <h2 id="order-confirmed">#101</h2>
        <p>
          {pay} <strong>{money(total)}</strong>
        </p>
        <p>{windowHint}</p>
        <button className={styles.next} type="button" onClick={onNextCustomer}>
          {next}
        </button>
      </div>
    </div>
  );
}
