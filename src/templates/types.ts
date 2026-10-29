import type { ReactNode } from "react";
import type { MenuCategory, MenuItem } from "@/features/catalog/demo-menu";
import type { CartLine } from "@/features/catalog/lib/cart";

export type { CartLine };

export type LaneDeskProps = {
  locale: string;
  vendorName: string;
  agentName: string;
  branchName: string;
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
  onStart: () => void;
  onStop: () => void;
  onCheckout: () => void;
  onNextCustomer: () => void;
};
