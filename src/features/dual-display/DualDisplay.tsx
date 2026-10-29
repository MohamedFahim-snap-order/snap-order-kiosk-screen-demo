"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Coffee, Leaf, Mic, Minus, Plus, RotateCcw, ShoppingBag, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { DISPLAY_MENU, displayMoney } from "./menu";
import { useDualDisplay } from "./useDualDisplay";
import styles from "./dual-display.module.css";
import scene from "./street-scene.module.css";

type DualDisplayProps = { initialLocale: "en" | "ar"; branchName: string };

function VoiceWave({ active }: { active: boolean }) {
  return (
    <span className={`${styles.voiceWave} ${active ? styles.waveActive : ""}`} aria-hidden="true">
      {[8, 15, 24, 12, 30, 20, 35, 16, 26, 12, 20, 9].map((height, index) => (
        <i key={index} style={{ "--height": `${height}px`, "--delay": `${index * -.13}s` } as CSSProperties} />
      ))}
    </span>
  );
}

function HardwareFooter({ number, label }: { number: string; label: string }) {
  return (
    <div className={`${styles.hardwareFooter} ${scene.enclosureFooter}`} aria-hidden="true">
      <span className={styles.hardwareScrew} />
      <span className={styles.hardwareLabel}>{number}<i />{label}</span>
      {number === "01" && <span className={scene.speakerGrille} />}
      <span className={styles.hardwareBrand}>{number === "01" ? "snaporder" : "SNAP COFFEE"}<span /></span>
      <span className={styles.hardwareScrew} />
    </div>
  );
}

