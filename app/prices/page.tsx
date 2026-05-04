import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

type ProductCard = {
  id: string;
  titleLineOne: string;
  titleLineTwo: string;
  sort: string;
  thickness: string;
  size: string;
  price: string;
};

const categories = [
  "Фанера березовая",
  "Фанера хвойная",
  "Фанера ламинированная",
  "Плиты OSB-3 (ОСП)",
  "ДВП и ДСП",
  "PLYDEX",
];

const products: ProductCard[] = Array.from({ length: 6 }, (_, index) => ({
  id: `fanera-berezovaya-${index + 1}`,
  titleLineOne: "Фанера березовая ФК 1525х1525 мм",
  titleLineTwo: "3мм Ш2 (В/ВВ) СВЕЗА",
  sort: "Сорт 1/2",
  thickness: "3мм",
  size: "1525*1525 мм",
  price: "890 р/лист",
}));

export const metadata: Metadata = {
  title: "Наши цены | Фанерный мир",
  description: "Каталог фанеры и листовых материалов.",
};

export default function PricesPage() {
  return (
    <section className={styles.catalogPage} aria-label="Каталог товаров">
      <div className={styles.catalogFrame}>
        <aside className={styles.sidebar} aria-label="Категории каталога">
          <ul className={styles.categoryList}>
            {categories.map((category) => (
              <li className={styles.categoryItem} key={category}>
                <button className={styles.categoryButton} type="button">
                  <span>{category}</span>
                  <span className={styles.categoryArrow} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.productsGrid}>
          {products.map((product) => (
            <article className={styles.productCard} key={product.id}>
              <div className={styles.productImage}>
                <Image
                  alt=""
                  fill
                  priority={product.id === "fanera-berezovaya-1"}
                  sizes="309px"
                  src="/img/catalogue/card.png"
                />
              </div>

              <h2 className={styles.productTitle}>
                <span>{product.titleLineOne}</span>
                <span>{product.titleLineTwo}</span>
              </h2>

              <dl className={styles.productMeta}>
                <div className={styles.metaColumn}>
                  <dt>Сорт</dt>
                  <dd>{product.sort}</dd>
                </div>
                <div className={styles.metaColumn}>
                  <dt>Толщина</dt>
                  <dd>{product.thickness}</dd>
                </div>
                <div className={styles.metaColumn}>
                  <dt>Размер</dt>
                  <dd>{product.size}</dd>
                </div>
              </dl>

              <div className={styles.productPrice}>{product.price}</div>

              <div className={styles.productActions}>
                <div className={styles.quantityControl} aria-label="Количество">
                  <button aria-label="Уменьшить количество" type="button">
                    −
                  </button>
                  <span>0</span>
                  <button aria-label="Увеличить количество" type="button">
                    +
                  </button>
                </div>

                <button className={styles.cartButton} type="button">
                  <span>В корзину</span>
                  <CartIcon />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.cartIcon}
      fill="none"
      height="25"
      viewBox="0 0 25 25"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.2 7.2H22L20.5 15.2H8.7L7.2 7.2ZM7.2 7.2L6.5 4H3.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
      <circle cx="10.1" cy="19.3" r="1.35" stroke="currentColor" strokeWidth="1.45" />
      <circle cx="18.2" cy="19.3" r="1.35" stroke="currentColor" strokeWidth="1.45" />
    </svg>
  );
}
