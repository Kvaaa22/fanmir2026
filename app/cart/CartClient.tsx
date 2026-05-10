"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  decrementCartItem,
  incrementCartItem,
  useCartItems,
} from "@/lib/cart/cartStore";
import type { CartItem, CartProduct } from "@/lib/cart/cartTypes";
import styles from "./page.module.css";

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

function renderTextWithNumbers(value: string, preserveSpaces = false) {
  return value
    .split(/(\d+(?:[.,]\d+)?(?:[xх×*/-]\d+(?:[.,]\d+)?)*)/gi)
    .filter(Boolean)
    .map((part, index) => {
      const textPart = preserveSpaces ? part.replace(/ /g, "\u00a0") : part;

      return /\d/.test(part) ? (
        <span className={styles.numberText} key={`${part}-${index}`}>
          {textPart}
        </span>
      ) : (
        textPart
      );
    });
}

function getCurrentCartItem(
  item: CartItem,
  productsById: Map<string, CartProduct>,
) {
  const currentProduct = productsById.get(item.product.id) ?? item.product;

  return {
    product: currentProduct,
    quantity: item.quantity,
  };
}

export function CartClient({ products }: { products: CartProduct[] }) {
  const storedCartItems = useCartItems();
  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products],
  );
  const cartItems = useMemo(
    () =>
      storedCartItems.map((item) => getCurrentCartItem(item, productsById)),
    [productsById, storedCartItems],
  );
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (item.product.unitPriceRub ?? 0) * item.quantity;
  }, 0);

  return (
    <>
      <div className={styles.itemsList}>
        {cartItems.length === 0 ? (
          <p className={styles.emptyCart}>В корзине пока нет товаров.</p>
        ) : (
          cartItems.map(({ product, quantity }, index) => (
            <article className={styles.cartItem} key={product.id}>
              <div className={styles.imageFrame}>
                <Image
                  alt=""
                  className={styles.itemImage}
                  height={636}
                  priority={index === 0}
                  src={product.imageUrl}
                  width={1375}
                />
              </div>

              <div className={styles.itemPanel}>
                <h2 className={styles.itemTitle}>
                  <span>{renderTextWithNumbers(product.titleLineOne)}</span>
                  <span>{renderTextWithNumbers(product.titleLineTwo)}</span>
                </h2>

                <dl className={styles.itemMeta}>
                  {product.meta.map((metaItem) => (
                    <div className={styles.metaColumn} key={metaItem.label}>
                      <dt>{metaItem.label}</dt>
                      <dd>{renderTextWithNumbers(metaItem.value, true)}</dd>
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
                    <button
                      aria-label="Уменьшить количество"
                      onClick={() => decrementCartItem(product)}
                      type="button"
                    >
                      −
                    </button>
                    <span>{quantity}</span>
                    <button
                      aria-label="Увеличить количество"
                      onClick={() => incrementCartItem(product)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryLabel}>Сумма заказа</span>
        <strong className={styles.summaryValue}>
          {rubFormatter.format(totalPrice)} рублей
        </strong>
        <button
          className={styles.checkoutButton}
          disabled={cartItems.length === 0}
          type="button"
        >
          Оформить заказ
        </button>
      </div>
    </>
  );
}
