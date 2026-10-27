import type { ReactNode } from "react";
import type { MenuCategory, MenuItem } from "@/features/catalog/demo-menu";
import type { CartLine } from "@/features/catalog/lib/cart";

export type { CartLine };

export type LaneDeskProps = {
  locale: string;
  vendorName: string;
  branchName: string;
  agentName: string;
  started: boolean;
  pending: boolean;
  categoryId: string;
  categories: MenuCategory[];
  items: MenuItem[];
  cart: CartLine[];
  subtotal: number;
  total: number;
  lines: { id: string; text: string }[];
  checkoutOpen: boolean;
  notice: ReactNode;
  onCategory: (id: string) => void;
  onAdd: (id: string) => void;
  onQty: (key: string, qty: number) => void;
  onSelect: (key: string, groupId: string, optionId: string) => void;
  onToggleGroup: (key: string, groupId: string) => void;
  expanded: string[];
  onStart: () => void;
  onStop: () => void;
  onCheckout: () => void;
  onNextCustomer: () => void;
};
