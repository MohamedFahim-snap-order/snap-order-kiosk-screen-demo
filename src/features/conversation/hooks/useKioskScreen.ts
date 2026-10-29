"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addItem, lineAmount, selectOption, setQty, type CartLine } from "@/features/catalog/lib/cart";
import { createLaneStageDemoCart } from "@/features/catalog/lib/demo-cart";
import { MENU_CATEGORIES, MENU_ITEMS } from "@/features/catalog/demo-menu";
import { useAgentStream } from "@/features/conversation/hooks/useAgentStream";
import { endConversationAction, startPresenceAction } from "@/features/sensor/actions/presence.action";

export function useKioskScreen(templateId: string) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [pending, setPending] = useState(false);
  const [categoryId, setCategoryId] = useState(MENU_CATEGORIES[0].id);
  const [cart, setCart] = useState<CartLine[]>(() =>
    templateId === "lane-stage" || templateId === "half-million" ? createLaneStageDemoCart() : [],
  );
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const stream = useAgentStream(conversationId, started && Boolean(conversationId));
  const subtotal = cart.reduce((sum, line) => sum + lineAmount(line), 0);
  const lines = stream.events
    .filter((event) => event.type === "agent.transcript" && event.text)
    .map((event) => ({ id: String(event.id), text: event.text ?? "" }));

  async function onStart() {
    if (started) return;
    setPending(true);
    setNotice(null);
    const result = await startPresenceAction();
    setPending(false);
    if (!result.ok) {
      setNotice(result.message);
      toast.error(result.message);
      return;
    }
    setConversationId(result.conversationId);
    setStarted(true);
  }

  async function onStop() {
    if (!conversationId) {
      setStarted(false);
      return;
    }
    setPending(true);
    const result = await endConversationAction(conversationId);
    setPending(false);
    if (!result.ok) {
      setNotice(result.message);
      toast.error(result.message);
      return;
    }
    setStarted(false);
    setConversationId(null);
  }

  function onAdd(id: string) {
    const item = MENU_ITEMS.find((entry) => entry.id === id);
    if (!item) return;
    setCart((current) => addItem(current, item));
  }

  return {
    started,
    pending,
    categoryId,
    categories: MENU_CATEGORIES,
    items: MENU_ITEMS,
    cart,
    subtotal,
    lines,
    checkoutOpen,
    notice,
    onCategory: setCategoryId,
    onAdd,
    onQty: (key: string, qty: number) => setCart((current) => setQty(current, key, qty)),
    onSelect: (key: string, groupId: string, optionId: string) => setCart((current) => selectOption(current, key, groupId, optionId)),
    onStart: () => void onStart(),
    onStop: () => void onStop(),
    onCheckout: () => setCheckoutOpen(true),
    onNextCustomer: () => {
      setCheckoutOpen(false);
      setCart([]);
      void onStop();
    },
  };
}
