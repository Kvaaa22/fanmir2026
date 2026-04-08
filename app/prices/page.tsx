import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import styles from "./page.module.css";

type PriceGroup = {
  items: string[];
  title: string;
};

type GroupLayout = {
  columns: string;
  gap: number;
  marginTop?: number;
};

type PriceCard = {
  column: string;
  groups: Array<{
    items: PriceGroup[];
    layout: GroupLayout;
  }>;
  image: {
    alt: string;
    priority?: boolean;
    src: string;
    width: number;
  };
  title: string;
};

type PriceRow = {
  cards: PriceCard[];
  columns: string;
  id: string;
  single?: boolean;
};

const priceRows: PriceRow[] = [
  {
    id: "primary",
    columns: "304px 54px 304px 50px 355px",
    cards: [
      {
        column: "1",
        title: "Фанера березовая",
        image: {
          alt: "Фанера березовая",
          priority: true,
          src: "/prices/fanera-berezovaya.png",
          width: 304,
        },
        groups: [
          {
            layout: { columns: "49px 59px 122px", gap: 13 },
            items: [
              {
                title: "Толщина",
                items: [
                  "3 мм",
                  "4 мм",
                  "5 мм",
                  "6 мм",
                  "8 мм",
                  "9 мм",
                  "10 мм",
                  "12 мм",
                  "15 мм",
                  "18 мм",
                  "21 мм",
                  "24 мм",
                  "27 мм",
                  "30 мм",
                  "35 мм",
                  "40 мм",
                ],
              },
              {
                title: "Сорт",
                items: [
                  "Сорт 1/2",
                  "Сорт 2/2",
                  "Сорт 2/3",
                  "Сорт 1/3",
                  "Сорт 3/3",
                  "Сорт 3/4",
                  "Сорт 2/4",
                  "Сорт 4/4",
                ],
              },
              {
                title: "Вид фанеры",
                items: [
                  "Влагостойкая",
                  "Ламинированная",
                  "ФСФ",
                  "ФК",
                  "Опалубочная",
                  "Строительная",
                  "Мебельная",
                ],
              },
            ],
          },
          {
            layout: { columns: "97px 120px", gap: 19, marginTop: 8 },
            items: [
              {
                title: "Размер",
                items: [
                  "1525*1525 мм",
                  "1220*2440 мм",
                  "1500*3000 мм",
                  "1250*2500 мм",
                ],
              },
              {
                title: "Применение",
                items: [
                  "Строительная",
                  "Опалубочная",
                  "Для пола",
                  "Для мебели",
                  "Для перекрытий",
                  "Для обшивки",
                ],
              },
            ],
          },
        ],
      },
      {
        column: "3",
        title: "Фанера хвойная 1220*2440 мм",
        image: {
          alt: "Фанера хвойная",
          src: "/prices/fanera-xvoinaya.png",
          width: 304,
        },
        groups: [
          {
            layout: { columns: "51px 57px 126px", gap: 14 },
            items: [
              {
                title: "Толщина",
                items: [
                  "6,5 мм",
                  "9 мм",
                  "12 мм",
                  "15 мм",
                  "18 мм",
                  "21 мм",
                  "24 мм",
                  "27 мм",
                  "30 мм",
                ],
              },
              {
                title: "Сорт",
                items: ["Сорт 1/3", "Сорт 2/3", "Сорт 3/3", "Сорт 3/4"],
              },
              {
                title: "Вид фанеры",
                items: ["Шлифованная", "Нешлифованная", "ФСФ", "Строительная"],
              },
            ],
          },
          {
            layout: { columns: "73px 118px", gap: 20, marginTop: 8 },
            items: [
              {
                title: "Размер",
                items: ["1220*2440 мм"],
              },
              {
                title: "Применение",
                items: ["Строительная", "Для пола", "Для перекрытий", "Для обшивки"],
              },
            ],
          },
        ],
      },
      {
        column: "5",
        title: "Фанера ламинированная",
        image: {
          alt: "Фанера ламинированная",
          src: "/prices/fanera-laminirovannaya.png",
          width: 355,
        },
        groups: [
          {
            layout: { columns: "49px 111px 112px", gap: 15 },
            items: [
              {
                title: "Толщина",
                items: [
                  "6 мм",
                  "9 мм",
                  "12 мм",
                  "15 мм",
                  "18 мм",
                  "21 мм",
                  "24 мм",
                  "27 мм",
                  "30 мм",
                  "35 мм",
                  "40 мм",
                ],
              },
              {
                title: "Вид фанеры",
                items: [
                  "F/F (гладкая/гладкая)",
                  "F/W (гладкая/сетка)",
                  "ДЭК 350 гладкая/гладкая",
                ],
              },
              {
                title: "Применение",
                items: ["Для опалубки", "Для пола", "Для перекрытий", "Для обшивки"],
              },
            ],
          },
          {
            layout: { columns: "112px", gap: 0, marginTop: 8 },
            items: [
              {
                title: "Размер",
                items: ["1220*2440 мм", "1500*3000 мм"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "secondary",
    columns: "304px 54px 196px 162px 218px",
    cards: [
      {
        column: "1",
        title: "Плиты OSB-3 (ОСП)",
        image: {
          alt: "Плиты OSB-3",
          src: "/prices/pliti-osb-3.png",
          width: 304,
        },
        groups: [
          {
            layout: { columns: "49px 77px 118px", gap: 15 },
            items: [
              {
                title: "Толщина",
                items: ["6 мм", "9 мм", "12 мм", "15 мм", "18 мм", "22 мм"],
              },
              {
                title: "Размер",
                items: ["1250*2500 мм"],
              },
              {
                title: "Применение",
                items: [
                  "Строительная",
                  "Для пола",
                  "Для мебели",
                  "Для перекрытий",
                  "Для обшивки",
                ],
              },
            ],
          },
        ],
      },
      {
        column: "3",
        title: "ДСП",
        image: {
          alt: "ДСП",
          src: "/prices/dsp.png",
          width: 196,
        },
        groups: [
          {
            layout: { columns: "50px 101px", gap: 29 },
            items: [
              {
                title: "Толщина",
                items: ["16 мм"],
              },
              {
                title: "Применение",
                items: ["Строительная", "Для пола", "Для перекрытий", "Для обшивки"],
              },
            ],
          },
          {
            layout: { columns: "78px 76px", gap: 20, marginTop: 9 },
            items: [
              {
                title: "Размер",
                items: ["2440*1220 мм", "2500*1830 мм"],
              },
              {
                title: "Вид ДСП",
                items: ["Шлифованная"],
              },
            ],
          },
        ],
      },
      {
        column: "5",
        title: "ДВП",
        image: {
          alt: "ДВП",
          src: "/prices/dvp.png",
          width: 218,
        },
        groups: [
          {
            layout: { columns: "49px 110px", gap: 20 },
            items: [
              {
                title: "Толщина",
                items: ["2,5 мм", "3,2 мм", "5 мм"],
              },
              {
                title: "Применение",
                items: ["Для мебели", "Для пола", "Для перекрытий", "Для обшивки"],
              },
            ],
          },
          {
            layout: { columns: "85px 97px", gap: 18, marginTop: 9 },
            items: [
              {
                title: "Вид ДВП",
                items: ["Одностороннее", "Двустороннее"],
              },
              {
                title: "Размер",
                items: ["1220*2440 мм", "1700*2750 мм", "1220*2710 мм"],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "plydex",
    columns: "953px",
    single: true,
    cards: [
      {
        column: "1",
        title: "PLYDEX",
        image: {
          alt: "PLYDEX",
          src: "/prices/plydex.png",
          width: 953,
        },
        groups: [
          {
            layout: { columns: "111px 254px 112px 113px 127px", gap: 34 },
            items: [
              {
                title: "Панели",
                items: [
                  "Без покрытия",
                  "С покрытием",
                  "Размер 1220*190 мм",
                  "Размер 1220*145 мм",
                  "Индивидуальный размер",
                ],
              },
              {
                title: "Профиль",
                items: [
                  "Г-образный",
                  "Г-образный, размер 100*100*2400 мм",
                  "Г-образный, размер 200*200*2400 мм",
                  "П-образный",
                  "П-образный, размер 180*200*180*2400 мм",
                  "П-образный, размер 90*100*90*2400 мм",
                  "О-образный(4 стороны)",
                  "О-образный, размер 150*150*150*150*2400 мм",
                  "О-образный, размер 50*50*50*50*2400 мм",
                  "С покрытием",
                  "Без покрытия",
                  "Под заказ*",
                ],
              },
              {
                title: "Панно",
                items: ["Под заказ в ассортименте*"],
              },
              {
                title: "Двери",
                items: ["С покрытием", "Без покрытия", "Под заказ в ассортименте*"],
              },
              {
                title: "Изделия на заказ",
                items: ["Столы", "Шкафы", "Стеллажи", "Дверные откосы"],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "Наши цены | Фанерный мир",
  description: "Страница цен Fanmir, собранная по макету с сохранением дизайнерской композиции.",
};

export default function PricesPage() {
  return (
    <section className={styles.pricesPage} aria-labelledby="prices-title">
      <div className={styles.canvas}>
        <h1 className={styles.pageTitle} id="prices-title">
          Наши цены
        </h1>

        <div className={styles.rows}>
          {priceRows.map((row) => (
            <div
              className={`${styles.row} ${row.single ? styles.rowSingle : ""}`}
              key={row.id}
              style={getRowStyle(row.columns)}
            >
              {row.cards.map((card) => (
                <article
                  className={styles.card}
                  key={card.title}
                  style={getCardStyle(card.column, card.image.width)}
                >
                  <h2 className={styles.cardTitle}>{card.title}</h2>
                  <Image
                    alt={card.image.alt}
                    className={styles.cardImage}
                    height={15}
                    priority={card.image.priority}
                    sizes={getImageSizes(card.image.width)}
                    src={card.image.src}
                    style={{ width: "100%", height: "auto" }}
                    width={card.image.width}
                  />

                  {card.groups.map((groupSet, index) => (
                    <PriceGroups
                      groups={groupSet.items}
                      key={`${card.title}-${index}`}
                      layout={groupSet.layout}
                    />
                  ))}
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PriceGroups({
  groups,
  layout,
}: {
  groups: PriceGroup[];
  layout: GroupLayout;
}) {
  return (
    <div className={styles.groupGrid} style={getGroupStyle(layout)}>
      {groups.map((group) => (
        <section className={styles.group} key={group.title}>
          <h3 className={styles.groupTitle}>{group.title}</h3>
          <ul className={styles.groupList}>
            {group.items.map((item) => (
              <li className={styles.groupItem} key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function getImageSizes(width: number) {
  return `(max-width: 767px) calc(100vw - 48px), ${width}px`;
}

function getRowStyle(columns: string): CSSProperties {
  return {
    "--row-columns": columns,
  } as CSSProperties;
}

function getCardStyle(column: string, width: number): CSSProperties {
  return {
    "--card-column": column,
    "--card-width": `${width}px`,
  } as CSSProperties;
}

function getGroupStyle(layout: GroupLayout): CSSProperties {
  return {
    "--group-columns": layout.columns,
    "--group-gap": `${layout.gap}px`,
    "--group-margin-top": `${layout.marginTop ?? 0}px`,
  } as CSSProperties;
}
