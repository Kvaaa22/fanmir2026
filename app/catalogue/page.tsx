import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

type ProductCard = {
  id: string;
  titleLineOne: string;
  titleLineTwo: string;
  sort: string;
  thickness: string;
  size: string;
  price: string;
};

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
    sections: [
      {
        title: "Сорт",
        items: [
          "Сорт 1/2",
          "Сорт 2/2",
          "Сорт 2/3",
          "Сорт 1/3",
          "Сорт 3/3",
          "Сорт 3/4",
          "Сорт 2/4",
          "Сорт 2/2",
          "Сорт 4/4",
        ],
      },
      {
        title: "Размер",
        items: ["1525*1525 мм", "1220*2440 мм", "1500*3000 мм", "1250*2500 мм"],
      },
    ],
  },
  {
    sections: [
      {
        title: "Вид фанеры",
        items: [
          "Влагостойкая",
          "Ламинированная",
          "ФСФ",
          "ФК",
          "Опалубочная",
          "Строительная",
          "Мебельная",
        ],
      },
      {
        title: "Применение",
        items: [
          "Строительная",
          "Опалубочная",
          "Для пола",
          "Для мебели",
          "Для перекрытий",
          "Для обшивки",
        ],
      },
    ],
  },
];

const coniferFilters: FilterColumn[] = [
  {
    title: "Толщина",
    items: ["6,5 мм", "9 мм", "12 мм", "15 мм", "18 мм", "21 мм", "24 мм", "27 мм", "30 мм"],
  },
  {
    sections: [
      {
        title: "Сорт",
        items: ["Сорт 1/3", "Сорт 2/3", "Сорт 3/3", "Сорт 3/4"],
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
        title: "Вид фанеры",
        items: ["Шлифованная", "Нешлифованная", "ФСФ", "Строительная"],
      },
      {
        title: "Применение",
        items: ["Строительная", "Для пола", "Для перекрытий", "Для обшивки"],
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
        items: ["F/F (гладкая/гладкая)", "F/W (гладкая/сетка)", "ДЭК 350 гладкая/\nгладкая"],
      },
      {
        title: "Размер",
        items: ["1220*2440 мм", "1500*3000 мм"],
      },
    ],
  },
  {
    title: "Применение",
    items: ["Для опалубки", "Для пола", "Для перекрытий", "Для обшивки"],
  },
];

const osbFilters: FilterColumn[] = [
  {
    title: "Толщина",
    items: ["6 мм", "9 мм", "12 мм", "15 мм", "18 мм", "22 мм"],
  },
  {
    title: "Размер",
    items: ["1250*2500 мм"],
  },
  {
    title: "Применение",
    items: ["Строительная", "Для пола", "Для мебели", "Для перекрытий", "Для обшивки"],
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
            items: ["2440*1220 мм", "2500*1830 мм"],
          },
          {
            title: "Вид ДСП",
            items: ["Шлифованная"],
          },
        ],
      },
      {
        title: "Применение",
        items: ["Строительная", "Для пола", "Для перекрытий", "Для обшивки"],
      },
    ],
  },
  {
    groupTitle: "ДВП",
    columns: [
      {
        sections: [
          {
            title: "Толщина",
            items: ["2,5 мм", "3,2 мм", "5 мм"],
          },
          {
            title: "Вид ДВП",
            items: ["Одностороннее", "Двустороннее"],
          },
        ],
      },
      {
        sections: [
          {
            title: "Применение",
            items: ["Для мебели", "Для пола", "Для перекрытий", "Для обшивки"],
          },
        ],
      },
    ],
  },
  {
    groupTitle: "",
    columns: [
      {
        title: "Размер",
        items: ["1220*2440 мм", "1700*2750 мм", "1220*2710 мм"],
      },
    ],
  },
];

const plydexFilters: FilterColumn[] = [
  {
    title: "Профиль",
    items: [
      "Г-образный",
      "Г-образный,\nразмер 100*\n100*2400 мм",
      "Г-образный,\nразмер 200*\n200*2400 мм",
      "П-образный",
      "П-образный,\nразмер 180*\n200*180*2400 мм",
      "П-образный,\nразмер 90*\n100*90*2400 мм",
      "О-образный\n(4 стороны)",
      "О-образный,\nразмер 150*\n150*150*150*\n2400 мм",
      "О-образный,\nразмер 50*\n50*50*50*\n2400 мм",
      "С покрытием",
      "Без покрытия",
      "Под заказ*",
    ],
  },
  {
    sections: [
      {
        title: "Панели",
        items: ["Без покрытия", "С покрытием", "Размер 1220*190 мм", "Размер 1220*145 мм", "Индивидуальный размер"],
      },
      {
        title: "Панно",
        items: ["Под заказ в ассортименте*"],
      },
      {
        title: "Двери",
        items: ["С покрытием", "Без покрытия", "Под заказ в ассортименте*"],
      },
      {
        title: "Изделия на заказ",
        items: ["Столы", "Шкафы", "Стеллажи", "Дверные откосы"],
      },
    ],
  },
];

