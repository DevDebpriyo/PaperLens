"use client";

import styles from "./GeneratingLoader.module.css";

type GeneratingLoaderProps = {
  className?: string;
};

export function GeneratingLoader({ className }: GeneratingLoaderProps) {
  return (
    <div className={[styles.loader, className].filter(Boolean).join(" ")} role="status" aria-label="Loading">
      <span className={styles.bar} />
      <span className={styles.bar} />
      <span className={styles.bar} />
    </div>
  );
}
