"use client";

import styles from "./PodcastModeCharacter.module.css";

type PodcastModeCharacterProps = {
  className?: string;
  subtitle?: string;
};

export function PodcastModeCharacter({ className, subtitle = "Dual voices active" }: PodcastModeCharacterProps) {
  const rootClassName = [styles.card, className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName} aria-hidden>
      <div className={styles.scene}>
        <div className={`${styles.speaker} ${styles.speakerLeft}`} />
        <div className={`${styles.speaker} ${styles.speakerRight}`} />
        <div className={styles.mic} />
        <div className={styles.wave} />
      </div>

      <div className={styles.meta}>
        <p className={styles.title}>Podcast Mode</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}
