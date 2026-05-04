'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "@/app/page.module.css";

type HeroSlide = {
  id: "cutting" | "inStock" | "help";
  imageAlt: string;
};

const AUTO_SWITCH_MS = 5000;
const AUTO_SWITCH_ENABLED = true;

const heroSlides: HeroSlide[] = [
  {
    id: "cutting",
    imageAlt: "Форматный раскрой фанеры",
  },
  {
    id: "inStock",
    imageAlt: "Фанера и листовые материалы в наличии",
  },
  {
    id: "help",
    imageAlt: "Помощь в подборе материалов",
  },
];

export function HeroSlider() {
  const slideCount = heroSlides.length;
  const loopSlides = useMemo(
    () => [heroSlides[slideCount - 1], ...heroSlides, heroSlides[0]],
    [slideCount],
  );
  const [trackIndex, setTrackIndex] = useState(1);
  const [isTrackAnimated, setIsTrackAnimated] = useState(true);
  const isTransitioningRef = useRef(false);
  const autoTimerRef = useRef<number | null>(null);

  const showNextSlide = useCallback(() => {
    if (isTransitioningRef.current) {
      return;
    }

    isTransitioningRef.current = true;
    setIsTrackAnimated(true);
    setTrackIndex((currentIndex) => Math.min(currentIndex + 1, slideCount + 1));
  }, [slideCount]);

  const showPrevSlide = useCallback(() => {
    if (isTransitioningRef.current) {
      return;
    }

    isTransitioningRef.current = true;
    setIsTrackAnimated(true);
    setTrackIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  }, []);

  const restartAutoSwitchTimer = useCallback(() => {
    if (autoTimerRef.current !== null) {
      window.clearInterval(autoTimerRef.current);
    }

    if (!AUTO_SWITCH_ENABLED) {
      return;
    }

    autoTimerRef.current = window.setInterval(() => {
      showNextSlide();
    }, AUTO_SWITCH_MS);
  }, [showNextSlide]);

  useEffect(() => {
    restartAutoSwitchTimer();

    return () => {
      if (autoTimerRef.current !== null) {
        window.clearInterval(autoTimerRef.current);
      }
    };
  }, [restartAutoSwitchTimer]);

  const handleArrowClick = (direction: "prev" | "next") => {
    if (direction === "prev") {
      showPrevSlide();
    } else {
      showNextSlide();
    }

    restartAutoSwitchTimer();
  };

  const handleTrackTransitionEnd = () => {
    if (!isTransitioningRef.current) {
      return;
    }

    if (trackIndex === slideCount + 1) {
      setIsTrackAnimated(false);
      setTrackIndex(1);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsTrackAnimated(true);
          isTransitioningRef.current = false;
        });
      });
      return;
    }

    if (trackIndex === 0) {
      setIsTrackAnimated(false);
      setTrackIndex(slideCount);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsTrackAnimated(true);
          isTransitioningRef.current = false;
        });
      });
      return;
    }

    isTransitioningRef.current = false;
  };

  const activeRealSlideIndex =
    trackIndex === 0
      ? slideCount - 1
      : trackIndex === slideCount + 1
        ? 0
        : trackIndex - 1;

  return (
    <div className={styles.heroContent}>
      <button
        aria-label="Предыдущий слайд"
        className={`${styles.heroArrow} ${styles.heroArrowLeft}`}
        onClick={() => handleArrowClick("prev")}
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
          className={`${styles.heroTrack} ${!isTrackAnimated ? styles.heroTrackNoTransition : ""}`}
          onTransitionEnd={handleTrackTransitionEnd}
          style={{ transform: `translateX(-${trackIndex * 100}%)` }}
        >
          {loopSlides.map((slide, index) => {
            const isVisible = index === trackIndex;
            const isActiveRealSlide =
              isVisible && index > 0 && index <= slideCount;

            return (
              <div
                aria-hidden={!isVisible}
                className={`${styles.heroSlide} ${slide.id === "cutting" ? styles.heroSlideCutting : ""} ${slide.id === "inStock" ? styles.heroSlideInStock : ""} ${slide.id === "help" ? styles.heroSlideHelp : ""}`}
                key={`${slide.id}-${index}`}
              >
                {slide.id === "cutting" ? (
                  <>
                    <div
                      aria-hidden="true"
                      className={styles.heroCuttingBackground}
                    />

                    <div
                      className={`${styles.heroCopy} ${styles.heroDesktopTextBase}`}
                    >
                      <h1 className={`${styles.heroTitle} ${styles.heroSlideHeadingBase}`}>
                        <span className={styles.heroTitleText}>
                          {"Резка\u00A0по\u00A0вашим "}
                          <br />
                          {" "}
                          размерам
                        </span>
                      </h1>

                      <div className={styles.heroBadges}>
                        <span className={styles.heroBadge}>оперативно</span>
                        <span
                          className={`${styles.heroBadge} ${styles.heroBadgeDark}`}
                        >
                          недорого
                        </span>
                      </div>

                      <p className={`${styles.heroLead} ${styles.heroSlideLeadBase}`}>
                        <span className={styles.heroLeadText}>
                          Раскрой в день заказа на форматно-
                          <br />
                          раскроечном станке
                        </span>
                      </p>
                    </div>

                    <div className={styles.heroVisual}>
                      <div className={styles.heroVisualMain}>
                        <Image
                          alt={slide.imageAlt}
                          fill
                          preload={index === 1}
                          quality={95}
                          sizes="(max-width: 899px) 360px, (max-width: 1099px) 460px, (max-width: 1299px) 520px, 583px"
                          src="/img/hero/cutting.webp"
                        />
                      </div>

                      <div className={styles.heroVisualAccent}>
                        <Image
                          alt=""
                          fill
                          quality={95}
                          sizes="180px"
                          src="/img/hero/wood-circle.webp"
                        />
                      </div>
                    </div>
                  </>
                ) : null}

                {slide.id === "inStock" ? (
                  <>
                    <div
                      aria-hidden="true"
                      className={styles.heroInStockBackground}
                    />

                    <article
                      className={`${styles.heroInStockCard} ${styles.heroSlideCardBase} ${styles.heroDesktopTextBase} ${isActiveRealSlide ? styles.heroCardActive : ""}`}
                    >
                      <h2 className={`${styles.heroInStockTitle} ${styles.heroSlideHeadingBase}`}>
                        В наличии более
                        <br />
                        {" "}
                        300 видов
                        <br />
                        {" "}
                        фанеры
                      </h2>

                      <p className={`${styles.heroInStockLead} ${styles.heroSlideLeadBase}`}>
                        Более трехсот наименований фанеры
                        <br />
                        {" "}
                        и других листовых материалов
                      </p>
                    </article>
                  </>
                ) : null}

                {slide.id === "help" ? (
                  <>
                    <div aria-hidden="true" className={styles.heroHelpCanvas}>
                      <div className={styles.heroHelpCanvasShade} />
                      <div className={styles.heroHelpCanvasImage}>
                        <Image
                          alt={slide.imageAlt}
                          fill
                          quality={95}
                          sizes="(max-width: 899px) 54vw, 54vw"
                          src="/img/hero/slideHelp.webp"
                        />
                      </div>
                    </div>

                    <article
                      className={`${styles.heroHelpCopy} ${styles.heroSlideCardBase} ${styles.heroDesktopTextBase} ${isActiveRealSlide ? styles.heroCardActive : ""}`}
                    >
                      <h2 className={`${styles.heroHelpTitle} ${styles.heroSlideHeadingBase}`}>
                        Помощь в подборе
                        <br />
                        {" "}
                        материалов под
                        <br />
                        {" "}
                        ваши задачи
                      </h2>

                      <p className={`${styles.heroHelpLead} ${styles.heroSlideLeadBase}`}>
                        Наши менеджеры помогут в поиске
                        <br />
                        {" "}
                        подходящих решений, в зависимости
                        <br />
                        {" "}
                        от условий и бюджета
                      </p>
                    </article>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div aria-label="Навигация слайдов" className={styles.heroDots} role="tablist">
        {heroSlides.map((slide, index) => (
          <span
            aria-hidden="true"
            className={`${styles.heroDot} ${index === activeRealSlideIndex ? styles.heroDotActive : ""}`}
            key={slide.id}
          />
        ))}
      </div>

      <button
        aria-label="Следующий слайд"
        className={`${styles.heroArrow} ${styles.heroArrowRight}`}
        onClick={() => handleArrowClick("next")}
        type="button"
      >
        <ArrowIcon />
      </button>

      <span className={styles.heroSrOnly}>
        Слайд {activeRealSlideIndex + 1} из {slideCount}
      </span>
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
