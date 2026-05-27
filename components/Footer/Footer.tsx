import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";

type ContactKind = "phone" | "email";

type ContactItem = {
  href: string;
  kind: ContactKind;
  label: string;
};

const categoryColumns = [
  [
    { href: "/about", label: "О нас" },
    { href: "/catalog", label: "Каталог" },
    { href: "/prices", label: "Наши цены" },
  ],
  [
    { href: "/services?tab=delivery", label: "Услуги" },
    { href: "/#contacts", label: "Контакты" },
  ],
];

const contactIcons: Record<ContactKind, { height: number; src: string; width: number }> = {
  phone: {
    src: "/img/footer/phoneFooter.svg",
    width: 32,
    height: 32,
  },
  email: {
    src: "/img/footer/mailFooter.svg",
    width: 30,
    height: 30,
  },
};

const contactsColumns: ContactItem[][] = [
  [
    { href: "tel:+73912683233", kind: "phone", label: "+7 (391) 268-32-33" },
    { href: "tel:+73912683223", kind: "phone", label: "+7 (391) 268-32-23" },
    { href: "mailto:fanmir24@yandex.ru", kind: "email", label: "fanmir24@yandex.ru" },
  ],
  [
    { href: "tel:+73912220796", kind: "phone", label: "+7 (391) 222-07-96" },
    { href: "tel:+79631915653", kind: "phone", label: "+7 (963) 191-56-53" },
  ],
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.frame}>
        <div className={styles.footerInner}>
          <div className={styles.brandBlock}>
            <Link className={styles.logoLink} href="/" aria-label="На главную">
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
                    <a
                      className={`${styles.textItem} ${styles.contactItem} ${item.kind === "email" ? styles.inlineEmailItem : ""}`}
                      href={item.href}
                      key={item.label}
                    >
                      <span className={styles.contactIcon} aria-hidden>
                        <Image
                          src={contactIcons[item.kind].src}
                          alt=""
                          width={contactIcons[item.kind].width}
                          height={contactIcons[item.kind].height}
                        />
                      </span>
                      <span className={styles.contactText}>{item.label}</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
            <a className={`${styles.textItem} ${styles.contactItem} ${styles.mobileEmailItem}`} href="mailto:fanmir24@yandex.ru">
              <span className={styles.contactIcon} aria-hidden>
                <Image
                  src={contactIcons.email.src}
                  alt=""
                  width={contactIcons.email.width}
                  height={contactIcons.email.height}
                />
              </span>
              <span className={styles.contactText}>fanmir24@yandex.ru</span>
            </a>
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
 
