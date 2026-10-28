import { MENU_ITEMS } from "@/features/catalog/demo-menu";
import { defaultSelections, lineKey, type CartLine } from "@/features/catalog/lib/cart";

const LANE_STAGE_CART_ITEM_IDS = [
  "chocolate",
  "choc-croissant",
  "chicken",
  "cappuccino",
  "latte",
] as const;

export function createLaneStageDemoCart(): CartLine[] {
  return LANE_STAGE_CART_ITEM_IDS.flatMap((itemId) => {
    const item = MENU_ITEMS.find((candidate) => candidate.id === itemId);
    if (!item) return [];

    const selections = defaultSelections(item);
    return [{ key: lineKey(item.id, selections), item, qty: 1, selections }];
  });
}
