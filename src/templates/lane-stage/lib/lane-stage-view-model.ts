import { defaultSelections, lineAmount, unitPrice } from "@/features/catalog/lib/cart";
import { choiceName, money } from "@/features/catalog/demo-menu";
import { laneLabels } from "@/templates/lane-labels";
import type { LaneDeskProps } from "@/templates/types";

const VAT_RATE = 0.15;

export const LANE_STAGE_MUGS = [
  {
    id: "khozama",
    name: "Khozama Mug",
    price: 24,
    image: "/assets/lane-stage/hm_cups_khozama_mug.svg",
    tint: "#8C7AA8",
  },
  {
    id: "beige",
    name: "Beige Mug – Hot",
    price: 24,
    image: "/assets/lane-stage/hm_cups_beige_mug_hot.svg",
    tint: "#C9A87B",
  },
  {
    id: "waee",
    name: "Wae’e Mug",
    price: 24,
    image: "/assets/lane-stage/hm_cups_waee_mug.svg",
    tint: "#9F8668",
  },
] as const;

export function createLaneStageViewModel(props: LaneDeskProps, selectedMugId: string) {
  const labels = laneLabels(props.locale);
  const visibleItems = props.items
    .filter((item) => item.categoryId === props.categoryId)
    .map((item) => ({
      ...item,
      displayPrice: money(unitPrice(item, defaultSelections(item))),
      displayCalories: item.kcal == null ? null : `${item.kcal} ${labels.cal}`,
    }));

  const cartRows = props.cart.map((line) => {
    const sizeGroup = (line.item.groups ?? []).find((group) => group.kind === "size");
    const selectedSize = sizeGroup?.options.find(
      (option) => option.id === line.selections[sizeGroup.id],
    );
    const itemCalories = selectedSize?.kcal === undefined ? line.item.kcal : selectedSize.kcal;

    return {
      key: line.key,
      name: line.item.name,
      qty: line.qty,
      price: money(lineAmount(line)),
      calories: itemCalories == null ? null : `${itemCalories * line.qty} ${labels.cal}`,
      sizeGroups: (line.item.groups ?? [])
        .filter((group) => group.kind === "size")
        .map((group) => ({
          id: group.id,
          label: choiceName(group, props.locale),
          selectedOptionId: line.selections[group.id],
          options: group.options.map((option) => ({
            id: option.id,
            label: choiceName(option, props.locale),
          })),
        })),
    };
  });

  const gross = props.subtotal;
  const subtotal = gross / (1 + VAT_RATE);
  const vat = gross - subtotal;

  const mugs = LANE_STAGE_MUGS.map((mug) => ({
    ...mug,
    selected: mug.id === selectedMugId,
    displayPrice: `SAR ${mug.price.toFixed(0)}`,
  }));

  return {
    labels,
    visibleItems,
    cartRows,
    cartCount: props.cart.reduce((sum, line) => sum + line.qty, 0),
    currentCategory: props.categories.find((category) => category.id === props.categoryId),
    latestLine: props.lines.at(-1),
    totals: {
      subtotal: money(subtotal),
      vat: money(vat),
      total: money(gross),
    },
    mugs,
    pourTint: mugs.find((mug) => mug.selected)?.tint ?? LANE_STAGE_MUGS[0].tint,
  };
}
