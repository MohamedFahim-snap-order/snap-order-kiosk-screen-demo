"use client";

import { useEffect, useState } from "react";
import { createHalfMillionViewModel, HALF_MILLION_MUGS } from "@/templates/half-million/lib/half-million-view-model";
import type { LaneDeskProps } from "@/templates/types";

const MUG_ROTATION_MS = 2_000;

export function useHalfMillionController(props: LaneDeskProps) {
  const [selectedMugId, setSelectedMugId] = useState<string>(HALF_MILLION_MUGS[0].id);
  const viewModel = createHalfMillionViewModel(props, selectedMugId);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSelectedMugId((currentId) => {
        const currentIndex = HALF_MILLION_MUGS.findIndex((mug) => mug.id === currentId);
        return HALF_MILLION_MUGS[(currentIndex + 1) % HALF_MILLION_MUGS.length].id;
      });
    }, MUG_ROTATION_MS);

    return () => window.clearInterval(timer);
  }, []);

  const english = props.locale !== "ar";
  const copy = english
    ? {
        demoBadge: "Demo Environment",
        endSession: "End Session",
        sessionEnded: "Session ended",
        mugOfferLabel: "Half Million mug offer",
        mugEyebrow: "Take one home",
        mugHeading: "Half Million mugs",
      }
    : {
        demoBadge: "بيئة تجريبية",
        endSession: "إنهاء الجلسة",
        sessionEnded: "انتهت الجلسة",
        mugOfferLabel: "عرض أكواب هاف مليون",
        mugEyebrow: "خذ واحداً معك",
        mugHeading: "أكواب هاف مليون",
      };

  return {
    ...viewModel,
    copy,
    canEndSession: props.started || props.cart.length > 0,
    endSession: props.onNextCustomer,
    voiceActive: props.started,
    toggleVoice: props.started ? props.onStop : props.onStart,
    voiceLabel: props.started ? viewModel.labels.listening : viewModel.labels.start,
    voiceStatus:
      viewModel.latestLine?.text
      ?? (props.started ? `${props.agentName} ${viewModel.labels.listeningHint}` : copy.sessionEnded),
  };
}
