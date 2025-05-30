import { z } from 'zod'

export const PlausibleEvents = z.object({
  switchChanged: z.object({ name: z.string(), value: z.string() }),
  checkboxChanged: z.object({ name: z.string(), value: z.string() }),
  radioGroupChanged: z.object({ name: z.string(), value: z.string() }),
  directoryTabsChanged: z.object({ value: z.string() }),
  searchBarProjectSelected: z.object({ name: z.string() }),
  uopsExplorerSelected: z.undefined().optional(),

  // Filters
  filtersOpened: z.undefined().optional(),
  filterIdSelected: z.object({ name: z.string() }),
  filterValueSelected: z.object({
    name: z.string(),
    value: z.string(),
    allValues: z.string().optional(),
    additionalFilters: z.number(),
  }),
  filterRemoved: z.object({ name: z.string() }),
  filterInversed: z.object({ name: z.string(), allValues: z.string() }),
})
export type PlausibleEvents = z.infer<typeof PlausibleEvents>

export type Plausible = {
  <T extends keyof PlausibleEvents>(
    event: T,
    ...args: PlausibleEvents[T] extends never
      ? []
      : [{ props: PlausibleEvents[T] }]
  ): void
}

export function useTracking() {
  return {
    track: <T extends keyof PlausibleEvents>(
      key: T,
      ...args: PlausibleEvents[T] extends undefined
        ? []
        : [{ props: PlausibleEvents[T] }]
    ) => {
      fetch('/plausible/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: key,
          props: args[0]?.props,
        }),
      })
    },
  }
}
