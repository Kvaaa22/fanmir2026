import type { ComponentType, SVGProps } from "react";
import Image from "next/image";
import { HeroSlider } from "@/components/HeroSlider/HeroSlider";
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
  { icon: FireIcon, title: "Всегда низкие цены" },
  { icon: CardIcon, title: "Принимаем любую форму оплаты" },
  { icon: StarIcon, title: "Более 130 видов фанеры" },
  { icon: SnipIcon, title: "Резка по вашим размерам в день покупки" },
  {
    icon: TruckIcon,
    title: "Доставка нашими водителями, доставка грузовым такси",
  },
  { icon: SmileIcon, title: "Делаем скидку постоянным покупателям" },
  {
    icon: GeoIcon,
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
          <HeroSlider />

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

function FireIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_54_818)">
        <path d="M10.543 0.90857C10.4393 0.846657 10.3208 0.813965 10.2001 0.813965C10.0794 0.813965 9.96091 0.846657 9.85726 0.90857C9.77176 0.976309 9.71408 1.07305 9.69512 1.18046C9.67617 1.28788 9.69726 1.39852 9.7544 1.49143C11.863 5.14286 12.3087 10.1143 9.42869 12.8571C8.32062 11.926 7.44092 10.753 6.85726 9.42857C5.79222 10.0201 4.90958 10.8921 4.30514 11.9498C3.70071 13.0076 3.39759 14.2107 3.42869 15.4286C3.47216 16.5022 3.72995 17.5563 4.18687 18.5288C4.64379 19.5013 5.29062 20.3726 6.08929 21.0914C6.88796 21.8102 7.82234 22.362 8.83744 22.7143C9.85254 23.0666 10.9279 23.2123 12.0001 23.1429C17.5201 23.1429 20.383 19.7143 20.5715 15.4286C20.7944 10.2857 17.143 3.96 10.543 0.90857Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.2857 15.4286C16.2857 16.3379 15.9245 17.21 15.2815 17.853C14.6386 18.4959 13.7665 18.8572 12.8572 18.8572" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_54_818">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function CardIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.4286 3.85718H2.57146C1.62469 3.85718 0.857178 4.62469 0.857178 5.57146V18.4286C0.857178 19.3754 1.62469 20.1429 2.57146 20.1429H21.4286C22.3754 20.1429 23.1429 19.3754 23.1429 18.4286V5.57146C23.1429 4.62469 22.3754 3.85718 21.4286 3.85718Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0.857178 9.85718H23.1429" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.2856 15.8572H18.8571" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  );
}

function StarIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_54_831)">
        <path d="M12.8399 1.86859L15.5656 7.37145C15.6276 7.51112 15.7251 7.6321 15.8484 7.72234C15.9718 7.81257 16.1166 7.86891 16.2685 7.88573L22.2856 8.77716C22.4598 8.79955 22.6241 8.87106 22.7592 8.98331C22.8943 9.09557 22.9947 9.24395 23.0486 9.41113C23.1025 9.5783 23.1078 9.75737 23.0637 9.92741C23.0197 10.0975 22.9282 10.2515 22.7999 10.3714L18.4627 14.6743C18.352 14.7777 18.269 14.9072 18.2211 15.0509C18.1732 15.1946 18.162 15.348 18.1885 15.4972L19.2342 21.5486C19.2644 21.7225 19.2453 21.9014 19.1789 22.0649C19.1126 22.2284 19.0016 22.3701 18.8587 22.4737C18.7158 22.5773 18.5467 22.6387 18.3706 22.6509C18.1946 22.6632 18.0186 22.6257 17.8627 22.5429L12.4456 19.68C12.3069 19.6119 12.1544 19.5765 11.9999 19.5765C11.8454 19.5765 11.6929 19.6119 11.5542 19.68L6.13703 22.5429C5.98118 22.6257 5.8052 22.6632 5.62913 22.6509C5.45305 22.6387 5.28395 22.5773 5.14105 22.4737C4.99816 22.3701 4.88721 22.2284 4.82083 22.0649C4.75446 21.9014 4.73532 21.7225 4.7656 21.5486L5.81131 15.4286C5.83781 15.2794 5.8266 15.126 5.7787 14.9823C5.7308 14.8386 5.64772 14.7092 5.53703 14.6057L1.14845 10.3714C1.01862 10.2482 0.927311 10.0899 0.885592 9.91582C0.843874 9.74171 0.853534 9.55925 0.913403 9.39053C0.973272 9.22181 1.08078 9.07407 1.22291 8.9652C1.36503 8.85634 1.53568 8.79102 1.71417 8.77716L7.73131 7.88573C7.88319 7.86891 8.02801 7.81257 8.15134 7.72234C8.27466 7.6321 8.37218 7.51112 8.43417 7.37145L11.1599 1.86859C11.2341 1.70832 11.3526 1.57263 11.5015 1.47753C11.6503 1.38244 11.8233 1.33191 11.9999 1.33191C12.1765 1.33191 12.3494 1.38244 12.4983 1.47753C12.6471 1.57263 12.7657 1.70832 12.8399 1.86859V1.86859Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_54_831">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>

  );
}

