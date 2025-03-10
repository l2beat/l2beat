import { partition } from 'lodash'
import type { CommonDaEntry } from '~/server/features/data-availability/get-common-da-entry'

export type TabbedDaEntries<T extends CommonDaEntry> = {
  publicSystems: T[]
  customSystems: T[]
}

export function groupByDaTabs<T extends CommonDaEntry>(
  projects: T[],
): TabbedDaEntries<T> {
  const [publicSystems, customSystems] = partition(
    projects,
    (p) => p.tab === 'public',
  )
  return {
    publicSystems,
    customSystems,
  }
}
