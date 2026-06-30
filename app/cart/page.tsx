import type { Metadata } from "next";
import { connection } from "next/server";
import {
  getCatalogPriceCards,
  type CatalogPriceCard,
} from "@/lib/catalog/getCatalogData";
import type { CartProduct } from "@/lib/cart/cartTypes";
import { createPageMetadata } from "@/lib/seo/site";
import { CartClient } from "./CartClient";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Корзина",
  description: "Корзина пользователя.",
  path: "/cart",
  noIndex: true,
});

function toCartProduct(product: CatalogPriceCard): CartProduct {
  return {
    id: product.id,
    imageUrl: product.imageUrl,
    titleLineOne: product.titleLineOne,
    titleLineTwo: product.titleLineTwo,
    meta: product.meta,
    price: product.price,
    pricePerM2: product.pricePerM2,
    unitPriceRub: product.unitPriceRub,
  };
}

export default async function CartPage() {
  await connection();

  const products = await getCatalogPriceCards();

  return (
    <section className={styles.cartPage} aria-label="Корзина пользователя">
      <div className={styles.cartFrame}>
        <h1 className={styles.title}>Корзина</h1>

        <CartClient products={products.map(toCartProduct)} />
      </div>
    </section>
  );
}
