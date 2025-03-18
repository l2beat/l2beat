import { usePlausible } from 'next-plausible'

type MyEvents = {
  switchChanged: { name: string; value: string }
  checkboxChanged: { name: string; value: string }
  radioGroupChanged: { name: string; value: string }
  directoryTabsChanged: { value: string }
  searchBarProjectSelected: { name: string }
  uopsExplorerSelected: never

  // Filters
  filtersOpened: never
  filterIdSelected: { name: string }
  filterValueSelected: {
    name: string
    value: string
    otherValues: string[]
    additionalFilters: number
  }
  filterRemoved: { name: string }
  filterInversed: { name: string; values: string[] }
}

export function useTracking() {
  const plausible = usePlausible<MyEvents>()
  return { track: plausible }
}
