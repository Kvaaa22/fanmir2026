import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

type HeaderProps = {
  className?: string;
};

type NavigationItem = {
  href: string;
  label: string;
  withArrow?: boolean;
};

const navigation: NavigationItem[] = [
  { href: "/#about", label: "О нас" },
  { href: "/#offers", label: "Каталог", withArrow: true },
  { href: "/#hero", label: "Услуги", withArrow: true },
  { href: "/prices", label: "Наши цены" },
  { href: "/#contacts", label: "Контакты" },
];

const phoneHref = "tel:+73912683233";
const phoneLabel = "+7 (391) 268-32-33";

export function Header({ className }: HeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className="container">
        <div className={styles.headerBar}>
          <Link className={styles.logoLink} href="/">
            <Image
              src="/img/logoFull.png"
              alt="Фанерный мир"
              height={48}
              priority
              width={61}
            />
          </Link>

          <nav aria-label="Основная навигация" className={styles.nav}>
            <NavigationLinks
              itemClassName={styles.navItem}
              linkClassName={styles.navLink}
              listClassName={styles.navList}
            />
          </nav>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Image
                src="/img/icons/clock-header.svg"
                alt=""
                height={20}
                width={20}
              />
              <span>9:00 - 17:00</span>
            </div>

            <a className={styles.metaPhone} href={phoneHref}>
              {phoneLabel}
            </a>

            <div className={`${styles.metaItem} ${styles.metaItemAddress}`}>
              <Image
                src="/img/icons/geo-header.svg"
                alt=""
                height={20}
                width={20}
              />
              <span className={styles.metaColumn}>
                <span className={styles.metaCity}>Красноярск</span>
                <span>Калинина 169, офис 1-05</span>
              </span>
            </div>
          </div>

          <div className={styles.mobileActions}>
            <a className={styles.mobilePhone} href={phoneHref}>
              {phoneLabel}
            </a>

            <details className={styles.mobileMenu}>
              <summary className={styles.mobileMenuButton}>
                <span className={styles.mobileMenuText}>Меню</span>
                <span />
                <span />
                <span />
              </summary>

              <div className={styles.mobileMenuPanel}>
                <nav aria-label="Мобильная навигация" className={styles.mobileNav}>
                  <NavigationLinks
                    itemClassName={styles.mobileNavItem}
                    linkClassName={styles.mobileNavLink}
                    listClassName={styles.mobileNavList}
                  />
                </nav>

                <div className={styles.mobileMeta}>
                  <div className={styles.mobileMetaItem}>
                    <Image
                      src="/img/icons/clock-header.svg"
                      alt=""
                      height={20}
                      width={20}
                    />
                    <span>Пн - Пт, 9:00 - 17:00</span>
                  </div>

                  <a className={styles.mobileMetaPhone} href={phoneHref}>
                    {phoneLabel}
                  </a>

                  <div
                    className={`${styles.mobileMetaItem} ${styles.mobileMetaAddress}`}
                  >
                    <Image
                      src="/img/icons/geo-header.svg"
                      alt=""
                      height={20}
                      width={20}
                    />
                    <span className={styles.metaColumn}>
                      <span className={styles.metaCity}>Красноярск</span>
                      <span>Калинина 169, офис 1-05</span>
                    </span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavigationLinks({
  itemClassName,
  linkClassName,
  listClassName,
}: {
  itemClassName: string;
  linkClassName: string;
  listClassName: string;
}) {
  return (
    <ul className={listClassName}>
      {navigation.map((item) => (
        <li className={itemClassName} key={item.label}>
          <Link className={linkClassName} href={item.href}>
            <span>{item.label}</span>
            {item.withArrow ? (
              <Image
                src="/img/icons/triang.svg"
                alt=""
                height={6}
                width={11}
              />
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
