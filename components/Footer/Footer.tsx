import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const links = [
  { href: "#about", label: "О нас" },
  { href: "#offers", label: "Каталог" },
  { href: "#offers", label: "Цены" },
  { href: "#hero", label: "Услуги" },
  { href: "#about", label: "Полезные материалы" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerInner}>
          <div className={styles.brandColumn}>
            <Link className={styles.logoLink} href="#hero">
              <Image
                src="/img/logoFull.png"
                alt="Фанерный мир"
                height={111}
                width={141}
              />
            </Link>
          </div>

          <div className={styles.linksColumn}>
            <h2 className={styles.columnTitle}>Категории</h2>
            <div className={styles.linksGrid}>
              {links.map((link) => (
                <Link className={styles.footerLink} href={link.href} key={link.label}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.contactsColumn}>
            <h2 className={styles.columnTitle}>Контакты</h2>
            <div className={styles.contactsGrid}>
              <div className={styles.contactsList}>
                <a href="tel:+73912683233">+7 (391) 268-32-33</a>
                <a href="tel:+73912683223">+7 (391) 268-32-23</a>
                <a href="mailto:fanmir24@yandex.ru">fanmir24@yandex.ru</a>
              </div>
              <div className={styles.contactsList}>
                <a href="tel:+79138325555">+7 (913) 832-55-55</a>
                <a href="tel:+79631915653">+7 (963) 191-56-53</a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <span>© 2023</span>
        </div>
      </div>
    </footer>
  );
}