export function DualDisplay({ initialLocale, branchName }: DualDisplayProps) {
  const screen = useDualDisplay(initialLocale);
  const ar = screen.locale === "ar";
  const t = (english: string, arabic: string) => ar ? arabic : english;

  return (
    <main className={`${styles.page} ${scene.page}`} lang={screen.locale}>
      <header className={styles.topbar}>
        <Link href="/kiosk" className={styles.brand} aria-label="Snap Coffee original kiosk">
          <span className={styles.brandIcon}><Coffee size={23} strokeWidth={1.7} /></span>
          <span>snap<small>COFFEE</small></span><sup>®</sup>
        </Link>
        <div className={styles.conceptTitle}>
          <span>{t("THE DRIVE-THRU COLLECTION", "مجموعة تجارب طلبات السيارة")}</span>
          <h1>{t("Menu signage meets voice ordering.", "لوحة القائمة تلتقي بالطلب الصوتي.")}</h1>
        </div>
        <div className={styles.topActions}>
          <span className={styles.conceptBadge}><i />{t("CONCEPT 02", "التصميم ٠٢")}</span>
          <Link href="/kiosk" className={styles.backLink}><ArrowUpRight size={15} /><span>{t("Original kiosk", "التصميم الأصلي")}</span></Link>
        </div>
      </header>

      <div className={scene.streetScene}>
        <div className={scene.backdrop} aria-hidden="true"><Image src="/assets/dual-screen/drive-thru-street.webp" alt="" fill sizes="100vw" priority /></div>
        <div className={scene.locationTag}><span />{t("SNAP COFFEE · DRIVE-THRU", "سناب كوفي · طلبات السيارة")}</div>
        <div className={scene.installation} aria-label={t("Outdoor drive-through: voice ordering beside menu signage", "مسار خارجي: الطلب الصوتي بجانب لوحة القائمة")}>
        <section className={`${styles.monitor} ${scene.enclosure}`} aria-label={t("SnapOrder voice-ordering screen", "شاشة سناب أوردر للطلب الصوتي")}>
          <div className={scene.enclosureHeader}><span className={scene.unitNumber}>01</span><span>{t("ORDER HERE", "اطلب هنا")}<small>{t("VOICE ORDERING", "الطلب الصوتي")}</small></span><Mic size={17} /></div>
          <div className={`${styles.display} ${styles.orderDisplay}`} dir={ar ? "rtl" : "ltr"}>
            <div className={styles.orderArea}>
              <header className={styles.orderHeader}>
                <div><span className={styles.eyebrow}>{t("SNAPORDER · VOICE ORDERING", "سناب أوردر · الطلب الصوتي")}</span><h2>{t("Your order", "طلبك")}<span>{screen.itemCount}</span></h2></div>
                <span className={styles.orderId}><span>{t("ORDER", "طلب")}</span>#{screen.orderNumber}</span>
              </header>

              {screen.confirmed ? (
                <div className={styles.confirmation} role="status">
                  <span className={styles.confirmationIcon}><Check size={31} strokeWidth={1.7} /></span>
                  <span className={styles.eyebrow}>{t("A LITTLE HAPPINESS, ON ITS WAY", "لحظة سعادة، في الطريق إليك")}</span>
                  <h3>{t("Good call.", "اختيار رائع.")}<br /><em>{t("Great coffee.", "قهوة أروع.")}</em></h3>
                  <p>{t("Pull forward. We’ll take care of the rest.", "تفضل إلى الأمام. نحن نهتم بالباقي.")}</p>
                  <div className={styles.confirmationTotal}><span>{t("PAY AT THE NEXT WINDOW", "ادفع عند النافذة التالية")}</span><strong>{displayMoney(screen.total)} <small>SAR</small></strong></div>
                  <button className={styles.confirmButton} type="button" onClick={screen.startFresh}>{t("Next customer", "العميل التالي")}<ArrowRight size={16} /></button>
                </div>
              ) : (
                <>
                  <section className={`${styles.voiceStation} ${screen.voiceActive ? styles.voiceStationActive : ""}`} aria-label={t("Voice demo assistant", "مساعد العرض الصوتي")}>
                    <button type="button" className={styles.micButton} onClick={screen.toggleVoice} aria-pressed={screen.voiceActive} aria-label={screen.voiceActive ? t("Pause voice demo", "إيقاف العرض الصوتي") : t("Start voice demo", "بدء العرض الصوتي")}><span className={styles.pulse} aria-hidden="true" /><Mic size={21} strokeWidth={1.7} /></button>
                    <div className={styles.voiceCopy}>
                      <span className={styles.voiceState}><i />{screen.voiceActive ? t("VOICE DEMO · LISTENING", "العرض الصوتي · نستمع") : t("YOUR COFFEE COMPANION", "رفيق قهوتك")}</span>
                      <p aria-live="polite">{screen.reply ? (ar ? screen.reply.ar : screen.reply.en) : screen.voiceActive ? t("Go ahead. What sounds good?", "تفضل. ماذا تحب أن تطلب؟") : t("A great order starts with “hello”.", "الطلب الرائع يبدأ بكلمة «مرحباً».")}</p>
                      {screen.voiceActive && <div className={styles.samplePhrases}><button type="button" onClick={() => screen.addProduct("iced-latte")}>{t('“An iced latte”', '«آيس لاتيه»')}<Plus size={10} /></button><button type="button" onClick={() => screen.addProduct("choc-croissant")}>{t('“Something sweet”', '«شيء حلو»')}<Plus size={10} /></button></div>}
                    </div>
                    <VoiceWave active={screen.voiceActive} />
                  </section>

                  <div className={styles.orderList} aria-label={t("Order items", "عناصر الطلب")}>
                    {screen.lines.length === 0 ? (
                      <div className={styles.emptyOrder}><ShoppingBag size={29} strokeWidth={1.15} /><h3>{t("Room for something good.", "هناك مكان لشيء جميل.")}</h3><p>{t("Start the voice demo and try a sample phrase to order.", "ابدأ العرض الصوتي وجرب عبارة نموذجية للطلب.")}</p></div>
                    ) : screen.visibleLines.map((line) => (
                      <div key={line.productId} className={`${styles.orderLine} ${line.productId === screen.lastAdded ? styles.updatedLine : ""}`}>
                        <span className={styles.lineImage}><Image src={line.product.image} fill sizes="60px" alt="" /></span>
                        <div className={styles.lineDetails}><h3>{ar ? line.product.nameAr : line.product.name}</h3><span>{ar ? line.product.descriptionAr : line.product.description}</span><div className={styles.quantity}><button type="button" onClick={() => screen.changeQuantity(line.productId, -1)} aria-label={`${t("Remove one", "إزالة واحد")} ${line.product.name}`}><Minus size={10} /></button><span>{line.quantity}</span><button type="button" onClick={() => screen.changeQuantity(line.productId, 1)} aria-label={`${t("Add one", "إضافة واحد")} ${line.product.name}`}><Plus size={10} /></button></div></div>
                        <strong className={styles.linePrice}>{displayMoney(line.product.price * line.quantity)}<small>SAR</small></strong>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderPagination}>
                    <span><span className={styles.liveDot} />{t("Made fresh. Made for you.", "طازج دائماً. صُنع لأجلك.")}</span>
                    {screen.pageCount > 1 ? <div className={styles.pageControls}><button type="button" disabled={screen.currentPage === 0} onClick={() => screen.setOrderPage(screen.currentPage - 1)} aria-label={t("Previous order items", "عناصر الطلب السابقة")}><ChevronLeft size={13} /></button><span aria-live="polite">{screen.currentPage + 1} / {screen.pageCount}</span><button type="button" disabled={screen.currentPage === screen.pageCount - 1} onClick={() => screen.setOrderPage(screen.currentPage + 1)} aria-label={t("Next order items", "عناصر الطلب التالية")}><ChevronRight size={13} /></button></div> : <span className={styles.itemCount}>{screen.itemCount} {t("ITEMS", "عناصر")}</span>}
                  </div>

                  <div className={styles.orderSummary}>
                    <div className={styles.summaryNumbers}><span>{t("Your total", "الإجمالي")}<small>{t("Including 15% VAT", "شامل ضريبة القيمة المضافة ١٥٪")} · {displayMoney(screen.vat)} SAR</small></span><strong>{displayMoney(screen.total)}<small>SAR</small></strong></div>
                    <button type="button" className={styles.confirmButton} disabled={screen.itemCount === 0} onClick={screen.confirmOrder}><span><Check size={15} />{t("That’s everything", "هذا كل شيء")}</span><span>{t("Confirm order", "تأكيد الطلب")}<ArrowRight size={16} /></span></button>
                  </div>
                </>
              )}
            </div>

            <section className={styles.promoBanner} aria-label={t("Coffee and pastry campaign", "عرض القهوة والمخبوزات")}>
              <div className={styles.bannerArt}><Image src="/assets/dual-screen/coffee-pair.webp" fill sizes="45vw" alt={t("Snap Coffee latte with a chocolate croissant", "لاتيه سناب كوفي مع كرواسون الشوكولاتة")} priority /></div>
              <div className={styles.bannerCopy}><span><Sparkles size={10} />{t("GOOD THINGS COME IN PAIRS", "الأشياء الجميلة تأتي معاً")}</span><h2>{t("Better", "ألذ")}<br /><em>{t("together.", "معاً.")}</em></h2><button type="button" disabled={screen.confirmed} onClick={() => screen.addProduct("choc-croissant")}>{t("Add a little sweet", "أضف شيئاً حلواً")}<span>10 SAR <Plus size={12} /></span></button></div>
              <span className={styles.bannerSeal}>freshly<br /><b>baked</b><span>✳</span></span>
            </section>
          </div>
          <HardwareFooter number="01" label="VOICE ORDERING" />
        </section>

        <div className={scene.airGap} aria-hidden="true" />

        <section className={`${styles.monitor} ${scene.enclosure}`} aria-label={t("Static menu signage board", "لوحة عرض القائمة الثابتة")}>
          <div className={scene.enclosureHeader}><span className={scene.unitNumber}>02</span><span>{t("THE MENU", "القائمة")}<small>{t("FIND YOUR FAVORITE", "اكتشف ما تحبه")}</small></span><Coffee size={19} /></div>
          <div className={`${styles.display} ${styles.menuDisplay}`} dir={ar ? "rtl" : "ltr"}>
            <header className={styles.menuHeader}>
              <div className={styles.menuBrand}>snap<sup>®</sup><span>COFFEE</span></div>
              <div><span>{t("FRESHLY BREWED. HAPPILY SERVED.", "قهوة طازجة. بكل حب.")}</span><h2>{t("Find your", "اكتشف")}<em>{t(" kind of good.", " مذاقك المفضل.")}</em></h2></div>
              <span className={styles.menuSun} aria-hidden="true">✳</span>
            </header>

            {DISPLAY_MENU.map((section, index) => (
              <section key={section.id} className={styles.menuSection} aria-label={ar ? section.titleAr : section.title}>
                <header className={styles.sectionHeader}><h3><span>0{index + 1}</span>{ar ? section.titleAr : section.title}</h3><span>{ar ? section.subtitleAr : section.subtitle}</span></header>
                <div className={styles.menuProducts}>
                  {section.products.map((product) => {
                    return (
                      <article key={product.id} className={styles.menuProduct} aria-label={ar ? product.nameAr : product.name}>
                        <span className={styles.menuProductArt}><Image src={product.image} fill sizes="12vw" alt="" />{product.id === "signature" && <span className={styles.favorite}>{t("THE USUAL", "المفضل")}</span>}</span>
                        <span className={styles.menuProductName}>{ar ? product.nameAr : product.name}</span>
                        <span className={styles.menuProductPrice}>{product.price}<small>SAR</small><span>{t("Made to order", "حسب طلبك")}</span></span>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}

            <footer className={styles.menuFooter}><span><Leaf size={11} />{t("A little care in every cup.", "الكثير من الاهتمام في كل كوب.")}</span><span>{t("ALL PRICES IN SAR · VAT INCLUDED", "الأسعار بالريال · شاملة الضريبة")}</span></footer>
          </div>
          <HardwareFooter number="02" label="MENU SIGNAGE" />
        </section>

        <div className={`${scene.post} ${scene.leftPost}`} aria-hidden="true"><i /><span /></div><div className={`${scene.post} ${scene.rightPost}`} aria-hidden="true"><i /><span /></div>
        </div>
        <div className={scene.laneMark} aria-hidden="true"><ArrowRight size={29} /><span>ORDER POINT</span></div>
        <div className={scene.sceneCaption}><span>{t("01 / SNAPORDER SOLUTION", "٠١ / نظام سناب أوردر")}</span><i /><span>{t("02 / MENU SIGNAGE", "٠٢ / لوحة القائمة")}</span></div>
      </div>

      <footer className={styles.pageFooter}>
        <span className={styles.installationLabel}><span className={styles.liveDot} />{branchName}<i />{t("DUAL-SCREEN DRIVE-THRU", "مسار بشاشتين")}</span>
        <span className={styles.demoNote}>{t("Voice demo on the left · Menu signage on the right", "عرض صوتي على اليسار · لوحة القائمة على اليمين")}</span>
        <button type="button" onClick={screen.startFresh} className={styles.resetButton}><RotateCcw size={12} />{t("Reset preview", "إعادة العرض")}</button>
      </footer>
    </main>
  );
}
