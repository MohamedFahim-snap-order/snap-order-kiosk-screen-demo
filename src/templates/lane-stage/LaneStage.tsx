import { signOutAction } from "@/features/auth/actions/auth.actions";
import { CheckoutSheet } from "@/features/catalog/DeskParts";
import { choiceName, money } from "@/features/catalog/demo-menu";
import { lineAmount } from "@/features/catalog/lib/cart";
import { laneLabels } from "@/templates/lane-labels";
import styles from "./lane-stage.module.css";
import type { LaneDeskProps } from "@/templates/types";

export function LaneStage(props: LaneDeskProps) {
  const labels = laneLabels(props.locale);
  const visible = props.items.filter((item) => item.categoryId === props.categoryId);
  const category = props.categories.find((entry) => entry.id === props.categoryId);
  const count = props.cart.reduce((sum, line) => sum + line.qty, 0);
  const latest = props.lines.at(-1);

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.mark} aria-hidden="true">
          SO
        </span>
        <span className={styles.divider} aria-hidden="true" />
        <div>
          <h1>{props.vendorName}</h1>
          <p>{props.branchName}</p>
        </div>
        <span className={styles.spacer} />
        <button className={styles.end} type="button" onClick={props.onStop} disabled={!props.started}>
          {labels.end}
        </button>
        <form action={signOutAction}>
          <button className={styles.signOut} type="submit">
            {labels.signOut}
          </button>
        </form>
      </header>

      <div className={styles.railCol}>
        <nav className={styles.rail} aria-label={labels.categories}>
          {props.categories.map((entry) => {
            const items = props.items.filter((item) => item.categoryId === entry.id).length;
            return (
              <button
                key={entry.id}
                className={styles.cat}
                type="button"
                aria-pressed={entry.id === props.categoryId}
                onClick={() => props.onCategory(entry.id)}
              >
                <span>{entry.name}</span>
                <span className={styles.count}>{items}</span>
              </button>
            );
          })}
        </nav>
        <p className={styles.powered}>
          <span>{labels.powered}</span>
          <img src="/snaporder-horizontal.png" alt="SnapOrder" />
        </p>
      </div>

      <main className={styles.menu} aria-label={category?.name ?? "Menu"}>
        {props.notice}
        <div className={styles.grid}>
          {visible.map((item) => (
            <button key={item.id} className={styles.card} type="button" disabled={!props.started} onClick={() => props.onAdd(item.id)}>
              <span className={styles.body}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.price}>{money(item.price)}</span>
                <span className={styles.cal}>{item.kcal} {labels.cal}</span>
              </span>
            </button>
          ))}
        </div>
      </main>

      <aside className={styles.cart} aria-label={labels.order}>
        <div className={styles.cartHead}>
          <h2>{labels.order}</h2>
          <span>{count}</span>
        </div>
        <div className={styles.cartItems}>
          {props.cart.length === 0 ? (
            <p className={styles.empty}>
              {labels.empty}
              <small>{labels.emptyHint}</small>
            </p>
          ) : (
            <ul>
              {props.cart.map((line) => (
                <li key={line.key}>
                  <div className={styles.rowMain}>
                    <span className={styles.rowName}>{line.item.name}</span>
                    <span className={styles.qty}>
                      <button type="button" aria-label={labels.decrease} onClick={() => props.onQty(line.key, line.qty - 1)}>
                        −
                      </button>
                      <span>{line.qty}</span>
                      <button type="button" aria-label={labels.increase} onClick={() => props.onQty(line.key, line.qty + 1)}>
                        +
                      </button>
                    </span>
                    <span className={styles.rowPrice}>
                      {money(lineAmount(line))}
                      <small>
                        {line.item.kcal * line.qty} {labels.cal}
                      </small>
                    </span>
                  </div>
                  {(line.item.groups ?? []).map((group) => {
                    const open = group.kind === "size" || props.expanded.includes(`${line.key}:${group.id}`);
                    const chosen = line.selections[group.id];
                    const options = open ? group.options : group.options.filter((option) => option.id === chosen);
                    return (
                      <div key={group.id} className={styles.mod}>
                        <button type="button" className={styles.modLabel} onClick={() => props.onToggleGroup(line.key, group.id)}>
                          {choiceName(group, props.locale)}
                        </button>
                        <span className={styles.chips}>
                          {options.map((option) => {
                            const selected = option.id === chosen;
                            return (
                              <button
                                key={option.id}
                                type="button"
                                className={selected ? (group.kind === "size" ? styles.chipSize : styles.chipOn) : styles.chip}
                                aria-pressed={selected}
                                onClick={() => (open ? props.onSelect(line.key, group.id, option.id) : props.onToggleGroup(line.key, group.id))}
                              >
                                {choiceName(option, props.locale)}
                                {option.priceDelta > 0 ? <small>+{option.priceDelta}</small> : null}
                              </button>
                            );
                          })}
                        </span>
                      </div>
                    );
                  })}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.totals}>
          <p>
            <span>{labels.subtotal}</span>
            <span>{money(props.subtotal)}</span>
          </p>
          <p className={styles.grand}>
            <span>{labels.total}</span>
            <span>{money(props.total)}</span>
          </p>
        </div>
        <button className={styles.checkout} type="button" disabled={!props.started || props.cart.length === 0} onClick={props.onCheckout}>
          {labels.checkout}
        </button>
        <div className={styles.voice}>
          <button type="button" aria-pressed={props.started} disabled={props.pending} onClick={props.onStart}>
            {props.started ? labels.listening : labels.start}
          </button>
          {props.started ? (
            <span className={styles.wave} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
          ) : null}
          <p aria-live="polite">{latest?.text ?? (props.started ? `${props.agentName} ${labels.listeningHint}` : labels.idle)}</p>
        </div>
      </aside>
      <CheckoutSheet
        open={props.checkoutOpen}
        total={props.total}
        confirmed={labels.confirmed}
        pay={labels.pay}
        windowHint={labels.window}
        next={labels.next}
        onNextCustomer={props.onNextCustomer}
      />
    </div>
  );
}
