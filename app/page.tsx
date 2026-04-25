import type { SVGProps } from "react";
import Image from "next/image";
import { HeroSlider } from "@/components/HeroSlider/HeroSlider";
import styles from "./page.module.css";

type IconProps = SVGProps<SVGSVGElement>;

type BenefitItem = {
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  title: string;
};

type OfferItem = {
  title: string;
  patternClassName: string;
};

const benefits: BenefitItem[] = [
  {
    iconSrc: "/img/advantages/icons/Fire1.svg",
    iconWidth: 24,
    iconHeight: 24,
    title: "Всегда низкие цены",
  },
  {
    iconSrc: "/img/advantages/icons/Card2.svg",
    iconWidth: 24,
    iconHeight: 24,
    title: "Принимаем любую форму оплаты",
  },
  {
    iconSrc: "/img/advantages/icons/Star3.svg",
    iconWidth: 24,
    iconHeight: 24,
    title: "Более 130 видов фанеры",
  },
  {
    iconSrc: "/img/advantages/icons/snip4.svg",
    iconWidth: 24,
    iconHeight: 24,
    title: "Резка по вашим размерам в день покупки",
  },
  {
    iconSrc: "/img/advantages/icons/Truck5.svg",
    iconWidth: 22,
    iconHeight: 22,
    title: "Доставка нашими водителями, доставка грузовым такси",
  },
  {
    iconSrc: "/img/advantages/icons/smile6.svg",
    iconWidth: 22,
    iconHeight: 22,
    title: "Делаем скидку постоянным покупателям",
  },
  {
    iconSrc: "/img/advantages/icons/geo7.svg",
    iconWidth: 22,
    iconHeight: 22,
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
  { title: "PLYDEX", patternClassName: "offerPatternPlydex" },
  {
    title: "Строительная фанера",
    patternClassName: "offerPatternConstruction",
  },
];

export default function Home() {
  const offerRows = [offers.slice(0, 5), offers.slice(5)];

  return (
    <>

      <section className={styles.hero} id="hero">


        <div className={`container ${styles.heroContainer}`}>
          <HeroSlider />

          <div className={`${styles.partnersBlock} ${styles.partnersBlockDesktop}`}>
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
                  src="/img/hero/bff.png"
                  alt="Байкальский фанерный комбинат"
                  width={65}
                  height={63}
                />
              </div>

              <div className={styles.partnerLogoMedium}>
                <Image
                  src="/img/hero/bfk.png"
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
          <div className={styles.partnersMobileSection}>
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
                    src="/img/hero/bff.png"
                    alt="Байкальский фанерный комбинат"
                    width={65}
                    height={63}
                  />
                </div>

                <div className={styles.partnerLogoMedium}>
                  <Image
                    src="/img/hero/bfk.png"
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
        </div>
      </section>

      <section className={styles.benefitsSection}>
        <div className="container">
          <div className={styles.benefitsStage}>
            <div className={styles.benefitsGrid}>
              <div className={styles.benefitsContentColumn}>
                <h2 className={`section-title ${styles.benefitsTitle}`}>Наши преимущества</h2>

                <div className={styles.benefitsCard}>
                  <ul className={styles.benefitsList}>
                    {benefits.map((benefit) => (
                      <li className={styles.benefitsItem} key={benefit.title}>
                        <span className={styles.benefitsIcon}>
                          <Image
                            src={benefit.iconSrc}
                            alt=""
                            width={benefit.iconWidth}
                            height={benefit.iconHeight}
                            className={styles.benefitsIconImage}
                          />
                        </span>
                        <span className={styles.benefitsText}>{benefit.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={styles.advantagesLogoWrap}>
                <Image
                  src="/img/advantages/ohreCircule.svg"
                  alt=""
                  width={500}
                  height={490}
                  className={styles.advantagesLogoCircle}
                />
                <Image
                  src="/img/advantages/aboutLogo.svg"
                  alt="Фанерный мир"
                  width={401}
                  height={315}
                  className={styles.advantagesLogoImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.partnersAfterBenefitsMobileSection}>
        <div className="container">
          <div className={styles.partnersAfterBenefitsMobileInner}>
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
                  src="/img/hero/bff.png"
                  alt="Байкальский фанерный комбинат"
                  width={65}
                  height={63}
                />
              </div>

              <div className={styles.partnerLogoMedium}>
                <Image
                  src="/img/hero/bfk.png"
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

      <section className={styles.offersSection} id="offers">
        <div className="container">
          <h2 className="section-title">Что мы предлагаем</h2>

          <div className={styles.offersGrid}>
            {offerRows.map((row, rowIndex) => (
              <div className={styles.offersRow} key={`offers-row-${rowIndex}`}>
                {row.map((offer) => (
                  <article className={styles.offerCard} key={offer.title}>
                    <div
                      className={`${styles.offerImage} ${styles[offer.patternClassName]
                        }`}
                    />
                    <div className={styles.offerCaption}>{offer.title}</div>
                  </article>
                ))}
              </div>
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
                фанера толщиной от <span className={styles.aboutStrong}>3</span> до{" "}
                <span className={styles.aboutStrong}>40 мм</span>.
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

            <div className={styles.aboutImage} aria-hidden="true" />
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
