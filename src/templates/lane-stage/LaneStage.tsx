"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Coffee, Cookie, CupSoda, Droplets, Headphones, IceCreamBowl, Leaf, LogOut, MapPin, Mic, Minus, Package, Plus, RotateCcw, Sandwich, ShoppingBag, Sparkles, X } from "lucide-react";
import { SignOutForm } from "@/features/auth/components/SignOutForm";
import { bilingualName, choiceName, money, type MenuItem } from "@/features/catalog/demo-menu";
import { lineAmount } from "@/features/catalog/lib/cart";
import { useLaneStageController } from "@/templates/lane-stage/hooks/useLaneStageController";
import styles from "./lane-stage.module.css";
import type { LaneDeskProps } from "@/templates/types";

const categoryIcons = { hot: Coffee, cold: CupSoda, sandwiches: Sandwich, desserts: Cookie, ice: IceCreamBowl, juice: Droplets, beans: Package, mugs: Coffee };
const descriptions: Record<string, string> = {
  cappuccino: "Rich espresso. A cloud of foam.", signature: "Our signature. Your new favorite.", chocolate: "Velvety chocolate. Pure comfort.", americano: "Bold, smooth, beautifully simple.", latte: "Espresso meets silky steamed milk.", flat: "Small cup. Big coffee energy.", cortado: "Perfectly balanced, sip after sip.", drip: "Brazilian beans. Slowly brewed.", piccolo: "A little cup with a lot to say.", ethiopian: "Floral notes. A brighter brew.", espresso: "The heart of every good day.",
};

function Waveform({ active = false }: { active?: boolean }) {
  return <span className={`${styles.waveform} ${active ? styles.waveActive : ""}`} aria-hidden="true">{Array.from({ length: 21 }, (_, i) => <i key={i} style={{ "--bar": `${[12, 22, 16, 34, 46, 26, 56, 38, 62, 44, 28, 52, 35, 18, 40, 58, 30][i % 17]}px`, "--delay": `${i * -0.12}s` } as CSSProperties} />)}</span>;
}

function ProductVisual({ item, size = 160 }: { item: MenuItem; size?: number }) {
  const Icon = categoryIcons[item.categoryId as keyof typeof categoryIcons] ?? Coffee;
  return item.image ? <Image src={item.image} fill sizes={size === 160 ? "(max-width: 760px) 45vw, 25vw" : `${size}px`} alt="" className={`${styles.productImage} ${item.image.endsWith(".webp") ? styles.photoProduct : ""}`} /> : <span className={styles.productFallback}><Icon size={size * 0.4} strokeWidth={1.15} /><span>snap</span></span>;
}

