import { usePlausible } from 'next-plausible'

type MyEvents = {
  filterSelected: { filter: string; value: string }
  searchBarProjectSelected: { project: string }
}

export function useCustomEvent() {
  const plausible = usePlausible<MyEvents>()
  return plausible
}
