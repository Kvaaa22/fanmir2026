import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import { getCatalogPriceCards } from "@/lib/catalog/getCatalogData";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Корзина | Фанерный мир",
  description: "Корзина пользователя.",
};

const selectedCatalogCardId = "MAIN-864";
const cartRowsCount = 3;
const itemQuantity = 5;

const itemMeta = [
  {
    label: "Сорт",
    value: (
      <>
        Сорт <span className={styles.numberText}>1/2</span>
      </>
    ),
  },
  {
    label: "Толщина",
    value: (
      <>
        <span className={styles.numberText}>3</span> мм
      </>
    ),
  },
  {
    label: "Размер",
    value: (
      <>
        <span className={styles.numberText}>1525*1525</span> мм
      </>
    ),
  },
];

export default async function CartPage() {
  await connection();

  const products = await getCatalogPriceCards();
  const selectedProduct =
    products.find((product) => product.id === selectedCatalogCardId) ??
    products.find(
      (product) =>
        product.productSlug === "fanera-berezovaya-fk-sh2-sveza-1525x1525",
    ) ??
    products[0];
  const imageUrl = selectedProduct?.imageUrl ?? "/img/catalogue/card.png";

  return (
    <section className={styles.cartPage} aria-label="Корзина пользователя">
      <div className={styles.cartFrame}>
        <h1 className={styles.title}>Корзина</h1>

        <div className={styles.itemsList}>
          {Array.from({ length: cartRowsCount }, (_, index) => (
            <article className={styles.cartItem} key={index}>
              <div className={styles.imageFrame}>
                <Image
                  alt=""
                  className={styles.itemImage}
                  height={636}
                  priority={index === 0}
                  src={imageUrl}
                  width={1375}
                />
              </div>

              <div className={styles.itemPanel}>
                <h2 className={styles.itemTitle}>
                  <span>
                    Фанера березовая ФК{" "}
                    <span className={styles.numberText}>1525x1525</span> мм
                  </span>
                  <span>
                    <span className={styles.numberText}>3</span>мм Ш
                    <span className={styles.numberText}>2</span> (В/ВВ) СВЕЗА
                  </span>
                </h2>

                <dl className={styles.itemMeta}>
                  {itemMeta.map((metaItem) => (
                    <div className={styles.metaColumn} key={metaItem.label}>
                      <dt>{metaItem.label}</dt>
                      <dd>{metaItem.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className={styles.quantityBlock}>
                  <p className={styles.quantityLabel}>
                    <span>Кол-во листов</span>
                    <span>в корзине</span>
                  </p>

                  <div
                    className={styles.quantityControls}
                    aria-label="Количество листов в корзине"
                  >
                    <button aria-label="Уменьшить количество" type="button">
                      −
                    </button>
                    <span>{itemQuantity}</span>
                    <button aria-label="Увеличить количество" type="button">
                      +
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.summary}>
          <span className={styles.summaryLabel}>Сумма заказа</span>
          <strong className={styles.summaryValue}>20111 рублей</strong>
          <button className={styles.checkoutButton} type="button">
            Оформить заказ
          </button>
        </div>
      </div>
    </section>
  );
}
