"use client";

import { FormEvent, useState } from "react";
import type { CartItem } from "@/lib/cart/cartTypes";
import { hasHtmlInput, htmlInputError } from "@/lib/validation/plainText";
import styles from "@/components/CallbackPopup/CallbackPopup.module.css";

type OrderPopupProps = {
  cartItems: CartItem[];
  isOpen: boolean;
  onClose: () => void;
};

type OrderFormErrors = {
  acceptance?: string;
  cart?: string;
  email?: string;
  name?: string;
  phone?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function validateOrderForm({
  cartItems,
  email,
  isAccepted,
  name,
  phone,
}: {
  cartItems: CartItem[];
  email: string;
  isAccepted: boolean;
  name: string;
  phone: string;
}) {
  const errors: OrderFormErrors = {};

  if (name.trim().length === 0) {
    errors.name = "Введите имя.";
  } else if (hasHtmlInput(name)) {
    errors.name = htmlInputError;
  } else if (name.trim().length < 2) {
    errors.name = "Имя должно быть не короче 2 символов.";
  }

  if (phone.trim().length === 0) {
    errors.phone = "Введите номер телефона.";
  } else if (getPhoneDigits(phone).length < 10) {
    errors.phone = "Введите телефон полностью.";
  }

  if (email.trim().length === 0) {
    errors.email = "Введите e-mail.";
  } else if (hasHtmlInput(email)) {
    errors.email = htmlInputError;
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Введите корректный e-mail.";
  }

  if (!isAccepted) {
    errors.acceptance = "Нужно принять условия перед оформлением заказа.";
  }

  if (cartItems.length === 0) {
    errors.cart = "В корзине нет товаров.";
  }

  return errors;
}

export function OrderPopup({ cartItems, isOpen, onClose }: OrderPopupProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<OrderFormErrors>({});

  const handleClose = () => {
    setIsSubmitting(false);
    setIsSubmitted(false);
    setErrorMessage("");
    setFormErrors({});
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateOrderForm({ cartItems, email, isAccepted, name, phone });
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
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
            quantity: item.quantity,
          })),
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        message?: string;
        ok?: boolean;
      } | null;

      if (!response.ok || !result?.ok) {
        setErrorMessage(result?.message ?? "Не удалось отправить заказ. Попробуйте еще раз.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setErrorMessage("Не удалось отправить заказ. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
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
          <form className={styles.form} noValidate onSubmit={handleSubmit}>
            <header className={styles.header}>
              <h2 className={styles.title}>Оформление заказа</h2>
              <p className={styles.copy}>
                Оставьте ваши контакты, и в ближайшее время вам позвонит менеджер для уточнения деталей заказа
              </p>
            </header>

            <div className={styles.fields}>
              <input
                aria-describedby={formErrors.name ? "order-name-error" : undefined}
                aria-invalid={formErrors.name ? "true" : "false"}
                className={[styles.input, formErrors.name ? styles.inputInvalid : null]
                  .filter(Boolean)
                  .join(" ")}
                name="name"
                maxLength={80}
                placeholder="Имя*"
                type="text"
                value={name}
                onChange={(event) => {
                  const nextName = event.target.value;
                  setName(nextName);
                  setFormErrors((currentErrors) => ({
                    ...currentErrors,
                    name: hasHtmlInput(nextName) ? htmlInputError : undefined,
                  }));
                }}
              />
              {formErrors.name ? (
                <p className={styles.fieldError} id="order-name-error">
                  {formErrors.name}
                </p>
              ) : null}

              <input
                aria-describedby={formErrors.phone ? "order-phone-error" : undefined}
                aria-invalid={formErrors.phone ? "true" : "false"}
                className={[styles.input, formErrors.phone ? styles.inputInvalid : null]
                  .filter(Boolean)
                  .join(" ")}
                name="phone"
                inputMode="numeric"
                maxLength={40}
                pattern="[0-9]*"
                placeholder="Ваш номер телефона*"
                type="tel"
                value={phone}
                onChange={(event) => {
                  setPhone(getPhoneDigits(event.target.value));
                  setFormErrors((currentErrors) => ({ ...currentErrors, phone: undefined }));
                }}
              />
              {formErrors.phone ? (
                <p className={styles.fieldError} id="order-phone-error">
                  {formErrors.phone}
                </p>
              ) : null}

              <input
                aria-describedby={formErrors.email ? "order-email-error" : undefined}
                aria-invalid={formErrors.email ? "true" : "false"}
                className={[styles.input, formErrors.email ? styles.inputInvalid : null]
                  .filter(Boolean)
                  .join(" ")}
                name="email"
                maxLength={160}
                placeholder="e-mail*"
                type="email"
                value={email}
                onChange={(event) => {
                  const nextEmail = event.target.value;
                  setEmail(nextEmail);
                  setFormErrors((currentErrors) => ({
                    ...currentErrors,
                    email: hasHtmlInput(nextEmail) ? htmlInputError : undefined,
                  }));
                }}
              />
              {formErrors.email ? (
                <p className={styles.fieldError} id="order-email-error">
                  {formErrors.email}
                </p>
              ) : null}
            </div>

            {formErrors.cart ? <p className={styles.errorMessage}>{formErrors.cart}</p> : null}

            <button
              className={styles.submitButton}
              disabled={isSubmitting || cartItems.length === 0}
              type="submit"
            >
              {isSubmitting ? "Отправляем..." : "Оформить заказ"}
            </button>

            {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

            <p className={styles.requiredNote}>
              <span>*</span> - поле, обязательное для заполнения
            </p>

            <button
              aria-describedby={formErrors.acceptance ? "order-acceptance-error" : undefined}
              aria-pressed={isAccepted}
              className={[
                styles.acceptance,
                formErrors.acceptance ? styles.acceptanceInvalid : null,
              ]
                .filter(Boolean)
                .join(" ")}
              type="button"
              onClick={() => {
                setIsAccepted((currentValue) => !currentValue);
                setFormErrors((currentErrors) => ({ ...currentErrors, acceptance: undefined }));
              }}
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
            {formErrors.acceptance ? (
              <p className={styles.fieldError} id="order-acceptance-error">
                {formErrors.acceptance}
              </p>
            ) : null}
          </form>
        )}
      </aside>
    </div>
  );
}