function SnipIcon(props: IconProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_54_835)">
        <path d="M12.8401 18H16.2687" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.6973 18H23.1258" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.75439 8.45142L13.6973 14.16" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.71432 8.57146C6.84456 8.57146 8.57146 6.84456 8.57146 4.71432C8.57146 2.58408 6.84456 0.857178 4.71432 0.857178C2.58408 0.857178 0.857178 2.58408 0.857178 4.71432C0.857178 6.84456 2.58408 8.57146 4.71432 8.57146Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.75439 15.5486L23.143 4.37146" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.71432 23.1429C6.84456 23.1429 8.57146 21.416 8.57146 19.2857C8.57146 17.1555 6.84456 15.4286 4.71432 15.4286C2.58408 15.4286 0.857178 17.1555 0.857178 19.2857C0.857178 21.416 2.58408 23.1429 4.71432 23.1429Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_54_835">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>

  );
}

function TruckIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_54_847)">
        <path d="M8.64279 8.64288H3.9285C3.09496 8.64288 2.29557 8.974 1.70617 9.5634C1.11677 10.1528 0.785645 10.9522 0.785645 11.7857V18.0715H3.14279" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.6428 18.0714H21.2143V7.07143C21.2143 6.65466 21.0487 6.25496 20.754 5.96026C20.4593 5.66556 20.0596 5.5 19.6428 5.5H10.2143C9.79748 5.5 9.39778 5.66556 9.10308 5.96026C8.80838 6.25496 8.64282 6.65466 8.64282 7.07143V15.9971" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.42847 18.0714H13.357" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.28568 21.2143C8.02143 21.2143 9.42854 19.8072 9.42854 18.0714C9.42854 16.3357 8.02143 14.9286 6.28568 14.9286C4.54993 14.9286 3.14282 16.3357 3.14282 18.0714C3.14282 19.8072 4.54993 21.2143 6.28568 21.2143Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.5 21.2143C18.2358 21.2143 19.6429 19.8072 19.6429 18.0714C19.6429 16.3357 18.2358 14.9286 16.5 14.9286C14.7643 14.9286 13.3572 16.3357 13.3572 18.0714C13.3572 19.8072 14.7643 21.2143 16.5 21.2143Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_54_847">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>

  );
}

function SmileIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_54_856)">
        <path d="M10.9999 21.2143C16.6412 21.2143 21.2142 16.6413 21.2142 11C21.2142 5.3588 16.6412 0.785706 10.9999 0.785706C5.35874 0.785706 0.785645 5.3588 0.785645 11C0.785645 16.6413 5.35874 21.2143 10.9999 21.2143Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.81421 12.5714C6.59992 15.4 9.74278 17.1286 12.5714 16.3428C14.2999 15.7143 15.7142 14.3 16.1856 12.5714" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.54276 8.56428C7.32579 8.56428 7.1499 8.38839 7.1499 8.17142C7.1499 7.95445 7.32579 7.77856 7.54276 7.77856" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.54297 8.56428C7.75994 8.56428 7.93583 8.38839 7.93583 8.17142C7.93583 7.95445 7.75994 7.77856 7.54297 7.77856" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.4571 8.56428C14.2401 8.56428 14.0642 8.38839 14.0642 8.17142C14.0642 7.95445 14.2401 7.77856 14.4571 7.77856" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.457 8.56428C14.674 8.56428 14.8499 8.38839 14.8499 8.17142C14.8499 7.95445 14.674 7.77856 14.457 7.77856" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_54_856">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
    </svg>

  );
}

function GeoIcon(props: IconProps) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_54_867)">
        <path d="M18.0713 7.85713C18.0713 11.77 10.9999 21.2143 10.9999 21.2143C10.9999 21.2143 3.92847 11.77 3.92847 7.85713C3.92847 5.98167 4.67349 4.18303 5.99964 2.85688C7.32579 1.53073 9.12444 0.785706 10.9999 0.785706C12.8754 0.785706 14.674 1.53073 16.0002 2.85688C17.3263 4.18303 18.0713 5.98167 18.0713 7.85713V7.85713Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 10.2143C12.3018 10.2143 13.3571 9.15896 13.3571 7.85714C13.3571 6.55533 12.3018 5.5 11 5.5C9.69815 5.5 8.64282 6.55533 8.64282 7.85714C8.64282 9.15896 9.69815 10.2143 11 10.2143Z" stroke="#6B4023" strokeWidth="1.71429" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_54_867">
          <rect width="22" height="22" fill="white" />
        </clipPath>
      </defs>
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
