import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

const categoryColumns = [
  [
    { href: "#about", label: "О нас" },
    { href: "#offers", label: "Каталог" },
    { href: "#offers", label: "Цены" },
  ],
  [
    { href: "#hero", label: "Услуги" },
    { href: "#about", label: "Полезные материалы" },
  ],
];

const contactsColumns = [
  [
    { href: "tel:+73912683233", label: "+7 (391) 268-32-33" },
    { href: "tel:+73912683223", label: "+7 (391) 268-32-23" },
    { href: "mailto:fanmir24@yandex.ru", label: "fanmir24@yandex.ru" },
  ],
  [
    { href: "tel:+79138325555", label: "+7 (913) 832-55-55" },
    { href: "tel:+79631915653", label: "+7 (963) 191-56-53" },
  ],
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.frame}>
        <div className={styles.footerInner}>
          <div className={styles.brandBlock}>
            <Link className={styles.logoLink} href="#hero" aria-label="На главную">
              <Image
                src="/img/advantages/aboutLogo.svg"
                alt="Фанерный мир"
                width={168}
                height={132}
              />
            </Link>
          </div>

          <div className={styles.categoriesBlock}>
            <h2 className={styles.blockTitle}>Категории</h2>
            <div className={styles.columnsGrid}>
              {categoryColumns.map((column, index) => (
                <div className={styles.textColumn} key={`category-column-${index}`}>
                  {column.map((item) => (
                    <Link className={styles.textItem} href={item.href} key={item.label}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.contactsBlock}>
            <h2 className={styles.blockTitle}>Контакты</h2>
            <div className={styles.columnsGrid}>
              {contactsColumns.map((column, index) => (
                <div className={styles.textColumn} key={`contact-column-${index}`}>
                  {column.map((item) => (
                    <a className={styles.textItem} href={item.href} key={item.label}>
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <span className={styles.separator} aria-hidden />

        <div className={styles.bottomBar}>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}
