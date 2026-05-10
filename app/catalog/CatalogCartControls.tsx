"use client";

import {
  incrementCartItem,
  decrementCartItem,
  useCartItemQuantity,
} from "@/lib/cart/cartStore";
import type { CartProduct } from "@/lib/cart/cartTypes";
import styles from "./page.module.css";

export function CatalogCartControls({ product }: { product: CartProduct }) {
  const quantity = useCartItemQuantity(product.id);

  return (
    <div className={styles.productActions}>
      <div className={styles.quantityControl} aria-label="Количество">
        <button
          aria-label="Уменьшить количество"
          disabled={quantity <= 0}
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

      <button
        className={styles.cartButton}
        onClick={() => incrementCartItem(product)}
        type="button"
      >
        <span>В корзину</span>
        <CartIcon />
      </button>
    </div>
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
