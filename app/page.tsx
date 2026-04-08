import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type IconProps = SVGProps<SVGSVGElement>;

type BenefitItem = {
  icon: ComponentType<IconProps>;
  title: string;
};

type OfferItem = {
  title: string;
  patternClassName: string;
};

const benefits: BenefitItem[] = [
  { icon: WalletIcon, title: "Всегда низкие цены" },
  { icon: CardIcon, title: "Принимаем любую форму оплаты" },
  { icon: BadgeIcon, title: "Более 130 видов фанеры" },
  { icon: SawIcon, title: "Резка по вашим размерам в день покупки" },
  {
    icon: TruckIcon,
    title: "Доставка нашими водителями, доставка грузовым такси",
  },
  { icon: PercentIcon, title: "Делаем скидку постоянным покупателям" },
  {
    icon: OfficeIcon,
    title: "Офис продаж и склад продукции находятся в одном месте",
  },
];

const offers: OfferItem[] = [
  { title: "OSB-3(ОСП)", patternClassName: "offerPatternOsb" },
  { title: "Фанера хвойная", patternClassName: "offerPatternPine" },
  { title: "Распил", patternClassName: "offerPatternSaw" },
  { title: "Фанера березовая", patternClassName: "offerPatternBirch" },
  {
    title: "Ламинированная фанера",
    patternClassName: "offerPatternLaminated",
  },
  { title: "ДСП", patternClassName: "offerPatternChipboard" },
  { title: "ДВП", patternClassName: "offerPatternFiberboard" },
  {
    title: "Изделия из фанеры",
    patternClassName: "offerPatternProducts",
  },
  { title: "PLYDEX", patternClassName: "offerPatternPlydex" },
  {
    title: "Строительная фанера",
    patternClassName: "offerPatternConstruction",
  },
];

