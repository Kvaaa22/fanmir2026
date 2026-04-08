import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

type PriceGroup = {
  items: string[];
  title: string;
};

const birchTop: PriceGroup[] = [
  {
    title: "Толщина",
    items: [
      "3 мм",
      "4 мм",
      "5 мм",
      "6,5 мм",
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
];

const birchBottom: PriceGroup[] = [
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
      "Строительные",
      "Отделочные",
      "Для пола",
      "Для мебели",
      "Для перегородок",
      "Для обшивки",
    ],
  },
];

const softwoodTop: PriceGroup[] = [
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
];

const softwoodBottom: PriceGroup[] = [
  {
    title: "Размер",
    items: ["1220*2440 мм"],
  },
  {
    title: "Применение",
    items: ["Строительные", "Для пола", "Для перегородок", "Для обшивки"],
  },
];

const laminatedTop: PriceGroup[] = [
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
      "F/W (гладкая/сетчатая)",
      "D/W 350 ламинированная",
    ],
  },
  {
    title: "Применение",
    items: ["Для опалубки", "Для пола", "Для перекрытий", "Для обшивки"],
  },
];

const laminatedBottom: PriceGroup[] = [
  {
    title: "Размер",
    items: ["1220*2440 мм", "1500*3000 мм"],
  },
];

const osbGroups: PriceGroup[] = [
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
      "Строительные",
      "Для пола",
      "Для мебели",
      "Для перегородок",
      "Для обшивки",
    ],
  },
];

const dspTop: PriceGroup[] = [
  {
    title: "Толщина",
    items: ["16 мм"],
  },
  {
    title: "Применение",
    items: ["Строительные", "Для пола", "Для перегородок", "Для обшивки"],
  },
];

const dspBottom: PriceGroup[] = [
  {
    title: "Размер",
    items: ["2440*1220 мм", "2500*1830 мм"],
  },
  {
    title: "Вид ДСП",
    items: ["Шлифованная"],
  },
];

const dvpTop: PriceGroup[] = [
  {
    title: "Толщина",
    items: ["2,5 мм", "3,2 мм", "5 мм"],
  },
  {
    title: "Применение",
    items: ["Для мебели", "Для пола", "Для перегородок", "Для обшивки"],
  },
];

const dvpBottom: PriceGroup[] = [
  {
    title: "Вид ДВП",
    items: ["Одностороннее", "Двустороннее"],
  },
  {
    title: "Размер",
    items: ["1220*2440 мм", "1700*2750 мм", "1220*2710 мм"],
  },
];

const plydexGroups: PriceGroup[] = [
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
      "Г-образный, размер 190*100*2440 мм",
      "Г-образный, размер 200*100*2440 мм",
      "П-образный",
      "П-образный, размер 190*100*2440 мм",
      "П-образный, размер 200*90*2440 мм",
      "О-образный",
      "О-образный, размер 150*150*150*2440 мм",
      "О-образный, размер 50*50*50*2440 мм",
      "С покрытием",
      "Без покрытия",
      "Под заказ",
    ],
  },
  {
    title: "Панно",
    items: ['Под заказ в ассортименте*'],
  },
  {
    title: "Двери",
    items: ["С покрытием", "Без покрытия", 'Под заказ в ассортименте*'],
  },
  {
    title: "Изделия на заказ",
    items: ["Столы", "Шкафы", "Стеллажи", "Дверные откосы"],
  },
];

export const metadata: Metadata = {
  title: "Наши цены | Фанерный мир",
  description: "Статичная версия страницы цен по макету 1366px.",
};

export default function PricesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.canvas}>
        <h1 className={styles.pageTitle}>Наши цены</h1>

        <div className={styles.rowPrimary}>
          <article className={styles.block}>
            <h2 className={styles.blockTitle}>Фанера березовая</h2>
            <Image
              alt="Фанера березовая"
              className={styles.blockImage}
              height={15}
              priority
              src="/prices/fanera-berezovaya.png"
              width={304}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.birchTopGrid}`}
              groups={birchTop}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.birchBottomGrid}`}
              groups={birchBottom}
            />
          </article>

          <article className={styles.block}>
            <h2 className={styles.blockTitle}>Фанера хвойная 1220*2440 мм</h2>
            <Image
              alt="Фанера хвойная"
              className={styles.blockImage}
              height={15}
              src="/prices/fanera-xvoinaya.png"
              width={304}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.softwoodTopGrid}`}
              groups={softwoodTop}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.softwoodBottomGrid}`}
              groups={softwoodBottom}
            />
          </article>

          <article className={styles.block}>
            <h2 className={styles.blockTitle}>Фанера ламинированная</h2>
            <Image
              alt="Фанера ламинированная"
              className={styles.blockImage}
              height={15}
              src="/prices/fanera-laminirovannaya.png"
              width={355}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.laminatedTopGrid}`}
              groups={laminatedTop}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.laminatedBottomGrid}`}
              groups={laminatedBottom}
            />
          </article>
        </div>

        <div className={styles.rowSecondary}>
          <article className={styles.block}>
            <h2 className={styles.blockTitle}>Плиты OSB-3 (ОСП)</h2>
            <Image
              alt="Плиты OSB-3"
              className={styles.blockImage}
              height={15}
              src="/prices/pliti-osb-3.png"
              width={304}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.osbGrid}`}
              groups={osbGroups}
            />
          </article>

          <article className={styles.block}>
            <h2 className={styles.blockTitle}>ДСП</h2>
            <Image
              alt="ДСП"
              className={styles.blockImage}
              height={15}
              src="/prices/dsp.png"
              width={196}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.dspTopGrid}`}
              groups={dspTop}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.dspBottomGrid}`}
              groups={dspBottom}
            />
          </article>

          <article className={styles.block}>
            <h2 className={styles.blockTitle}>ДВП</h2>
            <Image
              alt="ДВП"
              className={styles.blockImage}
              height={15}
              src="/prices/dvp.png"
              width={218}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.dvpTopGrid}`}
              groups={dvpTop}
            />
            <PriceGroups
              className={`${styles.groupGrid} ${styles.dvpBottomGrid}`}
              groups={dvpBottom}
            />
          </article>
        </div>

        <article className={`${styles.block} ${styles.plydexBlock}`}>
          <h2 className={styles.blockTitle}>PLYDEX</h2>
          <Image
            alt="PLYDEX"
            className={styles.blockImage}
            height={15}
            src="/prices/plydex.png"
            width={953}
          />
          <PriceGroups
            className={`${styles.groupGrid} ${styles.plydexGrid}`}
            groups={plydexGroups}
          />
        </article>
      </section>
    </main>
  );
}

function PriceGroups({
  className,
  groups,
}: {
  className: string;
  groups: PriceGroup[];
}) {
  return (
    <div className={className}>
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
