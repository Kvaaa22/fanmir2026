"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./CallbackPopup.module.css";

const POPUP_DELAY_MS = 10000;

export function CallbackPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const pathname = usePathname();

  const isFormReady = name.trim().length > 0 && phone.trim().length > 0 && isAccepted;

  useEffect(() => {
    if (pathname.startsWith("/cart")) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      setIsVisible(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [pathname]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormReady) {
      return;
    }

    setIsSubmitted(true);
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
        onClick={() => setIsVisible(false)}
      />

      {isSubmitted ? (
        <div className={styles.successState}>
          <h2 className={styles.title}>Спасибо!</h2>
          <p className={styles.copy}>Заявка принята. В ближайшее время с вами свяжется менеджер.</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <header className={styles.header}>
            <h2 className={styles.title}>Есть вопросы?</h2>
            <p className={styles.copy}>В ближайшее время с вами свяжется наш менеджер</p>
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
          </div>

          <button className={styles.submitButton} disabled={!isFormReady} type="submit">
            Перезвоните мне
          </button>

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