export default function Home() {
  return (
    <>

      <section className={styles.hero} id="hero">


        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <button
              aria-label="Предыдущий слайд"
              className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
              type="button"
            >
              <ArrowIcon direction="left" />
            </button>

            <div className={styles.heroCopy}>
              <h1 className={styles.heroTitle}>Резка по вашим размерам</h1>

              <div className={styles.heroBadges}>
                <span className={styles.heroBadge}>оперативно</span>
                <span
                  className={`${styles.heroBadge} ${styles.heroBadgeDark}`}
                >
                  недорого
                </span>
              </div>

              <p className={styles.heroLead}>
                Раскрой в день заказа на форматно-раскроечном станке
              </p>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.heroVisualMain}>
                <Image
                  src="/img/hero/cutting.webp"
                  alt="Форматный раскрой фанеры"
                  fill
                  priority
                  sizes="(max-width: 1366px) 48vw, 640px"
                />
              </div>

              <div className={styles.heroVisualAccent}>
                <Image
                  src="/img/hero/wood-circle.webp"
                  alt=""
                  fill
                  sizes="180px"
                />
              </div>
            </div>

            <button
              aria-label="Следующий слайд"
              className={`${styles.heroArrow} ${styles.heroArrowRight}`}
              type="button"
            >
              <ArrowIcon direction="right" />
            </button>
          </div>

          <div className={styles.partnersBlock}>
            <span className={styles.partnersLabel}>Наши партнеры</span>

            <div className={styles.partnersPanel}>
              <div className={styles.partnerLogoWide}>
                <Image
                  src="/img/hero/ilim.svg"
                  alt="ILIM Timber"
                  width={289}
                  height={31}
                />
              </div>

              <div className={styles.partnerLogoRound}>
                <Image
                  src="/img/hero/bff.svg"
                  alt="Байкальский фанерный комбинат"
                  width={65}
                  height={63}
                />
              </div>

              <div className={styles.partnerLogoMedium}>
                <Image
                  src="/img/hero/bfk.svg"
                  alt="Бийский фанерный комбинат"
                  width={215}
                  height={39}
                />
              </div>

              <div className={styles.partnerLogoWide}>
                <Image
                  src="/img/hero/sveza.svg"
                  alt="Свеза"
                  width={178}
                  height={39}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className="container">
          <h2 className="section-title">Наши преимущества</h2>

          <div className={styles.benefitsGrid}>
            <div className={styles.benefitsCard}>
              <ul className={styles.benefitsList}>
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;

                  return (
                    <li className={styles.benefitsItem} key={benefit.title}>
                      <span className={styles.benefitsIcon}>
                        <Icon />
                      </span>
                      <span>{benefit.title}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className={styles.advantagesLogoWrap}>
              <div className={styles.advantagesLogoCircle}>
                <Image
                  src="/img/logoFull.png"
                  alt="Фанерный мир"
                  width={276}
                  height={218}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.offersSection} id="offers">
        <div className="container">
          <h2 className="section-title">Что мы предлагаем</h2>

          <div className={styles.offersGrid}>
            {offers.map((offer) => (
              <article className={styles.offerCard} key={offer.title}>
                <div
                  className={`${styles.offerImage} ${styles[offer.patternClassName]
                    }`}
                />
                <div className={styles.offerCaption}>{offer.title}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.aboutSection} id="about">
        <div className="container">
          <h2 className="section-title">Коротко о фанере</h2>

          <div className={styles.aboutGrid}>
            <article className={styles.aboutCard}>
              <p className="section-copy">
                В нашем каталоге все позиции соответствуют ГОСТ, а значит, при
                заказе товара вы можете быть уверены в его качестве. В
                магазине &quot;Фанерный мир&quot; можно купить фанеру по
                выгодной цене. Организуем доставку по Красноярску и его
                окрестностям.
              </p>

              <p className="section-copy">
                В продаже есть <span>березовая</span> и <span>хвойная</span>{" "}
                фанера толщиной от 3 до 40 мм.
              </p>

              <div className={styles.aboutGroup}>
                <h3 className={styles.aboutSubtitle}>Основные разновидности:</h3>

                <ul className={styles.aboutList}>
                  <li>
                    <span>Шлифованная и нешлифованная</span> (маркировка Ш/НШ).
                    Для черновых работ предпочтительнее нешлифованная, для
                    декоративной отделки — шлифованная с одной или обеих
                    сторон.
                  </li>
                  <li>
                    <span>Строительная</span>. Преимущественно сорт фанеры 4/4
                    — используется для изготовления вспомогательных и
                    временных конструкций.
                  </li>
                  <li>
                    <span>Ламинированная</span>. С гладкой или сетчатой
                    поверхностью. За счет пленки она прочнее, лучше переносит
                    механическое воздействие и контакт с водой.
                  </li>
                </ul>
              </div>

              <p className="section-copy">
                Ассортимент нашего магазина позволяет подобрать листы фанеры
                для любых целей: возведения опалубки, несущих конструкций,
                перекрытий, перегородок, мебельного производства. Наиболее
                популярные размеры — 1525x1525 мм, 2440x1220 мм. Под заказ
                доступны другие варианты.
              </p>
            </article>

            <div className={styles.aboutImage} />
          </div>

          <p className={`${styles.aboutNote} section-copy`}>
            Мы работаем для того, чтобы вы могли купить фанеру в Красноярске
            быстро, без задержек. Возможен самовывоз со склада, доставка
            нашим экспедитором или грузовым такси с возможностью слежения за
            перевозкой, транспортировка до терминала логистической компании.
            Возможен наличный и безналичный расчет.
          </p>
        </div>
      </section>

      <section className={styles.contactsSection} id="contacts">
        <div className="container">
          <h2 className="section-title">Контакты</h2>

          <div className={styles.contactsGrid}>
            <article className={styles.contactsCard}>
              <ul className={styles.contactsList}>
                <li className={styles.contactsItem}>
                  <span className={styles.contactsIcon}>
                    <PinIcon />
                  </span>
                  <div>
                    <strong>г. Красноярск,</strong>
                    <span>ул. Калинина 169, офис 1-05</span>
                  </div>
                </li>

                <li className={styles.contactsItem}>
                  <span className={styles.contactsIcon}>
                    <PhoneIcon />
                  </span>
                  <div>
                    <a href="tel:+73912683233">+7 (391) 268-32-33</a>
                    <a href="tel:+73912683223">+7 (391) 268-32-23</a>
                  </div>
                </li>

                <li className={styles.contactsItem}>
                  <span className={styles.contactsIcon}>
                    <ClockIcon />
                  </span>
                  <div>
                    <strong>Мы работаем</strong>
                    <span>Пн - Пт 9:00 - 17:00</span>
                  </div>
                </li>

                <li className={styles.contactsItem}>
                  <span className={styles.contactsIcon}>
                    <MailIcon />
                  </span>
                  <div>
                    <a href="mailto:fanmir24@yandex.ru">fanmir24@yandex.ru</a>
                  </div>
                </li>
              </ul>

              <div className={styles.contactsCompany}>
                <Image
                  src="/img/logoFull.png"
                  alt="Фанерный мир"
                  width={62}
                  height={49}
                />
                <div>
                  <span>ООО ТД</span>
                  <strong>&quot;Фанерный мир&quot;</strong>
                </div>
              </div>
            </article>

            <div className={styles.mapCard}>
              <div className={styles.mapCanvas}>
                <span className={styles.mapRiver} />
                <span
                  className={`${styles.mapRoad} ${styles.mapRoadPrimary}`}
                />
                <span
                  className={`${styles.mapRoad} ${styles.mapRoadSecondary}`}
                />
                <span
                  className={`${styles.mapRoad} ${styles.mapRoadTertiary}`}
                />
                <span
                  className={`${styles.mapRoad} ${styles.mapRoadCross}`}
                />
                <span className={styles.mapMarker}>
                  <span />
                </span>
                <div className={styles.mapControls}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}

function ArrowIcon({
  direction,
}: {
  direction: "left" | "right";
}) {
  return (
    <svg
      aria-hidden="true"
      className={direction === "left" ? styles.arrowLeft : undefined}
      fill="none"
      height="26"
      viewBox="0 0 26 26"
      width="26"
    >
      <path
        d="M16.5 4.5L8.5 13L16.5 21.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function WalletIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M5 8.5h13.5a1.5 1.5 0 0 1 1.5 1.5v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a1.5 1.5 0 0 1 1-1.414L16 5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M15.5 13h4.5v3h-4.5a1.5 1.5 0 1 1 0-3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CardIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <rect
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="17"
        x="3.5"
        y="5.5"
      />
      <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7 15.5h3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function BadgeIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 4.5 14.1 8l3.95.7-2.77 2.86.57 4.02L12 13.8 8.15 15.6l.57-4.02L5.95 8.7 9.9 8 12 4.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SawIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 5.5v13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M7.5 6.5 12 11l4.5-4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M6 17.5h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TruckIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M3.5 7.5h10v7h-10v-7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M13.5 10.5h3.1l2.4 2.3v1.7h-1.2"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM18.5 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PercentIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M7.5 16.5 16.5 7.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <circle
        cx="8"
        cy="8"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="16"
        cy="16"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function OfficeIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M5.5 5.5h13v13h-13v-13Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M9 18.5v-4h6v4"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 9h1M12 9h1M15.5 9h1M8.5 12h1M12 12h1M15.5 12h1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PinIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 20c4.5-4.3 6.75-7.5 6.75-10.1A6.75 6.75 0 0 0 5.25 9.9C5.25 12.5 7.5 15.7 12 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PhoneIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M7.8 5.5c.4-.4 1-.5 1.5-.2l1.8 1c.6.3.8 1 .5 1.6l-.9 1.9c1.1 2.2 2.8 3.9 5 5l1.9-.9c.6-.3 1.3-.1 1.6.5l1 1.8c.3.5.2 1.1-.2 1.5l-1.3 1.3c-.5.5-1.3.8-2 .6-2.3-.6-4.4-1.8-6.3-3.7-1.9-1.9-3.1-4-3.7-6.3-.2-.7.1-1.5.6-2l1.5-1.1Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ClockIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 8v4l2.5 2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MailIcon(props: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" {...props}>
      <rect
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
        width="17"
        x="3.5"
        y="5.5"
      />
      <path
        d="m5 8 7 5 7-5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
