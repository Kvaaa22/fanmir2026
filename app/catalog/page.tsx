import type { Metadata } from "next";
import Image from "next/image";
import { connection } from "next/server";
import {
  getCatalogPriceCards,
  type CatalogPriceCard,
} from "@/lib/catalog/getCatalogData";
import {
  buildCatalogFilterId,
  CATEGORY_FILTER_LABEL,
  MATERIAL_FILTER_LABEL,
} from "@/lib/catalog/filterLinks";
import { createPageMetadata } from "@/lib/seo/site";
import {
  CatalogActiveFilters,
  CatalogFilteredEmpty,
  CatalogFilterButton,
  CatalogFilterProvider,
  CatalogProductVisibility,
} from "./CatalogFilterClient";
import { CatalogCartControls } from "./CatalogCartControls";
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

type CatalogSearchParams = {
  filter?: string | string[] | undefined;
};

const categories = [
  "Фанера березовая",
  "Фанера хвойная",
  "Фанера ламинированная",
  "Плиты OSB-3 (ОСП)",
  "ДВП, ДСП и МДФ",
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
        title: "Размер",
        items: ["1220*2440 мм"],
      },
    ],
  },
  {
    sections: [
      {
        title: "Сорт",
        items: ["Сорт 1/3", "Сорт 2/3", "Сорт 3/3"],
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
    sections: [
      {
        title: "Толщина",
        items: ["9 мм", "12 мм", "18 мм", "22 мм"],
      },
      {
        title: "Размер",
        items: ["1250*2500 мм"],
      },
    ],
  },
  {
    title: "Сорт",
    items: ["Латат 1 сорт", "Латат 3 сорт", "Ультралам"],
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
    groupTitle: "МДФ",
    columns: [
      {
        sections: [
          {
            title: "Толщина",
            items: ["6 мм", "8 мм", "10 мм", "16 мм", "18 мм", "19 мм", "22 мм"],
          },
          {
            title: "Размер",
            items: ["2800*2070 мм"],
          },
          {
            title: "Вид МДФ",
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
        ],
      },
      {
        title: "Панели стандартного размера",
        items: ["Без покрытия", "Классик", "Лофт", "Эксклюзив"],
      },
    ],
  },
  {
    sections: [
      {
        title: "Панели по индивидуальным размерам",
        items: ["Без покрытия", "Классик, масло", "Лофт, масло", "Эмаль, морилка/лак", "Эмаль/патина"],
      },
      {
        title: "Профиль по индивидуальным размерам",
        items: ["Без покрытия", "Классик", "Лофт", "Эмаль, морилка/лак", "Эмаль/патина"],
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
  return buildCatalogFilterId(categoryId, label, value);
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
    const categoryFilterId = buildFilterId(
      categoryId,
      CATEGORY_FILTER_LABEL,
      category
    );

    knownFilters.set(categoryFilterId, {
      id: categoryFilterId,
      categoryId,
      category,
      label: CATEGORY_FILTER_LABEL,
      value: category,
    });

    if (categoryId === "dvp-i-dsp") {
      for (const value of ["ДСП", "ДВП", "МДФ"]) {
        const materialFilterId = buildFilterId(
          categoryId,
          MATERIAL_FILTER_LABEL,
          value
        );

        knownFilters.set(materialFilterId, {
          id: materialFilterId,
          categoryId,
          category,
          label: MATERIAL_FILTER_LABEL,
          value,
        });
      }
    }

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

function getSearchParamValues(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function getInitialFilterIds(
  searchParams: CatalogSearchParams,
  knownFilters: Map<string, ActiveFilter>
) {
  return getSearchParamValues(searchParams.filter).filter((filterId) =>
    knownFilters.has(filterId)
  );
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
      product.categorySlug === "plydex-profile"
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

  return productSearchText(product).includes(normalizeSearchValue(filter.value));
}

function productMatchesFilter(product: CatalogPriceCard, filter: ActiveFilter) {
  if (!productMatchesCategory(product, filter.categoryId)) {
    return false;
  }

  const label = normalizeText(filter.label);

  if (label === normalizeText(CATEGORY_FILTER_LABEL)) {
    return true;
  }

  if (
    filter.categoryId === "dvp-i-dsp" &&
    label === normalizeText(MATERIAL_FILTER_LABEL)
  ) {
    const marker = normalizeMarkerValue(filter.value);

    if (marker === "дсп") {
      return product.categorySlug === "dsp";
    }

    if (marker === "двп") {
      return product.categorySlug === "dvp";
    }

    if (marker === "мдф") {
      return product.categorySlug === "mdf";
    }
  }

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

    if (filterSort) {
      return productSort === filterSort;
    }

    return productSearchText(product).includes(normalizeSearchValue(filter.value));
  }

  if (label.includes("вид") && filter.categoryId.startsWith("fanera")) {
    const markerMatch = productMatchesPlywoodMeaning(product, filter.value);

    if (markerMatch !== undefined) {
      return markerMatch;
    }
  }

  return productSearchText(product).includes(normalizeSearchValue(filter.value));
}

export const metadata: Metadata = createPageMetadata({
  title: "Каталог",
  description:
    "Каталог фанеры, OSB, ДСП, ДВП, МДФ и листовых материалов в Красноярске.",
  path: "/catalog",
});

export default async function PricesPage({
  searchParams,
}: {
  searchParams?: Promise<CatalogSearchParams>;
}) {
  await connection();

  const products = await getCatalogPriceCards();
  const knownFiltersMap = getKnownFilters();
  const knownFilters = Array.from(knownFiltersMap.values());
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialFilterIds = getInitialFilterIds(
    resolvedSearchParams,
    knownFiltersMap
  );
  const productFilterIds = products.map((product) =>
    knownFilters
      .filter((filter) => productMatchesFilter(product, filter))
      .map((filter) => filter.id)
  );

  return (
    <section className={styles.catalogPage} aria-label="Каталог товаров">
      <div className={styles.catalogFrame}>
        <h1 className={styles.catalogTitle}>
          Каталог фанеры и листовых материалов
        </h1>

        <CatalogFilterProvider
          filters={knownFilters}
          initialFilterIds={initialFilterIds}
          key={initialFilterIds.join("\u0001")}
          productFilterIds={productFilterIds}
        >
          <aside className={styles.sidebar} aria-label="Категории каталога">
            <ul className={styles.categoryList}>
              {dropdownCategories.map(({ category, filters, id }) => (
                <li className={styles.categoryItem} id={id} key={category}>
                  <div className={styles.categoryHeader}>
                    <CatalogFilterButton
                      filterId={buildFilterId(id, CATEGORY_FILTER_LABEL, category)}
                      variant="category"
                    >
                      {category}
                    </CatalogFilterButton>

                    <details className={styles.categoryDropdown}>
                      <summary
                        aria-label={`Открыть фильтры: ${category}`}
                        className={styles.categoryToggleButton}
                      >
                        <span className={styles.categoryArrow} aria-hidden="true" />
                      </summary>

                      <FilterDropdown categoryId={id} filters={filters} />
                    </details>
                  </div>
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

                        <CatalogCartControls product={product} />
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
    if (categoryId === "dvp-i-dsp") {
      const firstColumnGroups = filters.filter((group) =>
        ["ДСП", "ДВП"].includes(group.groupTitle)
      );
      const secondColumnGroups = filters.filter(
        (group) => group.groupTitle === "МДФ"
      );

      return (
        <div className={styles.filterDropdown}>
          <div className={styles.sheetFilterColumns}>
            {[firstColumnGroups, secondColumnGroups].map((groups, columnIndex) => (
              <div className={styles.sheetFilterColumn} key={columnIndex}>
                {groups.map((group) => (
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
            ))}
          </div>
        </div>
      );
    }

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
