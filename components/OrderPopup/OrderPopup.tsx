"use client";

import { FormEvent, useState } from "react";
import type { CartItem } from "@/lib/cart/cartTypes";
import styles from "@/components/CallbackPopup/CallbackPopup.module.css";

type OrderPopupProps = {
  cartItems: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  totalPrice: number;
};

function getProductTitle(item: CartItem) {
  return [item.product.titleLineOne, item.product.titleLineTwo].filter(Boolean).join(" ");
}

export function OrderPopup({ cartItems, isOpen, onClose, totalPrice }: OrderPopupProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormReady =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    isEmailValid &&
    isAccepted &&
    cartItems.length > 0 &&
    !isSubmitting;

  const handleClose = () => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormReady) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const response = await fetch("/api/order-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: {
          email: email.trim(),
          name: name.trim(),
          phone: phone.trim(),
        },
        items: cartItems.map((item) => ({
          id: item.product.id,
          meta: item.product.meta,
          price: item.product.price,
          pricePerM2: item.product.pricePerM2,
          quantity: item.quantity,
          title: getProductTitle(item),
          unitPriceRub: item.product.unitPriceRub,
        })),
        totalPrice,
      }),
    });

    const result = (await response.json().catch(() => null)) as {
      message?: string;
      ok?: boolean;
    } | null;

    setIsSubmitting(false);

    if (!response.ok || !result?.ok) {
      setErrorMessage(result?.message ?? "Не удалось отправить заказ. Попробуйте еще раз.");
      return;
    }

    setIsSubmitted(true);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <aside className={styles.popup} aria-label="Оформление заказа">
        <button className={styles.closeButton} type="button" aria-label="Закрыть" onClick={handleClose} />

        {isSubmitted ? (
          <div className={styles.successState}>
            <h2 className={styles.title}>Заказ отправлен</h2>
            <p className={styles.copy}>Мы получили ваши контакты и состав заказа. Менеджер свяжется с вами для уточнения деталей.</p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <header className={styles.header}>
              <h2 className={styles.title}>Оформление заказа</h2>
              <p className={styles.copy}>
                Оставьте ваши контакты, и в ближайшее время вам позвонит менеджер для уточнения деталей заказа
              </p>
            </header>

            <div className={styles.fields}>
              <input
                className={styles.input}
                name="name"
                placeholder="Имя*"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />

              <input
                className={styles.input}
                name="phone"
                placeholder="Ваш номер телефона*"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />

              <input
                className={styles.input}
                name="email"
                placeholder="e-mail*"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <button className={styles.submitButton} disabled={!isFormReady} type="submit">
              {isSubmitting ? "Отправляем..." : "Оформить заказ"}
            </button>

            {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

            <p className={styles.requiredNote}>
              <span>*</span> - поле, обязательное для заполнения
            </p>

            <button
              aria-pressed={isAccepted}
              className={styles.acceptance}
              type="button"
              onClick={() => setIsAccepted((currentValue) => !currentValue)}
            >
              <span
                className={[styles.checkbox, isAccepted ? styles.checkboxChecked : null]
                  .filter(Boolean)
                  .join(" ")}
                aria-hidden="true"
              />
              <span>
                Я принимаю <span className={styles.acceptanceLink}>Условия пользования</span> &{" "}
                <span className={styles.acceptanceLink}>Политика конфиденциальности</span>.
              </span>
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
