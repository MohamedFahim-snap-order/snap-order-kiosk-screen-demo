import type { ComponentType } from "react";
import { HalfMillionLane } from "@/templates/half-million/HalfMillionLane";
import { LaneStage } from "@/templates/lane-stage/LaneStage";
import type { LaneDeskProps } from "@/templates/types";

/** Add a layout by registering its component here. Unknown ids fall back to lane-stage. */
const templates: Record<string, ComponentType<LaneDeskProps>> = {
  "lane-stage": LaneStage,
  "half-million": HalfMillionLane,
};

export function resolveTemplate(templateId: string) {
  const Template = templates[templateId];
  if (Template) return { Template, usedFallback: false };
  return { Template: templates["lane-stage"], usedFallback: true };
}
