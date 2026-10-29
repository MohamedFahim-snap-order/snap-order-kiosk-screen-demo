"use client";

import { useState } from "react";
import { DISPLAY_PRODUCTS } from "./menu";

export const ORDER_PAGE_SIZE = 2;
type OrderLine = { productId: string; quantity: number };

export function useDualDisplay(initialLocale: "en" | "ar") {
  const [cart, setCart] = useState<OrderLine[]>([
    { productId: "signature", quantity: 1 },
    { productId: "choc-croissant", quantity: 1 },
  ]);
  const [voiceActive, setVoiceActive] = useState(false);
  const [reply, setReply] = useState<{ en: string; ar: string } | null>(null);
  const [orderPage, setOrderPage] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState(104);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

  const lines = cart.flatMap((line) => {
    const product = DISPLAY_PRODUCTS.find((entry) => entry.id === line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const total = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const pageCount = Math.max(1, Math.ceil(lines.length / ORDER_PAGE_SIZE));
  const currentPage = Math.min(orderPage, pageCount - 1);
  const visibleLines = lines.slice(currentPage * ORDER_PAGE_SIZE, (currentPage + 1) * ORDER_PAGE_SIZE);

  function addProduct(productId: string) {
    if (confirmed) return;
    const product = DISPLAY_PRODUCTS.find((entry) => entry.id === productId);
    if (!product) return;
    const existingIndex = cart.findIndex((line) => line.productId === productId);
    setOrderPage(Math.floor((existingIndex === -1 ? cart.length : existingIndex) / ORDER_PAGE_SIZE));
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      return existing
        ? current.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { productId, quantity: 1 }];
    });
    setLastAdded(productId);
    setReply({ en: `${product.name}. Good choice. It’s on your order.`, ar: `${product.nameAr}. اختيار رائع، أضفناه إلى طلبك.` });
  }

  function changeQuantity(productId: string, change: number) {
    if (confirmed) return;
    setCart((current) => current
      .map((line) => line.productId === productId ? { ...line, quantity: Math.max(0, line.quantity + change) } : line)
      .filter((line) => line.quantity > 0));
    setLastAdded(null);
  }

  function toggleVoice() {
    if (confirmed) return;
    setVoiceActive((current) => !current);
    setReply(null);
  }

  function confirmOrder() {
    if (itemCount === 0) return;
    setConfirmed(true);
    setVoiceActive(false);
  }

  function startFresh() {
    setCart([]);
    setVoiceActive(false);
    setReply(null);
    setOrderPage(0);
    setConfirmed(false);
    setLastAdded(null);
    if (confirmed) setOrderNumber((current) => current + 1);
  }

  return {
    locale: initialLocale, voiceActive, reply, lines, visibleLines, itemCount, total,
    subtotal: total / 1.15, vat: total - total / 1.15,
    currentPage, pageCount, setOrderPage, confirmed, orderNumber, lastAdded,
    addProduct, changeQuantity, toggleVoice, confirmOrder, startFresh,
  };
}
