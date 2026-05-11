'use client';

import { useEffect, useRef, useState } from 'react';

type Coordinates = [number, number];

type YMapLocation = {
  center: Coordinates;
  zoom: number;
};

type YMapInstance = {
  addChild: (child: unknown) => void;
  destroy: () => void;
};

type YMaps3 = {
  ready: Promise<void>;
  YMap: new (element: HTMLElement, options: { location: YMapLocation }) => YMapInstance;
  YMapDefaultSchemeLayer: new () => unknown;
  YMapDefaultFeaturesLayer: new () => unknown;
  YMapMarker: new (
    options: { coordinates: Coordinates },
    element: HTMLElement
  ) => unknown;
};

declare global {
  interface Window {
    ymaps3?: YMaps3;
  }
}

type YandexMapProps = {
  center?: Coordinates;
  markerTitle?: string;
  zoom?: number;
};

let ymaps3LoadPromise: Promise<void> | null = null;

export default function YandexMap({
  center = [92.745941, 56.053861],
  markerTitle = 'Мы находимся здесь',
  zoom = 16,
}: YandexMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<YMapInstance | null>(null);
  const markerTitleRef = useRef(markerTitle);
  const [hasMapError, setHasMapError] = useState(false);
  const [longitude, latitude] = center;

  markerTitleRef.current = markerTitle;

  useEffect(() => {
    let cancelled = false;
    const currentCenter: Coordinates = [longitude, latitude];
    const currentMarkerTitle = markerTitleRef.current;

    async function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      setHasMapError(false);

      const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;

      if (!apiKey) {
        console.error('Yandex Maps API key is missing');
        setHasMapError(true);
        return;
      }

      if (!window.ymaps3) {
        ymaps3LoadPromise ??= new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');

          script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Yandex Maps script'));

          document.head.appendChild(script);
        });

        try {
          await ymaps3LoadPromise;
        } catch (error) {
          ymaps3LoadPromise = null;

          if (!cancelled) {
            console.error(error);
            setHasMapError(true);
          }

          return;
        }
      }

      if (!window.ymaps3) {
        console.error('Yandex Maps SDK is unavailable after script load');
        setHasMapError(true);
        return;
      }

      try {
        await window.ymaps3.ready;
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setHasMapError(true);
        }

        return;
      }

      if (cancelled || !mapRef.current) return;

      const {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker,
      } = window.ymaps3;

      const map = new YMap(mapRef.current, {
        location: {
          center: currentCenter,
          zoom,
        },
      });

      map.addChild(new YMapDefaultSchemeLayer());
      map.addChild(new YMapDefaultFeaturesLayer());

      const markerElement = document.createElement('div');
      markerElement.className = 'yandex-map-marker';
      markerElement.setAttribute('aria-label', currentMarkerTitle);

      const markerIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      markerIcon.setAttribute('class', 'yandex-map-marker__icon');
      markerIcon.setAttribute('viewBox', '0 0 16 16');
      markerIcon.setAttribute('aria-hidden', 'true');

      const markerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      markerPath.setAttribute(
        'd',
        'M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z'
      );

      markerIcon.append(markerPath);

      const markerLabel = document.createElement('span');
      markerLabel.className = 'yandex-map-marker__label';
      markerLabel.textContent = currentMarkerTitle;

      markerElement.append(markerIcon, markerLabel);

      const marker = new YMapMarker(
        {
          coordinates: currentCenter,
        },
        markerElement
      );

      map.addChild(marker);

      mapInstanceRef.current = map;
    }

    initMap();

    return () => {
      cancelled = true;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom]);

  return (
    <div ref={mapRef} className="yandex-map">
      {hasMapError ? (
        <a
          className="yandex-map-fallback"
          href={`https://yandex.ru/maps/?ll=${longitude}%2C${latitude}&z=${zoom}`}
          rel="noreferrer"
          target="_blank"
        >
          Открыть адрес на Яндекс Картах
        </a>
      ) : null}
    </div>
  );
}
