import Image from "next/image";
import Link from "next/link";
import { HeroSlider } from "@/components/HeroSlider/HeroSlider";
import { catalogOfferHrefs } from "@/lib/catalog/filterLinks";
import styles from "./page.module.css";
import YandexMap from '@/components/YandexMap/YandexMap';

type BenefitItem = {
  iconSrc: string;
  iconWidth: number;
  iconHeight: number;
  title: string;
};

type OfferItem = {
  href?: string;
  title: string;
  patternClassName: string;
};

type PartnerItem = {
  alt: string;
  height: number;
  href: string;
  logoClassName: string;
  src: string;
  width: number;
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
  { href: catalogOfferHrefs.osb, title: "OSB-3(ОСП)", patternClassName: "offerPatternOsb" },
  { href: catalogOfferHrefs.conifer, title: "Фанера хвойная", patternClassName: "offerPatternPine" },
  { title: "Распил", patternClassName: "offerPatternSaw" },
  { href: catalogOfferHrefs.birch, title: "Фанера березовая", patternClassName: "offerPatternBirch" },
  {
    href: catalogOfferHrefs.laminated,
    title: "Ламинированная фанера",
    patternClassName: "offerPatternLaminated",
  },
  { href: catalogOfferHrefs.dsp, title: "ДСП", patternClassName: "offerPatternChipboard" },
  { href: catalogOfferHrefs.dvp, title: "ДВП", patternClassName: "offerPatternFiberboard" },
  { href: catalogOfferHrefs.plydex, title: "PLYDEX", patternClassName: "offerPatternPlydex" },
  {
    href: catalogOfferHrefs.construction,
    title: "Строительная фанера",
    patternClassName: "offerPatternConstruction",
  },
];

const partners: PartnerItem[] = [
  {
    alt: "ILIM Timber",
    height: 31,
    href: "https://ilimtimber.ru",
    logoClassName: styles.partnerLogoWide,
    src: "/img/hero/ilim.svg",
    width: 289,
  },
  {
    alt: "Бийская мебельная фабрика",
    height: 63,
    href: "http://www.radomebel.ru/",
    logoClassName: styles.partnerLogoRound,
    src: "/img/hero/bff.png",
    width: 65,
  },
  {
    alt: "Бийский фанерный комбинат",
    height: 39,
    href: "http://www.fanera-biysk.ru/",
    logoClassName: styles.partnerLogoMedium,
    src: "/img/hero/bfk.png",
    width: 215,
  },
  {
    alt: "Свеза",
    height: 39,
    href: "https://www.sveza.com/",
    logoClassName: styles.partnerLogoWide,
    src: "/img/hero/sveza.svg",
    width: 178,
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

            <PartnersPanel />
          </div>
          <div className={styles.partnersMobileSection}>
            <div className={styles.partnersBlock}>
              <span className={styles.partnersLabel}>Наши партнеры</span>

              <PartnersPanel />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.benefitsSection} id="delivery">
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

      <section className={styles.offersSection} id="offers">
        <div className="container">
          <h2 className="section-title">Что мы предлагаем</h2>

          <div className={styles.offersGrid}>
            {offerRows.map((row, rowIndex) => (
              <div className={styles.offersRow} key={`offers-row-${rowIndex}`}>
                {row.map((offer) => {
                  const offerContent = (
                    <>
                      <div
                        className={`${styles.offerImage} ${
                          styles[offer.patternClassName]
                        }`}
                      />
                      <div className={styles.offerCaption}>{offer.title}</div>
                    </>
                  );

                  return offer.href ? (
                    <Link
                      className={styles.offerCard}
                      href={offer.href}
                      key={offer.title}
                    >
                      {offerContent}
                    </Link>
                  ) : (
                    <article
                      className={styles.offerCard}
                      id={
                        offer.patternClassName === "offerPatternSaw"
                          ? "cutting"
                          : undefined
                      }
                      key={offer.title}
                    >
                      {offerContent}
                    </article>
                  );
                })}
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

      <section className={styles.partnersAfterBenefitsMobileSection}>
        <div className="container">
          <div className={`${styles.partnersAfterBenefitsMobileInner} ${styles.partnersBlock}`}>
            <span className={styles.partnersLabel}>Наши партнеры</span>

            <PartnersPanel />
          </div>
        </div>
      </section>

      <section className={styles.contactsSection} id="contacts">
        <div className="container">
          <h2 className={`section-title ${styles.contactsTitle}`}>Контакты</h2>

          <div className={styles.contactsGrid}>
            <article className={styles.contactsCard}>
              <ul className={styles.contactsList}>
                <li className={styles.contactsItem}>
                  <span className={styles.contactsIcon}>
                    <Image
                      src="/img/contact/geo-contact.svg"
                      alt=""
                      width={32}
                      height={46}
                      className={`${styles.contactsIconImage} ${styles.contactsIconGeo}`}
                    />
                  </span>
                  <div className={styles.contactsAddress}>
                    <strong>г. Красноярск,</strong>
                    <span>ул. Калинина 169, офис 1-05</span>
                  </div>
                </li>

                <li className={styles.contactsItem}>
                  <span className={styles.contactsIcon}>
                    <Image
                      src="/img/contact/phone-contact.svg"
                      alt=""
                      width={32}
                      height={32}
                      className={styles.contactsIconImage}
                    />
                  </span>
                  <div className={styles.contactsPhones}>
                    <a href="tel:+73912683233">+7 (391) 268-32-33</a>
                    <a href="tel:+73912683223">+7 (391) 268-32-23</a>
                  </div>
                </li>

                <li className={styles.contactsItem}>
                  <span className={styles.contactsIcon}>
                    <Image
                      src="/img/contact/clock-phone.svg"
                      alt=""
                      width={30}
                      height={30}
                      className={styles.contactsIconImage}
                    />
                  </span>
                  <div className={styles.contactsHours}>
                    <strong>Мы работаем</strong>
                    <span>Пн - Пт 9:00 - 17:00</span>
                  </div>
                </li>

                <li className={styles.contactsItem}>
                  <span className={styles.contactsIcon}>
                    <Image
                      src="/img/contact/mail-contact.svg"
                      alt=""
                      width={30}
                      height={30}
                      className={styles.contactsIconImage}
                    />
                  </span>
                  <div className={styles.contactsMail}>
                    <a href="mailto:fanmir24@yandex.ru">fanmir24@yandex.ru</a>
                  </div>
                </li>
              </ul>

              <div className={styles.contactsCompany}>
                <Image
                  src="/img/logoFull.png"
                  alt="Фанерный мир"
                  width={88}
                  height={69}
                />
                <div>
                  <span>ООО ТД</span>
                  <strong>&quot;Фанерный мир&quot;</strong>
                </div>
              </div>
            </article>

            <div className={styles.mapCard}>
              <YandexMap center={[92.745941, 56.053861]} zoom={18} />
            </div>
          </div>
        </div>
      </section>


    </>
  );
}

function PartnersPanel() {
  return (
    <div className={styles.partnersPanel}>
      {partners.map((partner) => (
        <a
          aria-label={`Перейти на сайт ${partner.alt}`}
          className={partner.logoClassName}
          href={partner.href}
          key={partner.alt}
          rel="noreferrer"
          target="_blank"
        >
          <Image
            src={partner.src}
            alt={partner.alt}
            width={partner.width}
            height={partner.height}
          />
        </a>
      ))}
    </div>
  );
}

