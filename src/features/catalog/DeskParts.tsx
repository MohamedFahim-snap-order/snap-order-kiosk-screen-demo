import { signOutAction } from "@/features/auth/actions/auth.actions";
import { MENU_ITEMS, money, type MenuCategory, type MenuItem } from "@/features/catalog/demo-menu";
import styles from "@/features/catalog/desk.module.css";
import type { CartLine } from "@/templates/types";

export function DeskTop({
  vendorName,
  branchName,
  onStop,
  started,
}: {
  vendorName: string;
  branchName: string;
  onStop: () => void;
  started: boolean;
}) {
  return (
    <header className={styles.top}>
      <span className={styles.mark} aria-hidden="true">
        SO
      </span>
      <div>
        <h1 className={styles.vendor}>{vendorName}</h1>
        <p className={styles.branch}>{branchName}</p>
      </div>
      <span className={styles.spacer} />
      <span className={styles.pill}>Demo environment</span>
      <button className={styles.end} type="button" onClick={onStop} disabled={!started}>
        End session
      </button>
      <form action={signOutAction}>
        <button className={styles.signOut} type="submit">
          Sign out
        </button>
      </form>
    </header>
  );
}

export function CategoryRail({
  categories,
  categoryId,
  onCategory,
}: {
  categories: MenuCategory[];
  categoryId: string;
  onCategory: (id: string) => void;
}) {
  return (
    <nav className={styles.rail} aria-label="Categories">
      {categories.map((category) => {
        const count = MENU_ITEMS.filter((item) => item.categoryId === category.id).length;
        return (
          <button
            key={category.id}
            className={styles.cat}
            type="button"
            aria-pressed={category.id === categoryId}
            onClick={() => onCategory(category.id)}
          >
            {category.name}
            <span className={styles.count}>{count}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function MenuGrid({ items, started, onAdd }: { items: MenuItem[]; started: boolean; onAdd: (id: string) => void }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <button key={item.id} className={styles.card} type="button" disabled={!started} onClick={() => onAdd(item.id)}>
          <span className={styles.swatch} aria-hidden="true" />
          <span className={styles.name}>{item.name}</span>
          <span className={styles.price}>{money(item.price)}</span>
          <span className={styles.kcal}>{item.kcal} cal</span>
        </button>
      ))}
    </div>
  );
}

export function OrderPanel({
  cart,
  subtotal,
  total,
  started,
  pending,
  onStart,
  onCheckout,
}: {
  cart: CartLine[];
  subtotal: number;
  total: number;
  started: boolean;
  pending: boolean;
  onStart: () => void;
  onCheckout: () => void;
}) {
  const count = cart.reduce((sum, line) => sum + line.qty, 0);
  return (
    <aside className={styles.order} aria-label="Order">
      <div className={styles.orderHead}>
        <span>Order</span>
        <span>{count}</span>
      </div>
      {cart.length === 0 ? (
        <p className={styles.empty}>Cart is empty. Start, then choose a product.</p>
      ) : (
        <ul className={styles.lines}>
          {cart.map((line) => (
            <li key={line.item.id} className={styles.line}>
              <span>
                {line.item.name} · {line.qty}
              </span>
              <span>{money(line.item.price * line.qty)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className={styles.totals}>
        <p>
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </p>
        <p className={styles.grand}>
          <span>Total</span>
          <span>{money(total)}</span>
        </p>
      </div>
      <div className={styles.orderFoot}>
        <button className={styles.start} type="button" aria-pressed={started} disabled={pending} onClick={onStart}>
          {started ? "Listening" : "Start"}
        </button>
        <p className={styles.hint}>{started ? "Choose a product to add it." : "Tap to begin voice ordering."}</p>
        <button className={styles.checkout} type="button" disabled={!started || cart.length === 0} onClick={onCheckout}>
          Proceed to checkout
        </button>
      </div>
    </aside>
  );
}

export function CheckoutSheet({
  open,
  total,
  confirmed,
  pay,
  windowHint,
  next,
  onNextCustomer,
}: {
  open: boolean;
  total: number;
  confirmed: string;
  pay: string;
  windowHint: string;
  next: string;
  onNextCustomer: () => void;
}) {
  if (!open) return null;
  return (
    <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="order-confirmed">
      <div className={styles.sheet}>
        <p>{confirmed}</p>
        <h2 id="order-confirmed">#{101}</h2>
        <p>
          {pay} <strong>{money(total)}</strong>
        </p>
        <p>{windowHint}</p>
        <button className={styles.next} type="button" onClick={onNextCustomer}>
          {next}
        </button>
      </div>
    </div>
  );
}
