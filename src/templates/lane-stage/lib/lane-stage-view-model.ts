import { defaultSelections, unitPrice } from "@/features/catalog/lib/cart";
import { money } from "@/features/catalog/demo-menu";
import type { LaneDeskProps } from "@/templates/types";

const VAT_RATE = 0.15;

export function createLaneStageViewModel(props: LaneDeskProps) {
  const calorieUnit = props.locale === "ar" ? "سعرة" : "cal";
  const visibleItems = props.items
    .filter((item) => item.categoryId === props.categoryId)
    .map((item) => ({
      ...item,
      displayPrice: money(unitPrice(item, defaultSelections(item))),
      displayCalories: item.kcal == null ? null : `${item.kcal} ${calorieUnit}`,
    }));

  const gross = props.subtotal;
  const subtotal = gross / (1 + VAT_RATE);
  const vat = gross - subtotal;

  return {
    visibleItems,
    cartCount: props.cart.reduce((sum, line) => sum + line.qty, 0),
    currentCategory: props.categories.find((category) => category.id === props.categoryId),
    latestLine: props.lines.at(-1),
    totals: {
      subtotal: money(subtotal),
      vat: money(vat),
    },
  };
}
