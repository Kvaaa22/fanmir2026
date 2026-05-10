export const CATALOG_PATH = "/catalog";
export const CATEGORY_FILTER_LABEL = "Категория";
export const MATERIAL_FILTER_LABEL = "Материал";

export function buildCatalogFilterId(
  categoryId: string,
  label: string,
  value: string
) {
  return `${categoryId}::${label}::${value}`;
}

export function buildCatalogFilterHref(filterIds: string | string[]) {
  const ids = Array.isArray(filterIds) ? filterIds : [filterIds];
  const params = new URLSearchParams();

  for (const filterId of ids) {
    params.append("filter", filterId);
  }

  return `${CATALOG_PATH}?${params.toString()}`;
}

export const catalogCategoryFilterIds = {
  birch: buildCatalogFilterId(
    "fanera-berezovaya",
    CATEGORY_FILTER_LABEL,
    "Фанера березовая"
  ),
  conifer: buildCatalogFilterId(
    "fanera-xvoinaya",
    CATEGORY_FILTER_LABEL,
    "Фанера хвойная"
  ),
  laminated: buildCatalogFilterId(
    "fanera-laminirovannaya",
    CATEGORY_FILTER_LABEL,
    "Фанера ламинированная"
  ),
  osb: buildCatalogFilterId(
    "plity-osb-3",
    CATEGORY_FILTER_LABEL,
    "Плиты OSB-3 (ОСП)"
  ),
  dspDvp: buildCatalogFilterId(
    "dvp-i-dsp",
    CATEGORY_FILTER_LABEL,
    "ДВП, ДСП и МДФ"
  ),
  plydex: buildCatalogFilterId("paneli-plydex", CATEGORY_FILTER_LABEL, "PLYDEX"),
} as const;

export const catalogMaterialFilterIds = {
  dsp: buildCatalogFilterId("dvp-i-dsp", MATERIAL_FILTER_LABEL, "ДСП"),
  dvp: buildCatalogFilterId("dvp-i-dsp", MATERIAL_FILTER_LABEL, "ДВП"),
  mdf: buildCatalogFilterId("dvp-i-dsp", MATERIAL_FILTER_LABEL, "МДФ"),
} as const;

export const catalogOfferHrefs = {
  osb: buildCatalogFilterHref(catalogCategoryFilterIds.osb),
  conifer: buildCatalogFilterHref(catalogCategoryFilterIds.conifer),
  birch: buildCatalogFilterHref(catalogCategoryFilterIds.birch),
  laminated: buildCatalogFilterHref(catalogCategoryFilterIds.laminated),
  dspDvp: buildCatalogFilterHref(catalogCategoryFilterIds.dspDvp),
  dsp: buildCatalogFilterHref(catalogMaterialFilterIds.dsp),
  dvp: buildCatalogFilterHref(catalogMaterialFilterIds.dvp),
  mdf: buildCatalogFilterHref(catalogMaterialFilterIds.mdf),
  plydex: buildCatalogFilterHref(catalogCategoryFilterIds.plydex),
  construction: buildCatalogFilterHref([
    buildCatalogFilterId("fanera-berezovaya", "Вид фанеры", "Строительная"),
    buildCatalogFilterId("fanera-xvoinaya", "Вид фанеры", "Строительная"),
  ]),
} as const;
