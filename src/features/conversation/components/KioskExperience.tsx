"use client";

import { useKioskScreen } from "@/features/conversation/hooks/useKioskScreen";
import type { KioskConfig } from "@/features/kiosk-session/types/kiosk-config";
import { resolveTemplate } from "@/templates/registry";

type KioskExperienceProps = {
  config: KioskConfig;
};

export function KioskExperience({ config }: KioskExperienceProps) {
  const screen = useKioskScreen(config.templateId);
  const { Template, usedFallback } = resolveTemplate(config.templateId);

  return (
    <main lang={config.locale} dir={config.dir} data-scheme={config.theme.scheme} className="kiosk-root">
      <Template
        locale={config.locale}
        vendorName={config.vendor.name}
        agentName={config.agent.name}
        branchName={config.branch.name}
        started={screen.started}
        pending={screen.pending}
        categoryId={screen.categoryId}
        categories={screen.categories}
        items={screen.items}
        cart={screen.cart}
        subtotal={screen.subtotal}
        total={screen.subtotal}
        lines={screen.lines}
        checkoutOpen={screen.checkoutOpen}
        notice={usedFallback ? <p>{config.copy.fallbackNotice}</p> : screen.notice ? <p>{screen.notice}</p> : null}
        onCategory={screen.onCategory}
        onAdd={screen.onAdd}
        onQty={screen.onQty}
        onSelect={screen.onSelect}
        onStart={screen.onStart}
        onStop={screen.onStop}
        onCheckout={screen.onCheckout}
        onNextCustomer={screen.onNextCustomer}
      />
    </main>
  );
}
