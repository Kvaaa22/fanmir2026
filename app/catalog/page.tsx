import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import {
  getCatalogPriceCards,
  type CatalogPriceCard,
} from "@/lib/catalog/getCatalogData";
import {
  CatalogActiveFilters,
  CatalogFilteredEmpty,
  CatalogFilterButton,
  CatalogFilterProvider,
  CatalogProductVisibility,
} from "./CatalogFilterClient";
import styles from "./page.module.css";

type FilterSection = {
  title: string;
  items: string[];
};

type FilterColumn = FilterSection | { sections: FilterSection[] };

type FilterGroup = {
  groupTitle: string;
  columns: FilterColumn[];
};

type FilterContent = FilterColumn[] | FilterGroup[];

type ActiveFilter = {
  id: string;
  categoryId: string;
  category: string;
  label: string;
  value: string;
};

const categories = [
  "Фанера березовая",
  "Фанера хвойная",
  "Фанера ламинированная",
  "Плиты OSB-3 (ОСП)",
  "ДВП и ДСП",
  "PLYDEX",
];

const birchFilters: FilterColumn[] = [
  {
    sections: [
      {
        title: "Толщина",
        items: [
          "3 мм",
          "4 мм",
          "5 мм",
          "6 мм",
          "8 мм",
          "9 мм",
          "10 мм",
          "12 мм",
          "15 мм",
          "18 мм",
          "21 мм",
          "24 мм",
          "27 мм",
          "30 мм",
          "35 мм",
          "40 мм",
        ],
      },
      {
        title: "Размер",
        items: ["1525*1525 мм", "1220*2440 мм", "1500*3000 мм"],
      },
    ],
  },
  {
    sections: [
      {
        title: "Сорт",
        items: [
          "Сорт 1/2",
          "Сорт 2/2",
          "Сорт 2/3",
          "Сорт 3/3",
          "Сорт 3/4",
          "Сорт 4/4",
        ],
      },
      {
        title: "Вид фанеры",
        items: [
          "Для внутренних работ",
          "Влагостойкая",
          "Нешлифованная",
          "Шлифованная",
          "Шлифованная с двух сторон",
          "Для безопасного применения внутри помещений",
          "Строительная",
          "Мебельная",
        ],
      },
    ],
  },
];

const coniferFilters: FilterColumn[] = [
  {
    sections: [
      {
        title: "Толщина",
        items: ["6,5 мм", "9 мм", "12 мм", "15 мм", "18 мм", "21 мм", "24 мм"],
      },
      {
        title: "Сорт",
        items: ["Сорт 1/3", "Сорт 2/3", "Сорт 3/3"],
      },
    ],
  },
  {
    sections: [
      {
        title: "Размер",
        items: ["1220*2440 мм"],
      },
      {
        title: "Вид фанеры",
        items: ["Нешлифованная", "Влагостойкая", "Строительная"],
      },
    ],
  },
];

const laminatedFilters: FilterColumn[] = [
  {
    title: "Толщина",
    items: ["6 мм", "9 мм", "12 мм", "15 мм", "18 мм", "21 мм", "24 мм", "27 мм", "30 мм", "35 мм", "40 мм"],
  },
  {
    sections: [
      {
        title: "Вид фанеры",
        items: ["F/F (гладкая/гладкая)", "F/W (гладкая/сетка)"],
      },
      {
        title: "Размер",
        items: ["1220*2440 мм", "1500*3000 мм"],
      },
    ],
  },
];

const osbFilters: FilterColumn[] = [
  {
    title: "Толщина",
    items: ["9 мм", "12 мм", "18 мм", "22 мм"],
  },
  {
    sections: [
      {
        title: "Размер",
        items: ["1250*2500 мм"],
      },
    ],
  },
];

const dspDvpFilters: FilterGroup[] = [
  {
    groupTitle: "ДСП",
    columns: [
      {
        sections: [
          {
            title: "Толщина",
            items: ["16 мм"],
          },
          {
            title: "Размер",
            items: ["2440*1220 мм"],
          },
          {
            title: "Вид ДСП",
            items: ["Шлифованная"],
          },
        ],
      },
    ],
  },
  {
    groupTitle: "ДВП",
    columns: [
      {
        sections: [
          {
            title: "Размер",
            items: ["1220*2440 мм", "1700*2750 мм", "1220*2710 мм"],
          },
        ],
      },
    ],
  },
];

