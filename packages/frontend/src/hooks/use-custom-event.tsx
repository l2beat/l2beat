import { usePlausible } from 'next-plausible'

type MyEvents = {
  filterChanged: { name: string; value: string }
  checkboxChanged: { name: string; value: string }
  radioGroupChanged: { name: string; value: string }
  directoryTabsChanged: { value: string }
  searchBarProjectSelected: { name: string }
  uopsExplorerSelected: never
}

export function useCustomEvent() {
  const plausible = usePlausible<MyEvents>()
  return plausible
}
