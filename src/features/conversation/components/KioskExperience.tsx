"use client";

import { useKioskScreen } from "@/features/conversation/hooks/useKioskScreen";
import type { KioskConfig } from "@/features/kiosk-session/types/kiosk-config";
import { applyTheme } from "@/shared/theme/apply-theme";
import { resolveTemplate } from "@/templates/registry";

type KioskExperienceProps = {
  config: KioskConfig;
};

export function KioskExperience({ config }: KioskExperienceProps) {
  const screen = useKioskScreen();
  const { Template, usedFallback } = resolveTemplate(config.templateId);

  return (
    <main style={applyTheme(config.theme)} lang={config.locale} dir={config.dir} data-scheme={config.theme.scheme} className="kiosk-root">
      <Template
        locale={config.locale}
        vendorName={config.vendor.name}
        branchName={config.branch.name}
        agentName={config.agent.name}
        started={screen.started}
        pending={screen.pending}
        categoryId={screen.categoryId}
        categories={screen.categories}
        items={screen.items}
        cart={screen.cart}
        expanded={screen.expanded}
        subtotal={screen.subtotal}
        total={screen.subtotal}
        lines={screen.lines}
        checkoutOpen={screen.checkoutOpen}
        notice={usedFallback ? <p>{config.copy.fallbackNotice}</p> : screen.notice ? <p>{screen.notice}</p> : null}
        onCategory={screen.onCategory}
        onAdd={screen.onAdd}
        onQty={screen.onQty}
        onSelect={screen.onSelect}
        onToggleGroup={screen.onToggleGroup}
        onStart={screen.onStart}
        onStop={screen.onStop}
        onCheckout={screen.onCheckout}
        onNextCustomer={screen.onNextCustomer}
      />
    </main>
  );
}
