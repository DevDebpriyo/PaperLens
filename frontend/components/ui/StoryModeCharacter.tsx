"use client";

import styles from "./StoryModeCharacter.module.css";

type StoryModeCharacterProps = {
  className?: string;
  subtitle?: string;
};

export function StoryModeCharacter({ className, subtitle = "Narration online" }: StoryModeCharacterProps) {
  const rootClassName = [styles.characterCard, className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName} aria-hidden>
      <div className={styles.scene}>
        <div className={styles.groundShadow} />
        <div className={styles.bot}>
          <div className={styles.head}>
            <span className={styles.eye} />
            <span className={styles.eye} />
          </div>
          <div className={styles.body}>
            <span className={styles.core} />
          </div>
        </div>
        <div className={styles.orb} />
      </div>

      <div className={styles.meta}>
        <p className={styles.title}>Story Mode</p>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
}
