import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "О нас | Фанерный мир",
  description:
    "Информация о компании Фанерный мир, сертификатах качества и пользовательском соглашении.",
};

type Certificate = {
  text: string;
  title: string;
} & (
  | {
      imageAlt: string;
      imageSrc: string;
    }
  | {
      imageAlt?: never;
      imageSrc?: never;
    }
);

const certificates: Certificate[] = [
  {
    title: "Сертификаты соответствия",
    text: "Документы на фанеру, OSB, ДСП, ДВП и сопутствующие листовые материалы.",
  },
  {
    title: "Сертификат Plydex",
    text: "Подтверждение характеристик продукции, сортности, формата и условий применения.",
    imageAlt: "Сертификат Plydex",
    imageSrc: "/img/about/plydex2.jpg",
  },
  {
    title: "Документ Plydex",
    text: "Сертификаты и декларации от производителей и официальных поставщиков.",
    imageAlt: "Документ поставщика Plydex",
    imageSrc: "/img/about/plydex3.jpg",
  },
];

const agreementItems = [
  {
    title: "Использование сайта",
    text: "Пользователь может просматривать каталог, цены, информацию об услугах и направлять запросы для оформления заказа.",
  },
  {
    title: "Информация о товарах",
    text: "Описание, наличие, стоимость и характеристики материалов носят информационный характер и уточняются при подтверждении заказа.",
  },
  {
    title: "Оформление заказа",
    text: "Заказ считается согласованным после подтверждения менеджером состава, количества, стоимости, способа оплаты и доставки.",
  },
  {
    title: "Персональные данные",
    text: "Контактные данные используются только для связи по заказу, консультации, доставки и обработки обращения пользователя.",
  },
  {
    title: "Ответственность",
    text: "Компания стремится поддерживать актуальность данных на сайте, но оставляет за собой право обновлять цены, условия и ассортимент.",
  },
];

export default function AboutPage() {
  return (
    <section className={styles.aboutPage} aria-label="О компании">
      <div className={styles.aboutFrame}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Фанерный мир</span>
          <h1 className={styles.title}>О нас</h1>
        </header>

        <section className={styles.intro} aria-labelledby="about-title">
          <div className={styles.introContent}>
            <span className={styles.sectionEyebrow}>Коротко о нас</span>
            <h2 className={styles.sectionTitle} id="about-title">
              Помогаем подобрать листовые материалы под задачу
            </h2>
            <p className={styles.text}>
              “Фанерный мир” работает с фанерой, OSB, ДСП, ДВП, MDF и продукцией
              Plydex. Подбираем материал по назначению, формату, толщине и
              бюджету, помогаем с доставкой и распилом.
            </p>
            <p className={styles.text}>
              Мы держим фокус на понятной консультации, аккуратной комплектации
              заказа и документах, которые подтверждают качество продукции.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryLink} href="/catalog">
                Перейти в каталог
              </Link>
              <Link className={styles.secondaryLink} href="/services?tab=delivery">
                Доставка и оплата
              </Link>
            </div>
          </div>

          <div className={styles.introImageWrap}>
            <Image
              alt="Склад листовых материалов"
              className={styles.introImage}
              height={768}
              priority
              sizes="(max-width: 760px) calc(100vw - 32px), 420px"
              src="/img/main/about.webp"
              width={530}
            />
          </div>
        </section>

        <section
          className={styles.certificatesSection}
          id="certificates"
          aria-labelledby="certificates-title"
        >
          <div className={styles.sectionHead}>
            <span className={styles.sectionEyebrow}>Документы</span>
            <h2 className={styles.sectionTitle} id="certificates-title">
              Наши сертификаты
            </h2>
          </div>

          <div className={styles.certificatesGrid}>
            {certificates.map((certificate) => (
              <article className={styles.certificateCard} key={certificate.title}>
                {certificate.imageSrc ? (
                  <div className={styles.certificateImageWrap}>
                    <Image
                      alt={certificate.imageAlt ?? ""}
                      className={styles.certificateImage}
                      height={298}
                      sizes="(max-width: 980px) 160px, 200px"
                      src={certificate.imageSrc}
                      width={200}
                    />
                  </div>
                ) : (
                  <span className={styles.certificateType}>PDF</span>
                )}
                <h3>{certificate.title}</h3>
                <p>{certificate.text}</p>
                {certificate.imageSrc ? null : (
                  <span className={styles.certificateStatus}>Файлы добавим на сайт</span>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.agreementSection} id="agreement" aria-labelledby="agreement-title">
          <div className={styles.agreementIntro}>
            <span className={styles.sectionEyebrow}>Правила сайта</span>
            <h2 className={styles.sectionTitle} id="agreement-title">
              Пользовательское соглашение
            </h2>
            <p className={styles.text}>
              Используя сайт, пользователь соглашается с условиями получения
              информации, обработки обращений и оформления заказов.
            </p>
          </div>

          <div className={styles.agreementList}>
            {agreementItems.map((item, index) => (
              <article className={styles.agreementItem} key={item.title}>
                <span className={styles.agreementNumber}>{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
