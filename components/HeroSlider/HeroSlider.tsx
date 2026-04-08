'use client';

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";

type HeroSlide = {
  title: string;
  badges: [string, string];
  lead: string;
  imageAlt: string;
};

const baseSlide: HeroSlide = {
  title: "Резка по вашим размерам",
  badges: ["оперативно", "недорого"],
  lead: "Раскрой в день заказа на форматно-раскроечном станке",
  imageAlt: "Форматный раскрой фанеры",
};

const heroSlides = Array.from({ length: 2 }, (_, index) => ({
  ...baseSlide,
  id: index,
}));

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
        <ArrowIcon direction="left" />
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
          {heroSlides.map((slide) => (
            <div
              aria-hidden={slide.id !== activeSlide}
              className={styles.heroSlide}
              key={slide.id}
            >
              <div className={styles.heroCopy}>
                <h1 className={styles.heroTitle}>{slide.title}</h1>

                <div className={styles.heroBadges}>
                  <span className={styles.heroBadge}>{slide.badges[0]}</span>
                  <span
                    className={`${styles.heroBadge} ${styles.heroBadgeDark}`}
                  >
                    {slide.badges[1]}
                  </span>
                </div>

                <p className={styles.heroLead}>{slide.lead}</p>
              </div>

              <div className={styles.heroVisual}>
                <div className={styles.heroVisualMain}>
                  <Image
                    alt={slide.imageAlt}
                    fill
                    priority={slide.id === 0}
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
        <ArrowIcon direction="right" />
      </button>
    </div>
  );
}

function ArrowIcon({
  direction,
}: {
  direction: "left" | "right";
}) {
  return (
    <svg
      aria-hidden="true"
      className={direction === "left" ? styles.arrowLeft : undefined}
      fill="none"
      height="26"
      viewBox="0 0 26 26"
      width="26"
    >
      <path
        d="M16.5 4.5L8.5 13L16.5 21.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
