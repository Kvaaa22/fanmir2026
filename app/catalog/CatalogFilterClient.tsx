"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import styles from "./page.module.css";

export type CatalogFilterClientItem = {
  id: string;
  categoryId: string;
  category: string;
  label: string;
  value: string;
};

type CatalogFilterContextValue = {
  activeFilterGroups: string[][][];
  activeFilterIds: string[];
  clearFilters: () => void;
  filtersById: Map<string, CatalogFilterClientItem>;
  hasFilteredProducts: boolean;
  removeFilter: (filterId: string) => void;
  toggleFilter: (filterId: string) => void;
};

const CatalogFilterContext = createContext<CatalogFilterContextValue | null>(null);

function getActiveFilterGroups(
  activeFilterIds: string[],
  filtersById: Map<string, CatalogFilterClientItem>
) {
  const categoryGroups = new Map<string, Map<string, string[]>>();

  for (const filterId of activeFilterIds) {
    const filter = filtersById.get(filterId);

    if (!filter) {
      continue;
    }

    const categoryFilters =
      categoryGroups.get(filter.categoryId) ?? new Map<string, string[]>();
    const sectionFilterIds = categoryFilters.get(filter.label) ?? [];

    sectionFilterIds.push(filter.id);
    categoryFilters.set(filter.label, sectionFilterIds);
    categoryGroups.set(filter.categoryId, categoryFilters);
  }

  return Array.from(categoryGroups.values()).map((categoryFilters) =>
    Array.from(categoryFilters.values())
  );
}

function productMatchesActiveFilterGroups(
  productFilterIds: Set<string>,
  activeFilterGroups: string[][][]
) {
  if (activeFilterGroups.length === 0) {
    return true;
  }

  return activeFilterGroups.some((categoryFilters) =>
    categoryFilters.every((sectionFilterIds) =>
      sectionFilterIds.some((filterId) => productFilterIds.has(filterId))
    )
  );
}

function useCatalogFilters() {
  const context = useContext(CatalogFilterContext);

  if (!context) {
    throw new Error("Catalog filter components must be used inside CatalogFilterProvider.");
  }

  return context;
}

export function CatalogFilterProvider({
  children,
  filters,
  productFilterIds,
}: {
  children: ReactNode;
  filters: CatalogFilterClientItem[];
  productFilterIds: string[][];
}) {
  const [activeFilterIds, setActiveFilterIds] = useState<string[]>([]);

  const filtersById = useMemo(() => {
    return new Map(filters.map((filter) => [filter.id, filter]));
  }, [filters]);

  const productFilterSets = useMemo(() => {
    return productFilterIds.map((filterIds) => new Set(filterIds));
  }, [productFilterIds]);

  const activeFilterGroups = useMemo(() => {
    return getActiveFilterGroups(activeFilterIds, filtersById);
  }, [activeFilterIds, filtersById]);

  const hasFilteredProducts = useMemo(() => {
    return productFilterSets.some((productFilters) =>
      productMatchesActiveFilterGroups(productFilters, activeFilterGroups)
    );
  }, [activeFilterGroups, productFilterSets]);

  const value = useMemo<CatalogFilterContextValue>(() => {
    return {
      activeFilterGroups,
      activeFilterIds,
      clearFilters: () => setActiveFilterIds([]),
      filtersById,
      hasFilteredProducts,
      removeFilter: (filterId) =>
        setActiveFilterIds((currentFilterIds) =>
          currentFilterIds.filter((currentFilterId) => currentFilterId !== filterId)
        ),
      toggleFilter: (filterId) =>
        setActiveFilterIds((currentFilterIds) =>
          currentFilterIds.includes(filterId)
            ? currentFilterIds.filter((currentFilterId) => currentFilterId !== filterId)
            : [...currentFilterIds, filterId]
        ),
    };
  }, [activeFilterGroups, activeFilterIds, filtersById, hasFilteredProducts]);

  return (
    <CatalogFilterContext.Provider value={value}>
      {children}
    </CatalogFilterContext.Provider>
  );
}

export function CatalogFilterButton({
  children,
  filterId,
}: {
  children: ReactNode;
  filterId: string;
}) {
  const { activeFilterIds, toggleFilter } = useCatalogFilters();
  const isActive = activeFilterIds.includes(filterId);

  return (
    <button
      aria-pressed={isActive}
      className={`${styles.filterOption} ${
        isActive ? styles.filterOptionActive : ""
      }`}
      onClick={() => toggleFilter(filterId)}
      type="button"
    >
      {children}
    </button>
  );
}

export function CatalogActiveFilters() {
  const { activeFilterIds, clearFilters, filtersById, removeFilter } =
    useCatalogFilters();
  const activeFilters = activeFilterIds
    .map((filterId) => filtersById.get(filterId))
    .filter((filter): filter is CatalogFilterClientItem => Boolean(filter));

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className={styles.activeFilters} aria-label="Выбранные фильтры">
      {activeFilters.map((filter) => (
        <button
          className={styles.filterChip}
          key={filter.id}
          onClick={() => removeFilter(filter.id)}
          type="button"
          aria-label={`Снять фильтр ${filter.label}: ${filter.value}`}
        >
          <span>
            {filter.label}: {filter.value}
          </span>
          <span className={styles.filterChipIcon} aria-hidden="true">
            ×
          </span>
        </button>
      ))}

      <button
        className={styles.clearFiltersButton}
        onClick={clearFilters}
        type="button"
      >
        Убрать все фильтры
      </button>
    </div>
  );
}

export function CatalogFilteredEmpty({ children }: { children: ReactNode }) {
  const { activeFilterIds, hasFilteredProducts } = useCatalogFilters();

  if (activeFilterIds.length === 0 || hasFilteredProducts) {
    return null;
  }

  return children;
}

export function CatalogProductVisibility({
  children,
  filterIds,
}: {
  children: ReactNode;
  filterIds: string[];
}) {
  const { activeFilterGroups } = useCatalogFilters();
  const productFilterIds = useMemo(() => new Set(filterIds), [filterIds]);
  const isVisible = productMatchesActiveFilterGroups(
    productFilterIds,
    activeFilterGroups
  );

  return (
    <div className={styles.catalogProductVisibility} hidden={!isVisible}>
      {children}
    </div>
  );
}
