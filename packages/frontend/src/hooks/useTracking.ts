import { v } from '@l2beat/validate'
import { useCallback } from 'react'

export const PlausibleEvents = v.object({
  switchChanged: v.object({ name: v.string(), value: v.string() }),
  checkboxChanged: v.object({ name: v.string(), value: v.string() }),
  radioGroupChanged: v.object({ name: v.string(), value: v.string() }),
  directoryTabsChanged: v.object({ value: v.string() }),
  tabsChanged: v.object({ name: v.string(), value: v.string() }),
  searchBarProjectSelected: v.object({ name: v.string() }),
  searchBarSearched: v.object({ value: v.string() }),
  uopsExplorerSelected: v.undefined().optional(),
  trustedSetupFrameworkSelected: v.undefined().optional(),
  whatsNewClicked: v.object({
    device: v.enum(['desktop', 'mobile']),
    action: v.enum(['open', 'close']),
  }),

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

type Plausible = {
  <T extends keyof PlausibleEvents>(
    event: T,
    ...args: PlausibleEvents[T] extends undefined
      ? []
      : [{ props: PlausibleEvents[T] }]
  ): void
}

export function useTracking(): { track: Plausible } {
  const track: Plausible = useCallback((event, ...args) => {
    window.plausible?.(event, ...args)
  }, [])

  return {
    track,
  }
}
