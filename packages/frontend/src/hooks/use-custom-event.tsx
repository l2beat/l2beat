import { usePlausible } from 'next-plausible'

type MyEvents = {
  switchChanged: { name: string; value: string }
  filterChanged: { name: string; value: string }
  checkboxChanged: { name: string; value: string }
  radioGroupChanged: { name: string; value: string }
  directoryTabsChanged: { value: string }
  searchBarProjectSelected: { name: string }
  uopsExplorerSelected: never
}

export function useTracking() {
  const plausible = usePlausible<MyEvents>()
  return { track: plausible }
}