const plydexFilters: FilterColumn[] = [
  {
    sections: [
      {
        title: "Профиль",
        items: [
          "Г-образный",
          "П-образный",
          "О-образный",
          "Без покрытия",
        ],
      },
      {
        title: "Панно",
        items: [
          "Mix ширина 32/65/97 длина 600/800/1200",
          "Mix ширина 75 длина 525/725/1125",
          "Кубы 275",
          "Ромбы 195/390",
          "Треугольники 320/370",
          "3D 185x450x25",
          "Классик, масло 1 цвет",
          "Лофт, масло 1 цвет",
          "Морилка, эмаль/лак, 1 цвет",
          "Эмаль/патина, 1 цвет",
        ],
      },
      {
        title: "Варианты лакокрасочных покрытий",
        items: ["Классик, масло", "Лофт, масло", "Морилка, эмаль/лак", "Эмаль/патина"],
      },
      {
        title: "Двери",
        items: ["Без покрытия", "Классик", "Лофт", "Эмаль, морилка/лак", "Эмаль/патина"],
      },
    ],
  },
  {
    sections: [
      {
        title: "Панели стандартного размера",
        items: ["Без покрытия", "Классик", "Лофт", "Эксклюзив"],
      },
      {
        title: "Панели по индивидуальным размерам",
        items: ["Без покрытия", "Классик, масло", "Лофт, масло", "Эмаль, морилка/лак", "Эмаль/патина"],
      },
      {
        title: "Профиль по индивидуальным размерам",
        items: ["Без покрытия", "Классик", "Лофт", "Эмаль, морилка/лак", "Эмаль/патина"],
      },
      {
        title: "Готовые изделия",
        items: ["Классик", "Лофт", "Эмаль, морилка/лак", "Эмаль/патина"],
      },
    ],
  },
];

const dropdownCategories = [
  { category: categories[0], filters: birchFilters, id: "fanera-berezovaya" },
  { category: categories[1], filters: coniferFilters, id: "fanera-xvoinaya" },
  { category: categories[2], filters: laminatedFilters, id: "fanera-laminirovannaya" },
  { category: categories[3], filters: osbFilters, id: "plity-osb-3" },
  { category: categories[4], filters: dspDvpFilters, id: "dvp-i-dsp" },
  { category: categories[5], filters: plydexFilters, id: "paneli-plydex" },
];

function buildFilterId(categoryId: string, label: string, value: string) {
  return `${categoryId}::${label}::${value}`;
}

function getSectionsFromColumn(column: FilterColumn): FilterSection[] {
  return "sections" in column ? column.sections : [column];
}

function getSectionsFromContent(filters: FilterContent): FilterSection[] {
  if (isFilterGroups(filters)) {
    return filters.flatMap((group) =>
      group.columns.flatMap((column) => getSectionsFromColumn(column))
    );
  }

  return filters.flatMap((column) => getSectionsFromColumn(column));
}

