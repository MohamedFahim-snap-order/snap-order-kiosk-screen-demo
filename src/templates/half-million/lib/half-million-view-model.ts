import { defaultSelections, lineAmount, unitPrice } from "@/features/catalog/lib/cart";
import { bilingualName, choiceName, money } from "@/features/catalog/demo-menu";
import { laneLabels } from "@/templates/half-million/lane-labels";
import type { LaneDeskProps } from "@/templates/types";

const VAT_RATE = 0.15;

const HALF_MILLION_IMAGES: Record<string, string> = {
  cappuccino: "/assets/lane-stage/hm_hot_cappuccino.svg",
  signature: "/assets/lane-stage/hm_hot_signature.svg",
  chocolate: "/assets/lane-stage/hm_hot_hot_chocolate.svg",
  americano: "/assets/lane-stage/hm_hot_americano.svg",
  latte: "/assets/lane-stage/hm_hot_latte.svg",
  flat: "/assets/lane-stage/hm_hot_flat_white.svg",
  cortado: "/assets/lane-stage/hm_hot_cortado.svg",
  drip: "/assets/lane-stage/hm_hot_hot_brazilian_drip_coffee.svg",
  piccolo: "/assets/lane-stage/hm_hot_piccolo.svg",
  ethiopian: "/assets/lane-stage/hm_hot_hot_drip_ethiopian_coffee.svg",
  espresso: "/assets/lane-stage/hm_hot_espresso.svg",
  box: "/assets/lane-stage/hm_hot_hot_brazilian_drip_coffee_box.svg",
  "ethiopian-box": "/assets/lane-stage/hm_hot_ethiopian_drip_coffee_box.svg",
  "chocolate-box": "/assets/lane-stage/hm_hot_hot_chocolate_box.svg",
};

export const HALF_MILLION_MUGS = [
  { id: "khozama", name: "Khozama Mug", price: 24, image: "/assets/lane-stage/hm_cups_khozama_mug.svg", tint: "#8C7AA8" },
  { id: "beige", name: "Beige Mug – Hot", price: 24, image: "/assets/lane-stage/hm_cups_beige_mug_hot.svg", tint: "#C9A87B" },
  { id: "waee", name: "Wae’e Mug", price: 24, image: "/assets/lane-stage/hm_cups_waee_mug.svg", tint: "#9F8668" },
] as const;

export function createHalfMillionViewModel(props: LaneDeskProps, selectedMugId: string) {
  const labels = laneLabels(props.locale);
  const visibleItems = props.items
    .filter((item) => item.categoryId === props.categoryId)
    .map((item) => ({
      ...item,
      image: HALF_MILLION_IMAGES[item.id] ?? item.image,
      displayPrice: money(unitPrice(item, defaultSelections(item))),
      displayCalories: item.kcal == null ? null : `${item.kcal} ${labels.cal}`,
    }));

  const cartRows = props.cart.map((line) => {
    const sizeGroup = (line.item.groups ?? []).find((group) => group.kind === "size");
    const selectedSize = sizeGroup?.options.find((option) => option.id === line.selections[sizeGroup.id]);
    const itemCalories = selectedSize?.kcal === undefined ? line.item.kcal : selectedSize.kcal;

    const names = bilingualName(line.item, props.locale);
    return {
      key: line.key,
      name: names.primary,
      nameAlt: names.secondary,
      nameLang: names.primaryLang,
      nameAltLang: names.secondaryLang,
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
  const mugs = HALF_MILLION_MUGS.map((mug) => ({
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
    totals: { subtotal: money(subtotal), vat: money(vat), total: money(gross) },
    mugs,
    pourTint: mugs.find((mug) => mug.selected)?.tint ?? HALF_MILLION_MUGS[0].tint,
  };
}
