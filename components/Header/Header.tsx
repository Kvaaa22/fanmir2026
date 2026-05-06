"use client";

import type { Dispatch, SetStateAction } from "react";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

type HeaderProps = {
  className?: string;
};

type NavigationItem = {
  id: string;
  href: string;
  label: string;
  withArrow?: boolean;
  children?: NavigationChild[];
};

type NavigationChild = {
  label: string;
};

const navigation: NavigationItem[] = [
  { id: "about", href: "#", label: "О нас" },
  {
    id: "catalog",
    href: "/catalogue",
    label: "Каталог",
    withArrow: true,
    children: [
      { label: "Фанера березовая" },
      { label: "Фанера хвойная" },
      {
        label: "Фанера ламинированная",
      },
      { label: "Плиты OSB-3 (ОСП)" },
      { label: "ДВП и ДСП" },
      { label: "PLYDEX" },
    ],
  },
  {
    id: "services",
    href: "#",
    label: "Услуги",
    withArrow: true,
    children: [
      { label: "Доставка и оплата" },
      { label: "Распил" },
    ],
  },
  { id: "prices", href: "#", label: "Наши цены" },
  { id: "contacts", href: "/#contacts", label: "Контакты" },
];

const phoneHref = "tel:+73912683233";
const phoneLabel = "+7 (391) 268-32-33";
const callOrderLabel = "Заказать звонок";

export function Header({ className }: HeaderProps) {
  const menuRef = useRef<HTMLDetailsElement>(null);
  const [openDesktopGroupId, setOpenDesktopGroupId] = useState<string | null>(null);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const closeMobileMenu = () => {
    if (menuRef.current) {
      menuRef.current.open = false;
    }

    setOpenGroupId(null);
  };

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
            <DesktopNavigationLinks
              itemClassName={styles.navItem}
              linkClassName={styles.navLink}
              listClassName={styles.navList}
              openGroupId={openDesktopGroupId}
              setOpenGroupId={setOpenDesktopGroupId}
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
            <div className={styles.mobileQuickInfo}>
              <span className={styles.mobileQuickTime}>9:00 - 17:00</span>
              <a className={styles.mobileQuickPhone} href={phoneHref}>
                {phoneLabel}
              </a>
            </div>

            <details className={styles.mobileMenu} ref={menuRef}>
              <summary className={styles.mobileMenuButton}>
                <span className={styles.mobileMenuText}>Меню</span>
                <span />
                <span />
                <span />
              </summary>

              <div className={styles.mobileMenuPanel}>
                <div className={styles.mobileMenuHead}>
                  <Link
                    aria-label="На главную"
                    className={styles.mobileMenuBrand}
                    href="/"
                    onClick={closeMobileMenu}
                  >
                    <Image
                      src="/img/logoFull.png"
                      alt="Фанерный мир"
                      height={36}
                      width={45}
                    />
                  </Link>
                  <span className={styles.mobileMenuTitle}>Меню</span>
                </div>

                <nav aria-label="Мобильная навигация" className={styles.mobileNav}>
                  <MobileNavigationLinks
                    closeMobileMenu={closeMobileMenu}
                    openGroupId={openGroupId}
                    setOpenGroupId={setOpenGroupId}
                  />
                </nav>

                <div className={styles.mobileMeta}>
                  <a
                    className={styles.mobileMetaPhone}
                    href={phoneHref}
                    onClick={closeMobileMenu}
                  >
                    {phoneLabel}
                  </a>

                  <div className={styles.mobileMetaSchedule}>
                    <Image
                      src="/img/icons/clock-header.svg"
                      alt=""
                      height={16}
                      width={16}
                    />
                    <span>9:00 - 17:00</span>
                  </div>

                  <div className={styles.mobileMetaAddress}>
                    Красноярск, Калинина 169, офис 1-05
                  </div>

                  <a
                    className={styles.mobileCallButton}
                    href={phoneHref}
                    onClick={closeMobileMenu}
                  >
                    {callOrderLabel}
                  </a>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

function DesktopNavigationLinks({
  itemClassName,
  linkClassName,
  listClassName,
  openGroupId,
  setOpenGroupId,
}: {
  itemClassName: string;
  linkClassName: string;
  listClassName: string;
  openGroupId: string | null;
  setOpenGroupId: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <ul className={listClassName}>
      {navigation.map((item) => {
        const isGroupOpen = openGroupId === item.id;

        return (
          <li
            className={[itemClassName, isGroupOpen ? styles.navItemOpen : ""]
              .filter(Boolean)
              .join(" ")}
            key={item.label}
          >
            <Link
              className={linkClassName}
              href={item.href}
              onClick={() => setOpenGroupId(null)}
            >
              <span>{item.label}</span>
            </Link>

            {item.withArrow && item.children ? (
              <>
                <button
                  aria-expanded={isGroupOpen}
                  aria-label={`Открыть раздел ${item.label}`}
                  className={styles.navArrowButton}
                  onClick={() =>
                    setOpenGroupId((currentId) =>
                      currentId === item.id ? null : item.id,
                    )
                  }
                  type="button"
                >
                  <Image
                    src="/img/icons/triang.svg"
                    alt=""
                    height={6}
                    width={11}
                  />
                </button>

                <div className={styles.desktopSubmenu}>
                  {item.children.map((child) => (
                    <button
                      className={styles.desktopSubmenuButton}
                      key={child.label}
                      type="button"
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function MobileNavigationLinks({
  closeMobileMenu,
  openGroupId,
  setOpenGroupId,
}: {
  closeMobileMenu: () => void;
  openGroupId: string | null;
  setOpenGroupId: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <ul className={styles.mobileNavList}>
      {navigation.map((item) => {
        const isGroupOpen = openGroupId === item.id;

        return (
          <li className={styles.mobileNavItem} key={item.id}>
            {item.withArrow && item.children ? (
              <>
                <div
                  className={styles.mobileNavEntry}
                >
                  <Link
                    className={styles.mobileNavLink}
                    href={item.href}
                    onClick={closeMobileMenu}
                  >
                    <span>{item.label}</span>
                  </Link>

                  <button
                    aria-expanded={isGroupOpen}
                    aria-label={`Открыть раздел ${item.label}`}
                    className={styles.mobileNavToggle}
                    onClick={() =>
                      setOpenGroupId((currentId) =>
                        currentId === item.id ? null : item.id,
                      )
                    }
                    type="button"
                  />
                </div>

                {isGroupOpen ? (
                  <div className={styles.mobileSubmenu}>
                    {item.children.map((child) => {
                      return (
                        <div className={styles.mobileSubmenuItem} key={child.label}>
                          <button
                            className={styles.mobileSubmenuLink}
                            type="button"
                          >
                            {child.label}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </>
            ) : (
              <Link
                className={styles.mobileNavStandalone}
                href={item.href}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