function getKnownFilters() {
  const knownFilters = new Map<string, ActiveFilter>();

  for (const { category, filters, id: categoryId } of dropdownCategories) {
    for (const section of getSectionsFromContent(filters)) {
      for (const value of section.items) {
        const filterId = buildFilterId(categoryId, section.title, value);

        knownFilters.set(filterId, {
          id: filterId,
          categoryId,
          category,
          label: section.title,
          value,
        });
      }
    }
  }

  return knownFilters;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/[«»]/g, "")
    .replace(/[х×*]/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchValue(value: string) {
  return normalizeText(value).replace(/[^0-9a-zа-яе./x]+/gi, " ").trim();
}

function normalizeMarkerValue(value: string) {
  return value
    .toLowerCase()
    .replaceAll("ё", "е")
    .replace(/[«»]/g, "")
    .replace(/[×*]/g, " ")
    .replace(/[^0-9a-zа-яе]+/gi, " ")
    .trim();
}

function getMarkerTokens(value: string) {
  return normalizeMarkerValue(value).split(/\s+/).filter(Boolean);
}

function hasMarkerToken(value: string, token: string) {
  const normalizedToken = normalizeMarkerValue(token);

  return Boolean(normalizedToken) && getMarkerTokens(value).includes(normalizedToken);
}

function hasAnyMarkerToken(value: string, tokens: string[]) {
  return tokens.some((token) => hasMarkerToken(value, token));
}

function getMetaValue(product: CatalogPriceCard, label: string) {
  const normalizedLabel = normalizeText(label);

  return (
    product.meta.find((item) => normalizeText(item.label) === normalizedLabel)
      ?.value ?? ""
  );
}

function normalizeThicknessValue(value: string) {
  const match = value.replace(",", ".").match(/\d+(?:\.\d+)?/);

  return match ? String(Number(match[0])) : "";
}

function normalizeSizeValue(value: string) {
  const normalized = normalizeText(value)
    .replace(/мм/g, "")
    .replace(/[^0-9x]/g, "");
  const match = normalized.match(/(\d{3,4})x(\d{3,4})/);

  return match ? `${match[1]}x${match[2]}` : "";
}

function reverseSizeValue(value: string) {
  const [width, height] = value.split("x");

  return width && height ? `${height}x${width}` : value;
}

function getSortNumber(value: string) {
  const normalizedValue = value.toLowerCase();
  const romanMap: Record<string, string> = {
    i: "1",
    ii: "2",
    iii: "3",
    iv: "4",
  };

  return romanMap[normalizedValue] ?? normalizedValue;
}

function normalizeSortValue(value: string) {
  const normalized = normalizeText(value).replace(/сорт/g, " ");
  const match = normalized.match(/\b(i|ii|iii|iv|\d)\s*\/\s*(i|ii|iii|iv|\d)\b/i);

  return match ? `${getSortNumber(match[1])}/${getSortNumber(match[2])}` : "";
}

function productMatchesCategory(product: CatalogPriceCard, categoryId: string) {
  if (categoryId === "fanera-berezovaya") {
    return product.categorySlug.startsWith("plywood-birch");
  }

  if (categoryId === "fanera-xvoinaya") {
    return product.categorySlug === "plywood-softwood";
  }

  if (categoryId === "fanera-laminirovannaya") {
    return product.categorySlug === "plywood-laminated";
  }

  if (categoryId === "plity-osb-3") {
    return product.categorySlug === "osb";
  }

  if (categoryId === "dvp-i-dsp") {
    return ["dsp", "dvp", "mdf"].includes(product.categorySlug);
  }

  if (categoryId === "paneli-plydex") {
    return product.categorySlug.startsWith("plydex");
  }

  return true;
}

function productSearchText(product: CatalogPriceCard) {
  return normalizeSearchValue(
    [
      product.categoryTitle,
      product.titleLineOne,
      product.titleLineTwo,
      ...product.meta.flatMap((item) => [item.label, item.value]),
    ].join(" ")
  );
}

function productMarkerText(product: CatalogPriceCard) {
  return [
    product.categoryTitle,
    product.titleLineOne,
    product.titleLineTwo,
    ...product.meta.flatMap((item) => [item.label, item.value]),
  ].join(" ");
}

function variantMarkerText(product: CatalogPriceCard) {
  return [product.titleLineTwo, getMetaValue(product, "Тип")].join(" ");
}

function productIsUnsanded(product: CatalogPriceCard) {
  const variantText = variantMarkerText(product);

  if (
    hasMarkerToken(variantText, "НШ") ||
    hasMarkerToken(variantText, "Нешлифованная")
  ) {
    return true;
  }

  const fullText = productMarkerText(product);

  return (
    hasMarkerToken(fullText, "НШ") &&
    !hasAnyMarkerToken(fullText, ["Ш", "Ш1", "Ш2", "Шлифованная"])
  );
}

function productIsSanded(product: CatalogPriceCard, marker: "Ш" | "Ш1" | "Ш2") {
  const fullText = productMarkerText(product);

  if (productIsUnsanded(product)) {
    return false;
  }

  if (marker === "Ш1") {
    return hasMarkerToken(fullText, "Ш1");
  }

  if (marker === "Ш2") {
    return hasMarkerToken(fullText, "Ш2");
  }

  return (
    hasAnyMarkerToken(fullText, ["Ш", "Ш1", "Ш2", "Шлифованная"])
  );
}

function productMatchesPlywoodMeaning(
  product: CatalogPriceCard,
  value: string
): boolean | undefined {
  const marker = normalizeMarkerValue(value);
  const fullText = productMarkerText(product);

  if (marker === "для внутренних работ") {
    return hasMarkerToken(fullText, "ФК");
  }

  if (marker === "влагостойкая" || marker === "строительная") {
    return hasMarkerToken(fullText, "ФСФ");
  }

  if (marker === "нешлифованная") {
    return productIsUnsanded(product);
  }

  if (marker === "шлифованная") {
    return productIsSanded(product, "Ш");
  }

  if (marker === "шлифованная с одной стороны") {
    return productIsSanded(product, "Ш1");
  }

  if (marker === "шлифованная с двух сторон" || marker === "мебельная") {
    return productIsSanded(product, "Ш2");
  }

  if (marker === "для безопасного применения внутри помещений") {
    return hasMarkerToken(fullText, "Е1");
  }

  return undefined;
}

function productPlydexFinishMatches(product: CatalogPriceCard, value: string) {
  const marker = normalizeMarkerValue(value);
  const productType = normalizeMarkerValue(getMetaValue(product, "Тип"));

  if (marker === "без покрытия") {
    return productType === "без покрытия";
  }

  if (marker === "классик" || marker === "классик масло") {
    return productType.includes("классик");
  }

  if (marker === "лофт" || marker === "лофт масло") {
    return productType.includes("лофт");
  }

  if (marker === "эксклюзив") {
    return productType.includes("эксклюзив");
  }

  if (marker === "эмаль морилка лак" || marker === "морилка эмаль лак") {
    return (
      productType.includes("эмаль морилка лак") ||
      productType.includes("морилка эмаль лак")
    );
  }

  if (marker === "эмаль патина") {
    return productType.includes("эмаль патина");
  }

  return productSearchText(product).includes(normalizeSearchValue(value));
}

function productMatchesPlydexProfileShape(
  product: CatalogPriceCard,
  value: string
) {
  const marker = normalizeMarkerValue(value);
  const variant = normalizeMarkerValue(product.titleLineTwo);

  if (marker === "г образный") {
    return variant.includes("группа 1") || variant.includes("г образный");
  }

  if (marker === "п образный") {
    return variant.includes("группа 2") || variant.includes("п образный");
  }

  if (marker === "о образный") {
    return (
      variant.includes("группа 3") ||
      variant.includes("о образный") ||
      variant.includes("4 х сторон")
    );
  }

  return productPlydexFinishMatches(product, value);
}

function productMatchesPlydexFilter(product: CatalogPriceCard, filter: ActiveFilter) {
  const label = normalizeText(filter.label);

  if (label === "профиль") {
    return (
      product.categorySlug === "plydex-profile" ||
      product.categorySlug === "plydex-ready-products"
    ) && productMatchesPlydexProfileShape(product, filter.value);
  }

  if (label === "панели стандартного размера") {
    return (
      product.productSlug === "plydex-panels-standard" &&
      productPlydexFinishMatches(product, filter.value)
    );
  }

  if (label === "панели по индивидуальным размерам") {
    return (
      product.productSlug === "plydex-panels-custom" &&
      productPlydexFinishMatches(product, filter.value)
    );
  }

  if (label === "профиль по индивидуальным размерам") {
    return (
      product.productSlug === "plydex-profile-custom" &&
      productPlydexFinishMatches(product, filter.value)
    );
  }

  if (label === "готовые изделия") {
    return (
      product.productSlug === "plydex-ready-products" &&
      productPlydexFinishMatches(product, filter.value)
    );
  }

  if (label === "двери") {
    return (
      product.productSlug === "plydex-doors" &&
      productPlydexFinishMatches(product, filter.value)
    );
  }

  if (label === "панно") {
    return (
      product.productSlug === "plydex-pano" &&
      (productPlydexFinishMatches(product, filter.value) ||
        productSearchText(product).includes(normalizeSearchValue(filter.value)))
    );
  }

  if (label === "варианты лакокрасочных покрытий") {
    return (
      product.productSlug === "plydex-coatings" &&
      productPlydexFinishMatches(product, filter.value)
    );
  }

  return productSearchText(product).includes(normalizeSearchValue(filter.value));
}

function productMatchesFilter(product: CatalogPriceCard, filter: ActiveFilter) {
  if (!productMatchesCategory(product, filter.categoryId)) {
    return false;
  }

  const label = normalizeText(filter.label);

  if (filter.categoryId === "paneli-plydex") {
    return productMatchesPlydexFilter(product, filter);
  }

  if (label.includes("толщина")) {
    return (
      normalizeThicknessValue(getMetaValue(product, "Толщина")) ===
      normalizeThicknessValue(filter.value)
    );
  }

  if (label.includes("размер")) {
    const filterSize = normalizeSizeValue(filter.value);
    const productSize = normalizeSizeValue(getMetaValue(product, "Размер"));

    return (
      Boolean(filterSize) &&
      (productSize === filterSize || productSize === reverseSizeValue(filterSize))
    );
  }

  if (label.includes("сорт")) {
    const filterSort = normalizeSortValue(filter.value);
    const productSort =
      normalizeSortValue(getMetaValue(product, "Тип")) ||
      normalizeSortValue(product.titleLineTwo);

    return Boolean(filterSort) && productSort === filterSort;
  }

  if (label.includes("вид") && filter.categoryId.startsWith("fanera")) {
    const markerMatch = productMatchesPlywoodMeaning(product, filter.value);

    if (markerMatch !== undefined) {
      return markerMatch;
    }
  }

  return productSearchText(product).includes(normalizeSearchValue(filter.value));
}

export const metadata: Metadata = {
  title: "Наши цены | Фанерный мир",
  description: "Каталог фанеры и листовых материалов.",
};

export default async function PricesPage() {
  await connection();

  const products = await getCatalogPriceCards();
  const knownFilters = Array.from(getKnownFilters().values());
  const productFilterIds = products.map((product) =>
    knownFilters
      .filter((filter) => productMatchesFilter(product, filter))
      .map((filter) => filter.id)
  );

  return (
    <section className={styles.catalogPage} aria-label="Каталог товаров">
      <div className={styles.catalogFrame}>
        <CatalogFilterProvider
          filters={knownFilters}
          productFilterIds={productFilterIds}
        >
          <aside className={styles.sidebar} aria-label="Категории каталога">
            <ul className={styles.categoryList}>
              {dropdownCategories.map(({ category, filters, id }) => (
                <li className={styles.categoryItem} id={id} key={category}>
                  <details className={styles.categoryDropdown}>
                    <summary className={styles.categoryButton}>
                      <span>{category}</span>
                      <span className={styles.categoryArrow} aria-hidden="true" />
                    </summary>

                    <FilterDropdown categoryId={id} filters={filters} />
                  </details>
                </li>
              ))}

              {categories.slice(dropdownCategories.length).map((category) => (
                <li className={styles.categoryItem} key={category}>
                  <button className={styles.categoryButton} type="button">
                    <span>{category}</span>
                    <span className={styles.categoryArrow} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.productsGrid}>
            <CatalogActiveFilters />

            {products.length === 0 ? (
              <p className={styles.catalogEmpty}>
                Прайс пока не загружен. Добавьте Excel-файл в админке.
              </p>
            ) : (
              <>
                <CatalogFilteredEmpty>
                  <p className={styles.catalogEmpty}>
                    По выбранным фильтрам товары не найдены.
                  </p>
                </CatalogFilteredEmpty>

                {products.map((product, index) => (
                  <CatalogProductVisibility
                    filterIds={productFilterIds[index] ?? []}
                    key={product.id}
                  >
                    <article className={styles.productCard}>
                      <div className={styles.productImage}>
                        <Image
                          alt=""
                          fill
                          priority={index === 0}
                          sizes="309px"
                          src={product.imageUrl}
                        />
                      </div>

                      <div className={styles.productBody}>
                        <div className={styles.productDetails}>
                          <h2 className={styles.productTitle}>
                            <span>{product.titleLineOne}</span>
                            <span>{product.titleLineTwo}</span>
                          </h2>

                          <dl className={styles.productMeta}>
                            {product.meta.map((metaItem) => (
                              <div
                                className={styles.metaColumn}
                                key={metaItem.label}
                              >
                                <dt>{metaItem.label}</dt>
                                <dd>{metaItem.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>

                        <div className={styles.productPrice}>
                          <span>{product.price}</span>
                          {product.pricePerM2 ? (
                            <small>{product.pricePerM2}</small>
                          ) : null}
                        </div>

                        <div className={styles.productActions}>
                          <div
                            className={styles.quantityControl}
                            aria-label="Количество"
                          >
                            <button
                              aria-label="Уменьшить количество"
                              type="button"
                            >
                              −
                            </button>
                            <span>0</span>
                            <button
                              aria-label="Увеличить количество"
                              type="button"
                            >
                              +
                            </button>
                          </div>

                          <button className={styles.cartButton} type="button">
                            <span>В корзину</span>
                            <CartIcon />
                          </button>
                        </div>
                      </div>
                    </article>
                  </CatalogProductVisibility>
                ))}
              </>
            )}
          </div>
        </CatalogFilterProvider>
      </div>
    </section>
  );
}

function FilterDropdown({
  categoryId,
  filters,
}: {
  categoryId: string;
  filters: FilterContent;
}) {
  if (isFilterGroups(filters)) {
    return (
      <div className={styles.filterDropdown}>
        <div className={styles.filterGroups}>
          {filters.map((group) => (
            <div className={styles.filterGroup} key={group.groupTitle}>
              <h3 className={styles.filterGroupTitle}>{group.groupTitle}</h3>
              <div className={styles.filterGroupColumns}>
                {group.columns.map((column, columnIndex) => (
                  <FilterColumnContent
                    categoryId={categoryId}
                    column={column}
                    key={columnIndex}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.filterDropdown}>
      <div className={styles.filterColumns}>
        {filters.map((column, columnIndex) => (
          <FilterColumnContent
            categoryId={categoryId}
            column={column}
            key={columnIndex}
          />
        ))}
      </div>
    </div>
  );
}

function isFilterGroups(filters: FilterContent): filters is FilterGroup[] {
  return filters.length > 0 && "groupTitle" in filters[0];
}

function FilterColumnContent({
  categoryId,
  column,
}: {
  categoryId: string;
  column: FilterColumn;
}) {
  return (
    <div className={styles.filterColumn}>
      {"sections" in column ? (
        column.sections.map((section) => (
          <FilterSectionContent
            categoryId={categoryId}
            key={section.title}
            section={section}
          />
        ))
      ) : (
        <FilterSectionContent
          categoryId={categoryId}
          section={column}
        />
      )}
    </div>
  );
}

function FilterSectionContent({
  categoryId,
  section,
}: {
  categoryId: string;
  section: FilterSection;
}) {
  return (
    <div className={styles.filterSection}>
      <h3>{section.title}</h3>
      <ul>
        {section.items.map((item, itemIndex) => {
          const filterId = buildFilterId(categoryId, section.title, item);

          return (
            <li key={`${section.title}-${item}-${itemIndex}`}>
              <CatalogFilterButton filterId={filterId}>
                {item}
              </CatalogFilterButton>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.cartIcon}
      fill="none"
      height="25"
      viewBox="0 0 25 25"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.2 7.2H22L20.5 15.2H8.7L7.2 7.2ZM7.2 7.2L6.5 4H3.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
      <circle cx="10.1" cy="19.3" r="1.35" stroke="currentColor" strokeWidth="1.45" />
      <circle cx="18.2" cy="19.3" r="1.35" stroke="currentColor" strokeWidth="1.45" />
    </svg>
  );
}
