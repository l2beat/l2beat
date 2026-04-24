import { v } from '@l2beat/validate'
import { useCallback } from 'react'

export const OpenPanelEvents = v.object({
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
  chartRangeSelected: v.object({ name: v.string(), value: v.string() }),
  interopChainsSelected: v.object({
    chains: v.string(),
    page: v.string(),
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
export type OpenPanelEvents = v.infer<typeof OpenPanelEvents>

type OpenPanelTrack = {
  <T extends keyof OpenPanelEvents>(
    event: T,
    ...args: OpenPanelEvents[T] extends undefined ? [] : [OpenPanelEvents[T]]
  ): void
}

export function useTracking(): { track: OpenPanelTrack } {
  const track: OpenPanelTrack = useCallback((event, ...args) => {
    window.plausible?.(event, args[0] ? { props: args[0] } : undefined)
    window.op?.('track', event, ...args)
  }, [])

  return {
    track,
  }
}
