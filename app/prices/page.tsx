import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import styles from "./page.module.css";

type Product = {
  grades?: string[];
  image: string;
  sizes: string[];
  title: string;
};

const materials = [
  "Фанера березовая",
  "Фанера хвойная",
  "Фанера ламинированная",
  "Плиты OSB-3 (ОСП)",
  "ДСП",
  "ДВП",
];

const sorts = ["1/2", "2/2", "2/3", "1/3", "3/3", "3/4", "2/4", "4/4"];

const formats = [
  "1525*1525",
  "1220*2440",
  "1500*3000",
  "1250*2500",
  "2440*1220",
  "1700*2750",
  "1220*2710",
  "1220*190",
  "1220*145",
];

const products: Product[] = [
  {
    title: "Фанера березовая",
    image: "/catalogue/card-1.png",
    sizes: ["1525*1525", "1220*2440", "1500*3000", "1250*2500"],
    grades: ["1/2", "2/2", "2/3", "1/3"],
  },
  {
    title: "Фанера хвойная",
    image: "/catalogue/card-2.png",
    sizes: ["1220*2440 мм"],
    grades: ["3/3", "3/4", "2/4", "4/4"],
  },
  {
    title: "Фанера ламинированная",
    image: "/catalogue/card-3.png",
    sizes: ["2440*1220", "1250*2500"],
  },
  {
    title: "Плиты OSB-3 (ОСП)",
    image: "/catalogue/card-4.png",
    sizes: ["2440*1220"],
  },
  {
    title: "ДСП",
    image: "/catalogue/card-5.png",
    sizes: ["1700*2750", "1220*2710"],
  },
  {
    title: "ДВП",
    image: "/catalogue/card-6.png",
    sizes: ["1220*190", "1220*145"],
  },
];

export const metadata: Metadata = {
  title: "Каталог | Фанерный мир",
  description: "Каталог листовых материалов Fanmir с карточками из Figma.",
};

export default function Home() {
  return (
    <>
      <main className={styles.page}>
        <Header className={styles.header} />

        <section className={styles.catalogueSection} id="catalogue">
          <div className="container">
            <div className={styles.sheet}>
              <aside className={styles.sidebar} id="filters">
                <div className={styles.sidebarIntro}>
                  <p className={styles.kicker}>Catalogue</p>
                  <h1 className={styles.title}>Каталог</h1>
                </div>

                <div className={styles.filterBlock}>
                  <h2 className={styles.filterTitle}>Материалы</h2>
                  <ul className={styles.filterList}>
                    {materials.map((item) => (
                      <li className={styles.filterChip} key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.filterBlock}>
                  <h2 className={styles.filterTitle}>Сорт</h2>
                  <ul className={styles.filterList}>
                    {sorts.map((item) => (
                      <li className={styles.filterChip} key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.filterBlock}>
                  <h2 className={styles.filterTitle}>Формат</h2>
                  <ul className={styles.filterList}>
                    {formats.map((item) => (
                      <li className={styles.filterChip} key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              <div className={styles.content} id="materials">
                <div className={styles.contentHeader}>
                  <p className={styles.kicker}>list catalogue</p>
                  <h2 className={styles.contentTitle}>Листовые материалы</h2>
                </div>

                <div className={styles.grid}>
                  {products.map((product) => (
                    <article className={styles.card} key={product.title}>
                      <div className={styles.cardImageWrap}>
                        <Image
                          alt={product.title}
                          className={styles.cardImage}
                          fill
                          sizes="(max-width: 760px) 100vw, (max-width: 1120px) 50vw, 33vw"
                          src={product.image}
                        />
                      </div>

                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{product.title}</h3>

                        <ul className={styles.sizeList}>
                          {product.sizes.map((size) => (
                            <li className={styles.sizeChip} key={size}>
                              {size}
                            </li>
                          ))}
                        </ul>

                        {product.grades ? (
                          <ul className={styles.gradeList}>
                            {product.grades.map((grade) => (
                              <li className={styles.gradeChip} key={grade}>
                                {grade}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div id="contacts">
        <Footer />
      </div>
    </>
  );
}
