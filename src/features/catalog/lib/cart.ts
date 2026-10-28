import type { MenuItem } from "@/features/catalog/demo-menu";

export type CartLine = {
  key: string;
  item: MenuItem;
  qty: number;
  selections: Record<string, string>;
};

function selectionKey(selections: Record<string, string>) {
  return Object.keys(selections)
    .sort()
    .map((groupId) => `${groupId}:${selections[groupId]}`)
    .join("|");
}

export function defaultSelections(item: MenuItem) {
  const selections: Record<string, string> = {};
  for (const group of item.groups ?? []) {
    const selected = group.options.find((option) => option.id === group.defaultOptionId) ?? group.options[0];
    if (selected) selections[group.id] = selected.id;
  }
  return selections;
}

export function lineKey(itemId: string, selections: Record<string, string>) {
  return `${itemId}|${selectionKey(selections)}`;
}

export function unitPrice(item: MenuItem, selections: Record<string, string>) {
  return (item.groups ?? []).reduce((price, group) => {
    const chosen = group.options.find((option) => option.id === selections[group.id]);
    return price + (chosen?.priceDelta ?? 0);
  }, item.price);
}

export function lineAmount(line: CartLine) {
  return unitPrice(line.item, line.selections) * line.qty;
}

function merge(lines: CartLine[]) {
  const merged = new Map<string, CartLine>();
  for (const line of lines) {
    const previous = merged.get(line.key);
    merged.set(line.key, previous ? { ...previous, qty: previous.qty + line.qty } : line);
  }
  return [...merged.values()];
}

export function addItem(cart: CartLine[], item: MenuItem) {
  const selections = defaultSelections(item);
  const key = lineKey(item.id, selections);
  const existing = cart.find((line) => line.key === key);
  if (!existing) return [...cart, { key, item, qty: 1, selections }];
  return cart.map((line) => (line.key === key ? { ...line, qty: line.qty + 1 } : line));
}

export function setQty(cart: CartLine[], key: string, qty: number) {
  if (qty < 1) return cart.filter((line) => line.key !== key);
  return cart.map((line) => (line.key === key ? { ...line, qty } : line));
}

export function selectOption(cart: CartLine[], key: string, groupId: string, optionId: string) {
  return merge(
    cart.map((line) => {
      if (line.key !== key) return line;
      const selections = { ...line.selections, [groupId]: optionId };
      return { ...line, selections, key: lineKey(line.item.id, selections) };
    }),
  );
}
