import { v } from '@l2beat/validate'
import type {
  FilterableEntry,
  FilterableValue,
} from '~/components/table/filters/filterableValue'

const L2_TABS = ['rollups', 'validiumsAndOptimiums', 'others'] as const
export type L2Tab = v.infer<typeof L2Tab>
export const L2Tab = v.enum(L2_TABS)

/**
 * What a tabbed L2 page ships in its SSR data. Only the tab the page opens on
 * (`?tab=`) carries its entries: a hidden tab never renders until clicked, so its
 * entries would be dead weight (the summary's "others" tab alone is ~60% of
 * the page's data). The hidden tabs' entries are fetched when opened.
 */
export interface LazyTabbedL2Entries<T> {
  initialTab: L2Tab
  initialEntries: T[]
  filterables: TabbedFilterables
  /**
   * Table rows each entry renders (more than one when a cell lists several
   * values, e.g. DA layers), in `filterables` order, so a loading tab's
   * skeleton is as tall as the table that replaces it.
   */
  rowCounts: Record<L2Tab, number[]>
}

/**
 * Every entry's filterable values, in all tabs, so that the filter menu offers
 * the same values and the tab counts follow the filters before a hidden tab
 * has loaded. Each distinct value is stored once and entries refer to it by
 * index, which is ~10× smaller than repeating `{ id, value }` per entry.
 */
export interface TabbedFilterables {
  values: FilterableValue[]
  /** One item per entry: indices into `values`, or `null` if unfilterable. */
  tabs: Record<L2Tab, (number[] | null)[]>
}

export function toLazyTabbedL2Entries<T extends FilterableEntry>(
  entries: Record<L2Tab, T[]>,
  initialTab: L2Tab,
  getRowCount: (entry: T) => number = () => 1,
): LazyTabbedL2Entries<T> {
  return {
    initialTab,
    initialEntries: entries[initialTab],
    filterables: encodeFilterables(entries),
    rowCounts: mapTabs(entries, (tabEntries) => tabEntries.map(getRowCount)),
  }
}

/** Reads `?tab=`. A missing or unknown value gets the default tab. */
export function parseL2Tab(value: unknown): L2Tab {
  const result = L2Tab.safeParse(value)
  return result.success ? result.data : 'rollups'
}

export function encodeFilterables(
  entries: Record<L2Tab, FilterableEntry[]>,
): TabbedFilterables {
  const values: FilterableValue[] = []
  const indexByKey = new Map<string, number>()

  const indexOf = (value: FilterableValue) => {
    const key = `${value.id}\0${value.value}`
    let index = indexByKey.get(key)
    if (index === undefined) {
      index = values.push(value) - 1
      indexByKey.set(key, index)
    }
    return index
  }

  const tabs = mapTabs(entries, (tabEntries) =>
    tabEntries.map((entry) => entry.filterable?.map(indexOf) ?? null),
  )
  return { values, tabs }
}

export function decodeFilterables(
  filterables: TabbedFilterables,
): Record<L2Tab, FilterableEntry[]> {
  return mapTabs(filterables.tabs, (indices) =>
    indices.map((entryIndices) => ({
      filterable: entryIndices?.map(
        (i) => filterables.values[i] as FilterableValue,
      ),
    })),
  )
}

function mapTabs<A, B>(
  tabs: Record<L2Tab, A>,
  fn: (value: A) => B,
): Record<L2Tab, B> {
  return Object.fromEntries(
    L2_TABS.map((tab) => [tab, fn(tabs[tab])]),
  ) as Record<L2Tab, B>
}
