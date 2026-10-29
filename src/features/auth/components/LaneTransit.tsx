import Image from "next/image";
import styles from "@/features/auth/styles/lane-transit.module.css";

type LaneTransitProps = {
  label: string;
};

export function LaneTransit({ label }: LaneTransitProps) {
  return (
    <div className={styles.transit} role="status" aria-live="polite" aria-busy="true">
      <Image className={styles.logo} src="/snaporder-horizontal.png" alt="" width={240} height={44} priority />
      <span className={styles.ring} aria-hidden="true" />
      <p className={styles.label}>{label}</p>
    </div>
  );
}
