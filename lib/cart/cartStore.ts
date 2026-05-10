"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { CartItem, CartProduct, CartSnapshot } from "./cartTypes";

const cartStorageKey = "fanmir-cart-v1";
const cartChangeEventName = "fanmir-cart-change";
const emptyCartSnapshot: CartSnapshot = {
  items: {},
  updatedAt: 0,
};

let cachedRawCart: string | null = null;
let cachedSnapshot = emptyCartSnapshot;

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeProduct(value: unknown): CartProduct | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = typeof value.id === "string" ? value.id : "";
  const imageUrl = typeof value.imageUrl === "string" ? value.imageUrl : "";
  const titleLineOne =
    typeof value.titleLineOne === "string" ? value.titleLineOne : "";
  const titleLineTwo =
    typeof value.titleLineTwo === "string" ? value.titleLineTwo : "";
  const price = typeof value.price === "string" ? value.price : "";

  if (!id || !imageUrl || !titleLineOne || !price) {
    return null;
  }

  const meta = Array.isArray(value.meta)
    ? value.meta
        .map((metaItem) => {
          if (!isRecord(metaItem)) {
            return null;
          }

          const label = typeof metaItem.label === "string" ? metaItem.label : "";
          const metaValue =
            typeof metaItem.value === "string" ? metaItem.value : "";

          return label && metaValue ? { label, value: metaValue } : null;
        })
        .filter((metaItem): metaItem is CartProduct["meta"][number] =>
          Boolean(metaItem),
        )
    : [];

  const pricePerM2 =
    typeof value.pricePerM2 === "string" ? value.pricePerM2 : undefined;
  const unitPriceRub =
    typeof value.unitPriceRub === "number" && Number.isFinite(value.unitPriceRub)
      ? value.unitPriceRub
      : null;

  return {
    id,
    imageUrl,
    titleLineOne,
    titleLineTwo,
    meta,
    price,
    pricePerM2,
    unitPriceRub,
  };
}

function normalizeItem(value: unknown): CartItem | null {
  if (!isRecord(value)) {
    return null;
  }

  const product = normalizeProduct(value.product);
  const quantity =
    typeof value.quantity === "number" && Number.isFinite(value.quantity)
      ? Math.floor(value.quantity)
      : 0;

  if (!product || quantity <= 0) {
    return null;
  }

  return {
    product,
    quantity,
  };
}

function normalizeSnapshot(value: unknown): CartSnapshot {
  if (!isRecord(value) || !isRecord(value.items)) {
    return emptyCartSnapshot;
  }

  const items = Object.entries(value.items).reduce<CartSnapshot["items"]>(
    (currentItems, [itemId, itemValue]) => {
      const item = normalizeItem(itemValue);

      if (item) {
        currentItems[itemId] = item;
      }

      return currentItems;
    },
    {},
  );

  return {
    items,
    updatedAt:
      typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt)
        ? value.updatedAt
        : 0,
  };
}

function readCartSnapshot() {
  if (!canUseStorage()) {
    return emptyCartSnapshot;
  }

  const rawCart = window.localStorage.getItem(cartStorageKey) ?? "";

  if (rawCart === cachedRawCart) {
    return cachedSnapshot;
  }

  cachedRawCart = rawCart;

  try {
    cachedSnapshot = normalizeSnapshot(JSON.parse(rawCart || "{}"));
  } catch {
    cachedSnapshot = emptyCartSnapshot;
  }

  return cachedSnapshot;
}

function writeCartSnapshot(snapshot: CartSnapshot) {
  if (!canUseStorage()) {
    return;
  }

  const normalizedSnapshot = normalizeSnapshot(snapshot);
  const rawCart = JSON.stringify(normalizedSnapshot);

  window.localStorage.setItem(cartStorageKey, rawCart);
  cachedRawCart = rawCart;
  cachedSnapshot = normalizedSnapshot;
  window.dispatchEvent(new Event(cartChangeEventName));
}

function subscribeCart(listener: () => void) {
  if (!canUseStorage()) {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === cartStorageKey) {
      cachedRawCart = null;
      listener();
    }
  };

  window.addEventListener(cartChangeEventName, listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(cartChangeEventName, listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function updateCartItems(
  updater: (items: CartSnapshot["items"]) => CartSnapshot["items"],
) {
  const currentSnapshot = readCartSnapshot();
  const nextItems = updater({ ...currentSnapshot.items });

  writeCartSnapshot({
    items: nextItems,
    updatedAt: Date.now(),
  });
}

export function useCartSnapshot() {
  return useSyncExternalStore(
    subscribeCart,
    readCartSnapshot,
    () => emptyCartSnapshot,
  );
}

export function useCartItems() {
  const snapshot = useCartSnapshot();

  return useMemo(() => Object.values(snapshot.items), [snapshot.items]);
}

export function useCartItemQuantity(productId: string) {
  const snapshot = useCartSnapshot();

  return snapshot.items[productId]?.quantity ?? 0;
}

export function addCartItem(product: CartProduct, amount = 1) {
  const safeAmount = Math.max(1, Math.floor(amount));

  updateCartItems((items) => {
    const currentQuantity = items[product.id]?.quantity ?? 0;

    items[product.id] = {
      product,
      quantity: currentQuantity + safeAmount,
    };

    return items;
  });
}

export function incrementCartItem(product: CartProduct) {
  addCartItem(product, 1);
}

export function setCartItemQuantity(product: CartProduct, quantity: number) {
  const safeQuantity = Math.max(0, Math.floor(quantity));

  updateCartItems((items) => {
    if (safeQuantity <= 0) {
      delete items[product.id];
      return items;
    }

    items[product.id] = {
      product,
      quantity: safeQuantity,
    };

    return items;
  });
}

export function decrementCartItem(product: CartProduct) {
  const currentQuantity = readCartSnapshot().items[product.id]?.quantity ?? 0;

  setCartItemQuantity(product, currentQuantity - 1);
}

export function removeCartItem(productId: string) {
  updateCartItems((items) => {
    delete items[productId];
    return items;
  });
}
