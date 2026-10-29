"use client";

import { createLaneStageViewModel } from "@/templates/lane-stage/lib/lane-stage-view-model";
import type { LaneDeskProps } from "@/templates/types";

export function useLaneStageController(props: LaneDeskProps) {
  return {
    ...createLaneStageViewModel(props),
    canEndSession: props.started || props.cart.length > 0,
    toggleVoice: props.started ? props.onStop : props.onStart,
  };
}
