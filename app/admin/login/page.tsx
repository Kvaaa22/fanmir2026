import styles from "./page.module.css";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const error = (await searchParams).error;
  const errorMessage =
    error === "rate-limit"
      ? "Слишком много попыток входа. Попробуйте чуть позже."
      : error === "1"
        ? "Неверный логин или пароль."
        : "";

  return (
    <main className={styles.page}>
      <form action="/api/admin/login" className={styles.form} method="post">
        <h1 className={styles.title}>Вход в админку</h1>

        <label className={styles.field}>
          <span>Логин</span>
          <input autoComplete="username" name="login" required type="text" />
        </label>

        <label className={styles.field}>
          <span>Пароль</span>
          <input autoComplete="current-password" name="password" required type="password" />
        </label>

        {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

        <button className={styles.button} type="submit">
          Войти
        </button>
      </form>
    </main>
  );
}