export function LaneStage(props: LaneDeskProps) {
  const locale = props.locale;
  const [customizing, setCustomizing] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState("");
  const helpRef = useRef<HTMLDialogElement>(null);
  const checkoutRef = useRef<HTMLDialogElement>(null);
  const screen = useLaneStageController(props);
  const ar = locale === "ar";
  const t = (en: string, arabic: string) => ar ? arabic : en;
  const namesOf = (entry: { name: string; nameAr: string }) => bilingualName(entry, locale);
  const categoryNames = screen.currentCategory ? namesOf(screen.currentCategory) : null;

  useEffect(() => {
    if (props.checkoutOpen && !checkoutRef.current?.open) checkoutRef.current?.showModal();
    if (!props.checkoutOpen && checkoutRef.current?.open) checkoutRef.current.close();
  }, [props.checkoutOpen]);
  useEffect(() => {
    if (!lastAdded) return;
    const timeout = window.setTimeout(() => setLastAdded(""), 1400);
    return () => window.clearTimeout(timeout);
  }, [lastAdded]);

  function addItem(id: string) { props.onAdd(id); setLastAdded(id); }
  function resetOrder() { props.onNextCustomer(); setCustomizing(null); }

  return (
    <div className={styles.shell} dir={ar ? "rtl" : "ltr"} lang={locale}>
      <header className={styles.header}>
        <a href="/kiosk" className={styles.brand} aria-label={t("Snap Coffee, a SnapOrder lane", "سناب كوفي، مسار سناب أوردر")}><span className={styles.brandSymbol}><Coffee size={25} strokeWidth={2.3} /></span><span>snap<span className={styles.brandCoffee}>COFFEE</span></span><span className={styles.brandDot}>®</span></a>
        <div className={styles.location}><MapPin size={15} /><span>{t("The good coffee lane", "مسار القهوة المميزة")}<small>{props.branchName} · {t("Drive-thru", "طلبات السيارة")}</small></span></div>
        <div className={styles.headerSteps}><span className={styles.currentStep}><b>01</b>{t("Your order", "طلبك")}</span><i /><span><b>02</b>{t("Payment", "الدفع")}</span><i /><span><b>03</b>{t("Pick up & go", "استلم وانطلق")}</span></div>
        <span className={styles.demoBadge}><i />{t("Live demo", "عرض تجريبي")}</span>
        <SignOutForm className={styles.iconButton} label={t("Sign out", "تسجيل الخروج")} pendingLabel={t("Closing the lane", "جارٍ إغلاق المسار")}><LogOut size={17} /></SignOutForm>
      </header>
      <nav className={styles.rail} aria-label={t("Menu categories", "فئات القائمة")}>
        <span className={styles.railTitle}>{t("THE MENU", "القائمة")}</span>
        {props.categories.map((category) => {
          const Icon = categoryIcons[category.id as keyof typeof categoryIcons] ?? Coffee;
          const names = namesOf(category);
          return <button className={styles.category} key={category.id} type="button" aria-pressed={category.id === props.categoryId} aria-label={`${names.primary}, ${names.secondary}`} onClick={() => props.onCategory(category.id)}><span><Icon size={23} strokeWidth={1.55} /></span><span className={styles.categoryCopy}><span lang={names.primaryLang} dir={names.primaryLang === "ar" ? "rtl" : "ltr"}>{names.primary}</span><small lang={names.secondaryLang} dir={names.secondaryLang === "ar" ? "rtl" : "ltr"}>{names.secondary}</small></span>{category.id === props.categoryId && <i />}</button>;
        })}
        <button type="button" className={styles.helpButton} onClick={() => helpRef.current?.showModal()}><Headphones size={20} />{t("Need a hand?", "تحتاج مساعدة؟")}</button>
      </nav>
      <main className={styles.main}>
        <div className={styles.menuScroll}>
          <div className={styles.welcomeLine}><span><span className={styles.sun}>✳</span> {t("A little pause. A better day.", "لحظة هدوء. يوم أجمل.")}</span><span>{t("GOOD COFFEE. GOOD MOOD.", "قهوة رائعة. مزاج رائع.")}</span></div>
          <section className={styles.hero} aria-label={t("Discover Snap Coffee", "اكتشف سناب كوفي")}>
            <div className={styles.heroContent}><span className={styles.heroEyebrow}><span />{t("CRAFTED FOR YOUR EVERYDAY", "صُنعت لترافق يومك")}</span><h1>{t("Your coffee.", "قهوتك.")}<br /><em>{t("Your way.", "على ذوقك.")}</em></h1><p>{t("Freshly brewed. Made for you. Just say the word.", "طازجة دائماً. على ذوقك. فقط قل ما تريد.")}</p><button type="button" className={styles.heroCta} onClick={() => { if (!props.started) props.onStart(); }} disabled={props.pending}><Mic size={16} />{props.pending ? t("Connecting…", "جارٍ الاتصال…") : props.started ? t("Voice demo active", "العرض الصوتي نشط") : t("Let’s talk coffee", "لنتحدث عن القهوة")}<ArrowUpRight size={17} /></button></div>
            <div className={styles.heroVisual}><Image src="/assets/snap-coffee/campaign.webp" alt={t("Snap Coffee signature latte and espresso", "لاتيه وإسبريسو سناب كوفي")} fill sizes="(max-width: 760px) 45vw, 40vw" priority /><span className={styles.heroImageFade} /></div>
            <span className={styles.heroSticker}><Sparkles size={16} /><span>{t("A SIP ABOVE", "رشفة مختلفة")}<b>{t("the everyday", "كل يوم")}</b></span></span>
            <span className={styles.heroCounter}>01 <i /> 01</span>
          </section>
          <section className={styles.menuSection} aria-label={categoryNames ? `${categoryNames.primary}, ${categoryNames.secondary}` : undefined}>
            <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>{t("FIND YOUR FAVORITE", "اكتشف قهوتك المفضلة")}</span><h2>{categoryNames ? <span className={styles.headingNames}><span lang={categoryNames.primaryLang} dir={categoryNames.primaryLang === "ar" ? "rtl" : "ltr"}>{categoryNames.primary}</span><small lang={categoryNames.secondaryLang} dir={categoryNames.secondaryLang === "ar" ? "rtl" : "ltr"}>{categoryNames.secondary}</small></span> : t("Menu", "القائمة")}<span>{screen.visibleItems.length}</span></h2></div><span className={styles.freshTag}><Leaf size={13} />{t("Freshly made, always", "طازجة دائماً")}</span></div>
            {props.notice && <div className={styles.notice} role="status">{props.notice}</div>}
            <div className={styles.productGrid}>
              {screen.visibleItems.map((item, index) => {
                const quantity = props.cart.filter((line) => line.item.id === item.id).reduce((sum, line) => sum + line.qty, 0);
                return <button key={item.id} type="button" className={`${styles.productCard} ${lastAdded === item.id ? styles.justAdded : ""}`} onClick={() => addItem(item.id)} aria-label={`${t("Add", "أضف")} ${namesOf(item).primary}, ${namesOf(item).secondary}`}><span className={`${styles.productStage} ${styles[`tone${index % 4}`]}`}>{index === 1 && <span className={styles.bestseller}><Sparkles size={10} />{t("FAN FAVORITE", "الأكثر طلباً")}</span>}<ProductVisual item={item} /><span className={styles.addProduct}>{lastAdded === item.id ? <Check size={19} /> : <Plus size={19} />}</span>{quantity > 0 && <span className={styles.inBag}>{quantity} {t("in your bag", "في طلبك")}</span>}</span><span className={styles.productBody}><span className={styles.productName} lang={namesOf(item).primaryLang} dir={namesOf(item).primaryLang === "ar" ? "rtl" : "ltr"}>{namesOf(item).primary}</span><span className={styles.productAlt} lang={namesOf(item).secondaryLang} dir={namesOf(item).secondaryLang === "ar" ? "rtl" : "ltr"}>{namesOf(item).secondary}</span><span className={styles.productDescription}>{descriptions[item.id] ?? t("A little something to make your day.", "طازج ولذيذ، على ذوقك.")}</span><span className={styles.productMeta}><strong>{item.displayPrice.replace("SAR ", "")}<small>SAR</small></strong>{item.displayCalories && <span>{item.displayCalories}</span>}</span></span></button>;
              })}
            </div>
            <div className={styles.menuFootnote}><Coffee size={14} />{t("Thoughtfully sourced. Lovingly crafted. Every single cup.", "حبوب مختارة بعناية. قهوة تُصنع بشغف. في كل كوب.")}</div>
          </section>
        </div>
        <section className={`${styles.voicePanel} ${props.started ? styles.voicePanelActive : ""}`} aria-label={t("Voice ordering assistant", "مساعد الطلبات الصوتية")}>
          <button className={styles.voiceOrb} type="button" onClick={screen.toggleVoice} disabled={props.pending} aria-label={props.started ? t("Pause voice demo", "إيقاف العرض الصوتي") : t("Start voice demo", "بدء العرض الصوتي")} aria-pressed={props.started}><span className={styles.pulse} aria-hidden="true" /><Mic size={25} strokeWidth={1.65} /></button>
          <div className={styles.voiceContent}><span className={styles.voiceEyebrow}><i />{props.started ? t("VOICE DEMO ACTIVE", "العرض الصوتي نشط") : t("YOUR COFFEE COMPANION", "رفيق قهوتك")}<span>SNAP AI</span></span><h2 aria-live="polite">{props.started ? screen.latestLine?.text ?? t("I’m here. What sounds good?", "أنا هنا. ماذا تحب أن تطلب؟") : t("Good coffee starts with a conversation.", "القهوة الرائعة تبدأ بمحادثة.")}</h2><p>{props.started ? t("Browse the menu, or tell us what you want.", "تصفح القائمة، أو قل ما تريد.") : t("Tell us what you’re craving. We’ll take it from here.", "قل لنا ما تشتهيه. ونحن نهتم بالباقي.")}</p></div>
          <div className={styles.voiceRight}><Waveform active={props.started} /><button className={styles.voiceAction} type="button" disabled={props.pending} onClick={screen.toggleVoice}>{props.pending ? t("Connecting…", "جارٍ الاتصال…") : props.started ? t("Pause demo", "إيقاف مؤقت") : t("Start voice order", "ابدأ طلباً صوتياً")}<span>{props.started ? <span className={styles.pauseIcon} /> : <ArrowRight size={15} />}</span></button></div>
        </section>
      </main>
      <aside className={styles.cart} aria-label={t("Your order", "طلبك")}>
        <div className={styles.cartHeader}><div className={styles.cartTitle}><h2>{t("Your happy little order", "طلبك بطعم السعادة")}<span>{screen.cartCount}</span></h2><ShoppingBag size={22} strokeWidth={1.5} /></div><p><span className={styles.orderStatus} />{t("Made just for you", "صُنع خصيصاً لك")}<span className={styles.orderNumber}>DRIVE-THRU · 01</span></p></div>
        <div className={styles.cartScroll}>
          <div className={styles.orderIntro}><span><Mic size={13} />{t("Say it. We’ll make it.", "اطلب بصوتك. نجهزه لك.")}</span><span>{t("You can also tap to edit", "يمكنك التعديل باللمس")}</span></div>
          {props.cart.length === 0 ? <div className={styles.empty}><span><ShoppingBag size={36} strokeWidth={1.1} /></span><h3>{t("Good things go in here.", "الأشياء الجميلة تبدأ هنا.")}</h3><p>{t("Start a conversation or tap a favorite to build your order.", "ابدأ محادثة أو اختر ما تحبه لإضافة طلبك.")}</p></div> : <ul className={styles.cartItems}>{props.cart.map((line) => <li key={line.key} className={styles.cartItem}><div className={styles.cartItemTop}><span className={styles.cartThumbnail}><ProductVisual item={line.item} size={72} /></span><div className={styles.cartItemInfo}><h3><span lang={namesOf(line.item).primaryLang} dir={namesOf(line.item).primaryLang === "ar" ? "rtl" : "ltr"}>{namesOf(line.item).primary}</span><small className={styles.cartAlt} lang={namesOf(line.item).secondaryLang} dir={namesOf(line.item).secondaryLang === "ar" ? "rtl" : "ltr"}>{namesOf(line.item).secondary}</small></h3><p>{(line.item.groups ?? []).map((group) => choiceName(group.options.find((option) => option.id === line.selections[group.id]) ?? group.options[0], locale)).join(" · ") || t("Freshly prepared", "طازج حسب الطلب")}</p><div className={styles.cartItemBottom}><div className={styles.quantity}><button type="button" onClick={() => props.onQty(line.key, line.qty - 1)} aria-label={`${t("Remove one", "إزالة واحد")} ${namesOf(line.item).primary}`}><Minus size={12} /></button><span>{line.qty}</span><button type="button" onClick={() => props.onQty(line.key, line.qty + 1)} aria-label={`${t("Add one", "إضافة واحد")} ${namesOf(line.item).primary}`}><Plus size={12} /></button></div><strong>{lineAmount(line).toFixed(2)}<small>SAR</small></strong></div></div></div>{(line.item.groups?.length ?? 0) > 0 && <><button className={styles.customize} type="button" aria-expanded={customizing === line.key} onClick={() => setCustomizing(customizing === line.key ? null : line.key)}>{t("Make it yours", "على ذوقك")}<ChevronDown size={12} /></button>{customizing === line.key && <div className={styles.customizations}>{line.item.groups?.map((group) => <fieldset key={group.id}><legend>{choiceName(group, locale)}</legend>{group.options.map((option) => <button key={option.id} type="button" aria-pressed={line.selections[group.id] === option.id} onClick={() => { props.onSelect(line.key, group.id, option.id); setCustomizing(null); }}>{choiceName(option, locale)}{option.priceDelta > 0 ? ` +${option.priceDelta}` : ""}</button>)}</fieldset>)}</div>}</>}</li>)}</ul>}
          <button className={styles.pairing} type="button" onClick={() => addItem("choc-croissant")}><span className={styles.pairingArt}><Image src="/assets/snap-coffee/choc-croissant.webp" width={48} height={48} alt="" /></span><span><small>{t("BETTER TOGETHER", "ألذ معاً")}</small><b>{t("A sweet little sidekick?", "شيء حلو مع قهوتك؟")}</b><span>{t("Chocolate croissant", "كرواسون شوكولاتة")} · 10 SAR</span></span><span className={styles.pairingPlus}><Plus size={17} /></span></button>
          <div className={styles.coffeePromise}><Leaf size={14} /><span>{t("A little care in every cup.", "الكثير من الاهتمام في كل كوب.")}<small>{t("Quality beans. Freshly brewed. Always.", "حبوب مميزة. تحضير طازج. دائماً.")}</small></span></div>
        </div>
        <div className={styles.checkoutArea}><div className={styles.totals}><p><span>{t("Subtotal", "المجموع الفرعي")}</span><span>{screen.totals.subtotal}</span></p><p><span>{t("VAT", "ضريبة القيمة المضافة")} <small>(15% {t("included", "مشمولة")})</small></span><span>{screen.totals.vat}</span></p><p className={styles.grandTotal}><span>{t("Total", "الإجمالي")}</span><strong>{props.total.toFixed(2)}<small>SAR</small></strong></p></div><button className={styles.checkoutButton} type="button" disabled={props.cart.length === 0 || props.pending} onClick={props.onCheckout}><span><Check size={17} />{t("That’s my order", "هذا هو طلبي")}</span><ArrowRight size={21} /></button><p className={styles.checkoutHint}>{t("Confirm here. Pay at the next window.", "أكد هنا. ادفع عند النافذة التالية.")}</p></div>
      </aside>
      <footer className={styles.footer}><span><i />{t("A fresh take on the drive-thru.", "تجربة جديدة لطلبات السيارة.")}</span><span className={styles.footerDemo}>{t("Voice ordering demo · No microphone required", "عرض طلبات صوتية · لا يتطلب ميكروفوناً")}</span><div><button type="button" disabled={!screen.canEndSession} onClick={resetOrder}><RotateCcw size={12} />{t("Start fresh", "ابدأ من جديد")}</button><span className={styles.powered}><span>{t("POWERED BY", "بدعم من")}</span><Image src="/snaporder-horizontal.png" alt="SnapOrder" width={118} height={22} /></span></div></footer>
      <dialog className={styles.dialog} ref={helpRef} aria-labelledby="snap-help"><button className={styles.closeDialog} type="button" onClick={() => helpRef.current?.close()} aria-label={t("Close help", "إغلاق المساعدة")}><X size={20} /></button><span className={styles.dialogIcon}><Headphones size={30} /></span><span className={styles.eyebrow}>SNAP COFFEE</span><h2 id="snap-help">{t("Hey, we’ve got you.", "نحن هنا لمساعدتك.")}</h2><p>{t("Start the voice demo, or tap anything on the menu. Change quantities and customize drinks in your order. When you’re happy, confirm and head to the next window.", "ابدأ العرض الصوتي، أو اختر من القائمة. عدّل الكميات والمشروبات في طلبك. عندما تكون جاهزاً، أكد الطلب وتوجه للنافذة التالية.")}</p><button className={styles.checkoutButton} onClick={() => helpRef.current?.close()} type="button">{t("Let’s get coffee", "لنطلب القهوة")}<ArrowRight size={18} /></button></dialog>
      <dialog className={`${styles.dialog} ${styles.confirmation}`} ref={checkoutRef} onCancel={(event) => event.preventDefault()} aria-labelledby="snap-confirmed"><span className={styles.confirmIcon}><Check size={38} /></span><span className={styles.eyebrow}>{t("GOOD TASTE. GREAT CHOICE.", "ذوق رائع. اختيار مميز.")}</span><h2 id="snap-confirmed">{t("You’re all set.", "طلبك جاهز للتجهيز.")}</h2><p>{t("Your next stop: a little happiness.", "محطتك التالية: القليل من السعادة.")}</p><div className={styles.pickupTicket}><span>{t("YOUR ORDER", "رقم طلبك")}</span><strong>#101</strong><span>{t("Pay at the next window", "ادفع عند النافذة التالية")}</span><b>{money(props.total)}</b></div><p className={styles.confirmHint}>{t("Please pull forward. We’ll take care of the coffee.", "تفضل إلى النافذة التالية. نحن نهتم بقهوتك.")}</p><button className={styles.checkoutButton} type="button" onClick={resetOrder} autoFocus>{t("Next coffee adventure", "رحلة قهوة جديدة")}<ArrowRight size={19} /></button><small>{t("Demo confirmation · No payment is collected", "تأكيد تجريبي · لم يتم تحصيل أي مبلغ")}</small></dialog>
    </div>
  );
}

