import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

type ServiceTab = "delivery" | "cutting";

type ServicesPageProps = {
  searchParams: Promise<{
    tab?: string | string[];
  }>;
};

type ServiceContent = {
  eyebrow: string;
  title: string;
  lead: string;
  imageSrc: string;
  imageAlt: string;
  highlights: string[];
  stepsTitle: string;
  steps: string[];
  note: string;
};

export const metadata: Metadata = {
  title: "Доставка и распил | Фанерный мир",
  description: "Условия доставки, оплаты и распила фанеры и листовых материалов.",
};

const tabs: { id: ServiceTab; label: string; href: string }[] = [
  {
    id: "delivery",
    label: "Доставка и оплата",
    href: "/services?tab=delivery",
  },
  {
    id: "cutting",
    label: "Распил",
    href: "/services?tab=cutting",
  },
];

const services: Record<ServiceTab, ServiceContent> = {
  delivery: {
    eyebrow: "Услуги",
    title: "Доставка и оплата",
    lead:
      "Организуем получение заказа со склада, доставку по Красноярску и отправку через удобную логистику. Подберем вариант под объем, адрес и сроки.",
    imageSrc: "/img/advantages/icons/Truck5.svg",
    imageAlt: "",
    highlights: [
      "Самовывоз со склада на Калинина 169",
      "Доставка нашими водителями по городу",
      "Доставка грузовым такси для объемных заказов",
      "Наличный и безналичный расчет",
    ],
    stepsTitle: "Как проходит доставка",
    steps: [
      "Согласуем состав заказа и удобное время получения.",
      "Подбираем транспорт под формат листов и объем партии.",
      "Передаем заказ на доставку или подготавливаем его к самовывозу.",
    ],
    note:
      "Стоимость и сроки зависят от адреса, объема и способа перевозки. Точную информацию подскажем при оформлении заказа.",
  },
  cutting: {
    eyebrow: "Сервис",
    title: "Распил",
    lead:
      "Режем фанеру и листовые материалы под нужные размеры, чтобы заказ было проще перевозить, хранить и сразу использовать в работе.",
    imageSrc: "/img/raspil2.webp",
    imageAlt: "Распил листовых материалов",
    highlights: [
      "Распил фанеры, OSB, ДСП, ДВП и других листовых материалов",
      "Подготовка деталей по вашим размерам",
      "Помощь с подбором листа под карту раскроя",
      "Можно совместить распил с доставкой заказа",
    ],
    stepsTitle: "Как заказать распил",
    steps: [
      "Передайте размеры деталей и нужное количество.",
      "Мы проверим материал, формат листа и возможность раскроя.",
      "Подготовим заказ к выдаче или доставке.",
    ],
    note:
      "Перед распилом лучше заранее согласовать размеры и допуски. Так мы быстрее подготовим заказ и избежим лишних остатков.",
  },
};

function getActiveTab(tabValue: string | string[] | undefined): ServiceTab {
  const tab = Array.isArray(tabValue) ? tabValue[0] : tabValue;

  return tab === "cutting" ? "cutting" : "delivery";
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const { tab } = await searchParams;
  const activeTab = getActiveTab(tab);
  const service = services[activeTab];

  return (
    <section className={styles.servicesPage} aria-label="Услуги">
      <div className={styles.servicesFrame}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Фанерный мир</span>
          <h1 className={styles.title}>Услуги</h1>

          <nav className={styles.tabs} aria-label="Разделы услуг">
            {tabs.map((item) => {
              const isActive = item.id === activeTab;

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={[styles.tabLink, isActive ? styles.tabLinkActive : null]
                    .filter(Boolean)
                    .join(" ")}
                  href={item.href}
                  key={item.id}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <article className={styles.servicePanel}>
          <div className={styles.serviceContent}>
            <span className={styles.serviceEyebrow}>{service.eyebrow}</span>
            <h2 className={styles.serviceTitle}>{service.title}</h2>
            <p className={styles.serviceLead}>{service.lead}</p>

            <ul className={styles.highlights}>
              {service.highlights.map((item) => (
                <li className={styles.highlightItem} key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.visualPanel} aria-hidden={service.imageAlt ? undefined : true}>
            <Image
              alt={service.imageAlt}
              className={[
                styles.serviceImage,
                activeTab === "cutting" ? styles.coverImage : null,
              ]
                .filter(Boolean)
                .join(" ")}
              height={activeTab === "delivery" ? 110 : 720}
              priority
              src={service.imageSrc}
              unoptimized={activeTab === "cutting"}
              width={activeTab === "delivery" ? 110 : 1280}
            />
          </div>
        </article>

        <section className={styles.detailsGrid} aria-label="Подробности услуги">
          <div className={styles.stepsCard}>
            <h3 className={styles.cardTitle}>{service.stepsTitle}</h3>
            <ol className={styles.stepsList}>
              {service.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <aside className={styles.noteCard}>
            <span className={styles.noteLabel}>Важно</span>
            <p>{service.note}</p>
            <Link className={styles.catalogLink} href="/catalog">
              Перейти в каталог
            </Link>
          </aside>
        </section>
      </div>
    </section>
  );
}
