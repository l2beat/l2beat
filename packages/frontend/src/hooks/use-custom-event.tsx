import { usePlausible } from 'next-plausible'

type MyEvents = {
  filterSelected: { name: string; value: string }
  checkboxChecked: { id: string; value: string }
  searchBarProjectSelected: { name: string }
  uopsExplorerSelected: never
}

export function useCustomEvent() {
  const plausible = usePlausible<MyEvents>()
  return plausible
}
