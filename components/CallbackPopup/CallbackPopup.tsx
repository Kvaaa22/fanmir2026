"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./CallbackPopup.module.css";

const POPUP_DELAY_MS = 10000;

type CallbackFormErrors = {
  acceptance?: string;
  name?: string;
  phone?: string;
};

function getPhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

function validateCallbackForm({
  isAccepted,
  name,
  phone,
}: {
  isAccepted: boolean;
  name: string;
  phone: string;
}) {
  const errors: CallbackFormErrors = {};

  if (name.trim().length === 0) {
    errors.name = "Введите имя.";
  } else if (name.trim().length < 2) {
    errors.name = "Имя должно быть не короче 2 символов.";
  }

  if (phone.trim().length === 0) {
    errors.phone = "Введите номер телефона.";
  } else if (getPhoneDigits(phone).length < 10) {
    errors.phone = "Введите телефон полностью.";
  }

  if (!isAccepted) {
    errors.acceptance = "Нужно принять условия перед отправкой.";
  }

  return errors;
}

export function CallbackPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<CallbackFormErrors>({});
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/cart")) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setIsVisible(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [pathname]);

  const handleClose = () => {
    setIsVisible(false);
    setIsSubmitting(false);
    setIsSubmitted(false);
    setErrorMessage("");
    setFormErrors({});
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCallbackForm({ isAccepted, name, phone });
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/callback-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        message?: string;
        ok?: boolean;
      } | null;

      if (!response.ok || !result?.ok) {
        setErrorMessage(result?.message ?? "Не удалось отправить заявку. Попробуйте еще раз.");
        return;
      }

      setIsSubmitted(true);
    } catch {
      setErrorMessage("Не удалось отправить заявку. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <aside className={styles.popup} aria-label="Форма обратного звонка">
      <button
        className={styles.closeButton}
        type="button"
        aria-label="Закрыть"
        onClick={handleClose}
      />

      {isSubmitted ? (
        <div className={styles.successState}>
          <h2 className={styles.title}>Спасибо!</h2>
          <p className={styles.copy}>Заявка принята. В ближайшее время с вами свяжется менеджер.</p>
        </div>
      ) : (
        <form className={styles.form} noValidate onSubmit={handleSubmit}>
          <header className={styles.header}>
            <h2 className={styles.title}>Есть вопросы?</h2>
            <p className={styles.copy}>В ближайшее время с вами свяжется наш менеджер</p>
          </header>

          <div className={styles.fields}>
            <input
              aria-describedby={formErrors.name ? "callback-name-error" : undefined}
              aria-invalid={formErrors.name ? "true" : "false"}
              className={[styles.input, formErrors.name ? styles.inputInvalid : null]
                .filter(Boolean)
                .join(" ")}
              name="name"
              placeholder="Имя*"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setFormErrors((currentErrors) => ({ ...currentErrors, name: undefined }));
              }}
            />
            {formErrors.name ? (
              <p className={styles.fieldError} id="callback-name-error">
                {formErrors.name}
              </p>
            ) : null}

            <input
              aria-describedby={formErrors.phone ? "callback-phone-error" : undefined}
              aria-invalid={formErrors.phone ? "true" : "false"}
              className={[styles.input, formErrors.phone ? styles.inputInvalid : null]
                .filter(Boolean)
                .join(" ")}
              name="phone"
              inputMode="numeric"
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
              <p className={styles.fieldError} id="callback-phone-error">
                {formErrors.phone}
              </p>
            ) : null}
          </div>

          <button className={styles.submitButton} disabled={isSubmitting} type="submit">
            {isSubmitting ? "Отправляем..." : "Перезвоните мне"}
          </button>

          {errorMessage ? <p className={styles.errorMessage}>{errorMessage}</p> : null}

          <p className={styles.requiredNote}>
            <span>*</span> - поле, обязательное для заполнения
          </p>

          <button
            aria-describedby={formErrors.acceptance ? "callback-acceptance-error" : undefined}
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
            <p className={styles.fieldError} id="callback-acceptance-error">
              {formErrors.acceptance}
            </p>
          ) : null}
        </form>
      )}
      </aside>
    </div>
  );
}
