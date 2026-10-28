import Image from "next/image";
import { signOutAction } from "@/features/auth/actions/auth.actions";
import { CheckoutSheet } from "@/features/catalog/DeskParts";
import { useLaneStageController } from "@/templates/lane-stage/hooks/useLaneStageController";
import styles from "./lane-stage.module.css";
import type { LaneDeskProps } from "@/templates/types";

export function LaneStage(props: LaneDeskProps) {
  const screen = useLaneStageController(props);

  return (
    <div className={styles.shell}>
      <div className={styles.demoBadge}>{screen.copy.demoBadge}</div>

      <header className={styles.header}>
        <Image
          className={styles.brandLogo}
          src="/assets/lane-stage/halfm-logo.svg"
          alt="MF - Lane"
          width={75}
          height={30}
          priority
        />
        <span className={styles.divider} aria-hidden="true" />
        <div className={styles.vendor}>
          <div className={styles.vendorName}>{props.vendorName}</div>
          <div className={styles.branchName}>{props.branchName}</div>
        </div>
        <span className={styles.spacer} />
        <button
          className={styles.end}
          type="button"
          onClick={screen.endSession}
          disabled={!screen.canEndSession}
        >
          {screen.copy.endSession}
        </button>
        <form action={signOutAction}>
          <button
            className={styles.signOut}
            type="submit"
            title="Leave this account so another user can sign in"
          >
            {screen.labels.signOut}
          </button>
        </form>
      </header>

      <div className={styles.railCol}>
        <nav className={styles.rail} aria-label={screen.labels.categories}>
          {props.categories.map((entry) => (
            <button
              key={entry.id}
              className={styles.cat}
              type="button"
              aria-pressed={entry.id === props.categoryId}
              onClick={() => props.onCategory(entry.id)}
            >
              <span className={styles.catIcon}>
                <Image src={entry.image} alt="" width={24} height={24} />
              </span>
              <span className={styles.catName}>{entry.name}</span>
              <span className={styles.count}>{entry.displayCount}</span>
            </button>
          ))}
        </nav>
        <div className={styles.powered}>
          <span>{screen.labels.powered}</span>
          <Image src="/snaporder-horizontal.png" alt="SnapOrder" width={98} height={18} />
        </div>
      </div>

      <main className={styles.menu} aria-label={screen.currentCategory?.name ?? "Menu"}>
        {props.notice ? <div className={styles.notice}>{props.notice}</div> : null}
        <div className={styles.grid}>
          {screen.visibleItems.map((item) => (
            <button
              key={item.id}
              className={styles.card}
              type="button"
              onClick={() => props.onAdd(item.id)}
            >
              <span className={styles.cardImage}>
                {item.image ? <Image src={item.image} alt="" width={80} height={80} /> : null}
              </span>
              <span className={styles.body}>
                <span className={styles.name}>{item.name}</span>
                {item.nameAr ? (
                  <span className={styles.nameAr} lang="ar" dir="rtl">
                    {item.nameAr}
                  </span>
                ) : null}
                <span className={styles.price}>{item.displayPrice}</span>
                {item.displayCalories ? <span className={styles.cal}>{item.displayCalories}</span> : null}
              </span>
            </button>
          ))}
        </div>
      </main>

      <aside className={styles.cart} aria-label={screen.labels.order}>
        <div className={styles.cartHead}>
          <h2>🛒 {screen.labels.order}</h2>
          <span>{screen.cartCount}</span>
        </div>
        <div className={styles.cartItems}>
          {screen.cartRows.length === 0 ? (
            <p className={styles.empty}>
              <span className={styles.emptyIcon}>🛒</span>
              <span>{screen.labels.empty}</span>
              <small>{screen.labels.emptyHint}</small>
            </p>
          ) : (
            <ul>
              {screen.cartRows.map((line) => (
                <li key={line.key}>
                  <div className={styles.rowMain}>
                    <span className={styles.rowName}>{line.name}</span>
                    <span className={styles.qty}>{line.qty}</span>
                    <span className={styles.rowPrice}>
                      {line.price}
                      {line.calories ? <small>{line.calories}</small> : null}
                    </span>
                  </div>
                  {line.sizeGroups.map((group) => (
                    <div key={group.id} className={styles.mod}>
                      <span className={styles.modLabel}>{group.label}</span>
                      <span className={styles.chips}>
                        {group.options.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            className={option.id === group.selectedOptionId ? styles.chipSize : styles.chip}
                            aria-pressed={option.id === group.selectedOptionId}
                            onClick={() => props.onSelect(line.key, group.id, option.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </span>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.totals}>
          <p>
            <span>{screen.labels.subtotal}</span>
            <span>{screen.totals.subtotal}</span>
          </p>
          <p>
            <span>VAT 15% · ضريبة القيمة المضافة %15</span>
            <span>{screen.totals.vat}</span>
          </p>
          <p className={styles.grand}>
            <span>{screen.labels.total}</span>
            <span>{screen.totals.total}</span>
          </p>
        </div>
        <div className={styles.voice}>
          <button
            type="button"
            aria-pressed={screen.voiceActive}
            disabled={props.pending}
            onClick={screen.toggleVoice}
          >
            🎤 {screen.voiceLabel}
          </button>
          {screen.voiceActive ? (
            <span className={styles.wave} aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
            </span>
          ) : null}
          <p aria-live="polite">{screen.voiceStatus}</p>
        </div>
      </aside>

      <section className={styles.mugOffer} role="status" aria-label={screen.copy.mugOfferLabel}>
        <div className={styles.mugPour}>
          <div className={styles.mugPourCup}>
            <span className={styles.mugPourStream} />
            <span className={styles.mugPourFill} style={{ background: screen.pourTint }} />
            <span className={styles.mugPourMark}>MF</span>
          </div>
        </div>
        <div className={styles.mugOfferBody}>
          <div className={styles.mugEyebrow}>{screen.copy.mugEyebrow}</div>
          <h2 className={styles.mugHead}>{screen.copy.mugHeading}</h2>
          <div className={styles.mugRow}>
            {screen.mugs.map((mug) => (
              <div
                key={mug.id}
                className={mug.selected ? `${styles.mugCard} ${styles.mugCardCurrent}` : styles.mugCard}
              >
                <span className={styles.mugSwatch} style={{ background: mug.tint }} />
                <Image className={styles.mugCardImage} src={mug.image} alt="" width={46} height={46} />
                <span className={styles.mugCardName}>{mug.name}</span>
                <span className={styles.mugCardPrice}>{mug.displayPrice}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CheckoutSheet
        open={props.checkoutOpen}
        total={props.total}
        confirmed={screen.labels.confirmed}
        pay={screen.labels.pay}
        windowHint={screen.labels.window}
        next={screen.labels.next}
        onNextCustomer={props.onNextCustomer}
      />
    </div>
  );
}
