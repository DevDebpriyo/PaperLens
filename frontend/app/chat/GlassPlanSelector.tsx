"use client";

import { useId, useState } from "react";
import styles from "./GlassPlanSelector.module.css";

type GlassPlan = "silver" | "gold" | "platinum";

type GlassPlanSelectorProps = {
  defaultPlan?: GlassPlan;
  onPlanChange?: (plan: GlassPlan) => void;
};

export default function GlassPlanSelector({
  defaultPlan = "silver",
  onPlanChange,
}: GlassPlanSelectorProps) {
  const [selectedPlan, setSelectedPlan] = useState<GlassPlan>(defaultPlan);
  const radioName = `${useId()}-plan`;

  const handlePlanChange = (plan: GlassPlan) => {
    setSelectedPlan(plan);
    onPlanChange?.(plan);
  };

  return (
    <div className={`${styles.glassRadioGroup} ${styles[selectedPlan]}`}>
      <input
        type="radio"
        name={radioName}
        id={`${radioName}-silver`}
        checked={selectedPlan === "silver"}
        onChange={() => handlePlanChange("silver")}
      />
      <label
        htmlFor={`${radioName}-silver`}
        title="Story mode: narrative, easy-to-read explanation style."
      >
        Story
      </label>

      <input
        type="radio"
        name={radioName}
        id={`${radioName}-gold`}
        checked={selectedPlan === "gold"}
        onChange={() => handlePlanChange("gold")}
      />
      <label
        htmlFor={`${radioName}-gold`}
        title="Podcast mode: conversational voice and audio-friendly flow."
      >
        Podcast
      </label>

      <input
        type="radio"
        name={radioName}
        id={`${radioName}-platinum`}
        checked={selectedPlan === "platinum"}
        onChange={() => handlePlanChange("platinum")}
      />
      <label
        htmlFor={`${radioName}-platinum`}
        title="Q/A mode: direct answers and query-focused responses."
      >
        Q/A
      </label>

      <div className={styles.glassGlider} />
    </div>
  );
}