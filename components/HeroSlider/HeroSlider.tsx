'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";

type HeroSlide = {
  badges: [string, string];
  id: string;
  imageAlt: string;
  lead: string;
  title: string;
};

const heroSlides: HeroSlide[] = [
  {
    id: "cutting",
    title: "Резка по вашим размерам",
    badges: ["оперативно", "недорого"],
    lead: "Раскрой в день заказа на форматно-раскроечном станке",
    imageAlt: "Форматный раскрой фанеры",
  },
  {
    id: "delivery",
    title: "Фанера и листовые материалы в наличии",
    badges: ["со склада", "с доставкой"],
    lead: "Подберем нужный формат и быстро отгрузим заказ по Красноярску",
    imageAlt: "Листовые материалы на складе",
  },
  {
    id: "catalogue",
    title: "Помогаем подобрать материал под задачу",
    badges: ["подскажем", "подберем"],
    lead: "Березовая, хвойная, ламинированная фанера, OSB, ДСП и ДВП в одном месте",
    imageAlt: "Ассортимент фанеры и листовых материалов",
  },
];

export function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const lastSlideIndex = heroSlides.length - 1;

  const showPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? lastSlideIndex : currentSlide - 1,
    );
  };

  const showNextSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === lastSlideIndex ? 0 : currentSlide + 1,
    );
  };

  return (
    <div className={styles.heroContent}>
      <button
        aria-label="Предыдущий слайд"
        className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
        onClick={showPreviousSlide}
        type="button"
      >
        <ArrowIcon />
      </button>

      <div
        aria-atomic="true"
        aria-live="polite"
        className={styles.heroViewport}
      >
        <div
          className={styles.heroTrack}
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
        >
          {heroSlides.map((slide, index) => (
            <div
              aria-hidden={index !== activeSlide}
              className={styles.heroSlide}
              key={slide.id}
            >
              <div className={styles.heroCopy}>
                <h1 className={styles.heroTitle}>
                  {slide.id === "cutting" ? (
                    <>
                      {"Резка\u00A0по\u00A0вашим"}
                      <br />
                      размерам
                    </>
                  ) : (
                    slide.title
                  )}
                </h1>

                <div className={styles.heroBadges}>
                  <span className={styles.heroBadge}>{slide.badges[0]}</span>
                  <span
                    className={`${styles.heroBadge} ${styles.heroBadgeDark}`}
                  >
                    {slide.badges[1]}
                  </span>
                </div>

                <p className={styles.heroLead}>
                  {slide.id === "cutting" ? (
                    <>
                      Раскрой в день заказа на форматно-
                      <br />
                      раскроечном станке
                    </>
                  ) : (
                    slide.lead
                  )}
                </p>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.heroVisualMain}>
                  <Image
                    alt={slide.imageAlt}
                    fill
                    preload={index === 0}
                    sizes="(max-width: 1366px) 48vw, 640px"
                    src="/img/hero/cutting.webp"
                  />
                </div>

                <div className={styles.heroVisualAccent}>
                  <Image
                    alt=""
                    fill
                    sizes="180px"
                    src="/img/hero/wood-circle.webp"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        aria-label="Следующий слайд"
        className={`${styles.heroArrow} ${styles.heroArrowRight}`}
        onClick={showNextSlide}
        type="button"
      >
        <ArrowIcon />
      </button>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="34"
      viewBox="0 0 18 34"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.1609 0.857178L1.22515 15.7929C1.10899 15.9019 1.01641 16.0336 0.953119 16.1798C0.88983 16.326 0.857178 16.4836 0.857178 16.6429C0.857178 16.8022 0.88983 16.9598 0.953119 17.106C1.01641 17.2522 1.10899 17.3839 1.22515 17.4929L16.1609 32.4286"
        stroke="black"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.71429"
      />
    </svg>
  );
}
