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
  imageAlt: string;
  imageHeight: number;
  imageSrc: string;
  imageWidth: number;
  text: string;
  title: string;
};

const certificates: Certificate[] = [
  {
    title: "Паспорт качества на фанеру березовую",
    text: "Паспорт качества на листовой материал 12 мм, сорт 3/4.",
    imageAlt: "Паспорт качества Сенячиха 2025 на листовой материал 12 мм сорт 3/4",
    imageSrc: "/img/about/Сенячиха_2025_12ммсорт3_4 паспорт.jpg",
    imageWidth: 1653,
    imageHeight: 2338,
  },
  {
    title: "Сертификат \"OSB\"",
    text: "Сертификат соответствия на OSB-плиты.",
    imageAlt: "Сертификат соответствия на OSB-плиты",
    imageSrc: "/img/about/сертификат OSB.jpg",
    imageWidth: 1653,
    imageHeight: 2339,
  },
  {
    title: "Ламинированная фанера",
    text: "Сертификат соответствия на ламинированную фанеру.",
    imageAlt: "Сертификат соответствия на ламинированную фанеру",
    imageSrc: "/img/about/Сертификат ламинированная.jpg",
    imageWidth: 1653,
    imageHeight: 2338,
  },
  {
    title: "\"OSB-3\"",
    text: "Сертификат соответствия на ОСП класса эмиссии E0.5.",
    imageAlt: "Сертификат соответствия на ОСП класса эмиссии E0.5",
    imageSrc: "/img/about/Сертификат ОСП E0.5  07.10.2022-06.10.2025.jpg",
    imageWidth: 1700,
    imageHeight: 2336,
  },
  {
    title: "Хвойная фанера",
    text: "Сертификат соответствия на хвойную фанеру производителя Илим Братск.",
    imageAlt: "Сертификат соответствия на хвойную фанеру Илим Братск",
    imageSrc: "/img/about/Сертификат соответствия хвойной фанеры Илим Братск.jpg",
    imageWidth: 1700,
    imageHeight: 2336,
  },
  {
    title: "Березовая фанера",
    text: "Сертификат соответствия на березовую фанеру.",
    imageAlt: "Сертификат соответствия на березовую фанеру",
    imageSrc: "/img/about/СертификатФанераБерезовая.jpg",
    imageWidth: 1653,
    imageHeight: 2338,
  },
  {
    title: 'Свидетельство на товарный знак "Plydex"',
    text: "",
    imageAlt: "Документ Plydex 1",
    imageSrc: "/img/about/plydex1.jpg",
    imageWidth: 200,
    imageHeight: 298,
  },
  {
    title: 'Патент "Plydex"',
    text: "",
    imageAlt: "Документ Plydex 2",
    imageSrc: "/img/about/plydex2.jpg",
    imageWidth: 200,
    imageHeight: 298,
  },
  {
    title: 'Сертификат "Plydex"',
    text: "",
    imageAlt: "Документ Plydex 3",
    imageSrc: "/img/about/plydex3.jpg",
    imageWidth: 200,
    imageHeight: 298,
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
                <div className={styles.certificateImageWrap}>
                  <Image
                    alt={certificate.imageAlt}
                    className={styles.certificateImage}
                    height={certificate.imageHeight}
                    sizes="(max-width: 980px) 160px, 200px"
                    src={certificate.imageSrc}
                    width={certificate.imageWidth}
                  />
                </div>
                <h3>{certificate.title}</h3>
                <p>{certificate.text}</p>
                <a
                  className={styles.certificateLink}
                  href={certificate.imageSrc}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Открыть изображение
                </a>
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
