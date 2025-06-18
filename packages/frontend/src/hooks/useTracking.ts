import { v } from '@l2beat/validate'

export const PlausibleEvents = v.object({
  switchChanged: v.object({ name: v.string(), value: v.string() }),
  checkboxChanged: v.object({ name: v.string(), value: v.string() }),
  radioGroupChanged: v.object({ name: v.string(), value: v.string() }),
  directoryTabsChanged: v.object({ value: v.string() }),
  searchBarProjectSelected: v.object({ name: v.string() }),
  uopsExplorerSelected: v.undefined().optional(),

  // Filters
  filtersOpened: v.undefined().optional(),
  filterIdSelected: v.object({ name: v.string() }),
  filterValueSelected: v.object({
    name: v.string(),
    value: v.string(),
    allValues: v.string().optional(),
    additionalFilters: v.number(),
  }),
  filterRemoved: v.object({ name: v.string() }),
  filterInversed: v.object({ name: v.string(), allValues: v.string() }),
})
export type PlausibleEvents = v.infer<typeof PlausibleEvents>

export type Plausible = {
  <T extends keyof PlausibleEvents>(
    event: T,
    ...args: PlausibleEvents[T] extends undefined
      ? []
      : [{ props: PlausibleEvents[T] }]
  ): void
}

export function useTracking(): { track: Plausible } {
  return {
    track: (event, ...args) => {
      window.plausible?.(event, ...args)
    },
  }
}