const dropdownCategories = [
  { category: categories[0], filters: birchFilters },
  { category: categories[1], filters: coniferFilters },
  { category: categories[2], filters: laminatedFilters },
  { category: categories[3], filters: osbFilters },
  { category: categories[4], filters: dspDvpFilters },
  { category: categories[5], filters: plydexFilters },
];

const products: ProductCard[] = Array.from({ length: 6 }, (_, index) => ({
  id: `fanera-berezovaya-${index + 1}`,
  titleLineOne: "Фанера березовая ФК 1525 х 1525 мм",
  titleLineTwo: "3мм Ш2 (В/ВВ) СВЕЗА",
  sort: "Сорт 1/2",
  thickness: "3мм",
  size: "1525*1525 мм",
  price: "890 р/лист",
}));

export const metadata: Metadata = {
  title: "Наши цены | Фанерный мир",
  description: "Каталог фанеры и листовых материалов.",
};

export default function PricesPage() {
  return (
    <section className={styles.catalogPage} aria-label="Каталог товаров">
      <div className={styles.catalogFrame}>
        <aside className={styles.sidebar} aria-label="Категории каталога">
          <ul className={styles.categoryList}>
            {dropdownCategories.map(({ category, filters }) => (
              <li className={styles.categoryItem} key={category}>
                <details className={styles.categoryDropdown}>
                  <summary className={styles.categoryButton}>
                    <span>{category}</span>
                    <span className={styles.categoryArrow} aria-hidden="true" />
                  </summary>

                  <FilterDropdown filters={filters} />
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
          {products.map((product) => (
            <article className={styles.productCard} key={product.id}>
              <div className={styles.productImage}>
                <Image
                  alt=""
                  fill
                  priority={product.id === "fanera-berezovaya-1"}
                  sizes="309px"
                  src="/img/catalogue/card.png"
                />
              </div>

              <div className={styles.productBody}>
                <div className={styles.productDetails}>
                  <h2 className={styles.productTitle}>
                    <span>{product.titleLineOne}</span>
                    <span>{product.titleLineTwo}</span>
                  </h2>

                  <dl className={styles.productMeta}>
                    <div className={styles.metaColumn}>
                      <dt>Сорт</dt>
                      <dd>{product.sort}</dd>
                    </div>
                    <div className={styles.metaColumn}>
                      <dt>Толщина</dt>
                      <dd>{product.thickness}</dd>
                    </div>
                    <div className={styles.metaColumn}>
                      <dt>Размер</dt>
                      <dd>{product.size}</dd>
                    </div>
                  </dl>
                </div>

                <div className={styles.productPrice}>{product.price}</div>

                <div className={styles.productActions}>
                  <div className={styles.quantityControl} aria-label="Количество">
                    <button aria-label="Уменьшить количество" type="button">
                      −
                    </button>
                    <span>0</span>
                    <button aria-label="Увеличить количество" type="button">
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
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterDropdown({ filters }: { filters: FilterContent }) {
  if (isFilterGroups(filters)) {
    return (
      <div className={styles.filterDropdown}>
        <div className={styles.filterGroups}>
          {filters.map((group) => (
            <div className={styles.filterGroup} key={group.groupTitle}>
              <h3 className={styles.filterGroupTitle}>{group.groupTitle}</h3>
              <div className={styles.filterGroupColumns}>
                {group.columns.map((column, columnIndex) => (
                  <FilterColumnContent column={column} key={columnIndex} />
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
          <FilterColumnContent column={column} key={columnIndex} />
        ))}
      </div>
    </div>
  );
}

function isFilterGroups(filters: FilterContent): filters is FilterGroup[] {
  return filters.length > 0 && "groupTitle" in filters[0];
}

function FilterColumnContent({ column }: { column: FilterColumn }) {
  return (
    <div className={styles.filterColumn}>
      {"sections" in column ? (
        column.sections.map((section) => <FilterSectionContent key={section.title} section={section} />)
      ) : (
        <FilterSectionContent section={column} />
      )}
    </div>
  );
}

function FilterSectionContent({ section }: { section: FilterSection }) {
  return (
    <div className={styles.filterSection}>
      <h3>{section.title}</h3>
      <ul>
        {section.items.map((item, itemIndex) => (
          <li key={`${section.title}-${item}-${itemIndex}`}>
            <button className={styles.filterOption} type="button">
              {item}
            </button>
          </li>
        ))}
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
