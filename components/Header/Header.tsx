import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

type HeaderProps = {
  className?: string;
};

const navigation = [
  { href: "about", label: "О нас" },
  { href: "catalogue", label: "Каталог", withArrow: true },
  { href: "#hero", label: "Услуги", withArrow: true },
  { href: "prices", label: "Наши цены" },
  { href: "#about", label: "Статьи" },
  { href: "#contacts", label: "Контакты" },
];

export function Header({ className }: HeaderProps) {
  return (
    <header className={[styles.header, className].filter(Boolean).join(" ")}>
      <div className="container">
        <div className={styles.headerBar}>
          <Link className={styles.logoLink} href="">
            <Image
              src="/img/logoFull.png"
              alt="Фанерный мир"
              height={48}
              priority
              width={61}
            />
          </Link>

          <nav aria-label="Основная навигация" className={styles.nav}>
            <ul className={styles.navList}>
              {navigation.map((item) => (
                <li className={styles.navItem} key={item.label}>
                  <Link className={styles.navLink} href={item.href}>
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

            <a className={styles.metaPhone} href="tel:+73912683233">
              +7 (391) 268-32-33
            </a>

            <div className={`${styles.metaItem} ${styles.metaItemAddress}`}>
              <Image
                src="/img/icons/geo-header.svg"
                alt=""
                height={20}
                width={20}
              />
              <span className={`${styles.metaColumn}`}>
                <span className={styles.metaCity}>Красноярск</span>
                <span>Калинина 169, офис 1-05</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
