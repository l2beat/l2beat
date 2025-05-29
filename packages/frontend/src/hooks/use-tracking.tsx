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
    allValues?: string
    additionalFilters: number
  }
  filterRemoved: { name: string }
  filterInversed: { name: string; allValues: string }
}

export type Plausible = {
  <T extends keyof MyEvents>(
    event: T,
    ...args: MyEvents[T] extends never ? [] : [{ props: MyEvents[T] }]
  ): void
}

export function useTracking() {
  return {
    track: <T extends keyof MyEvents>(
      key: T,
      ...args: MyEvents[T] extends never ? [] : [{ props: MyEvents[T] }]
    ) => {
      return window.plausible(key, ...args)
    },
  }
}
