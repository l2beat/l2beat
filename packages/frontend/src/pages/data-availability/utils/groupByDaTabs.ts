import partition from 'lodash/partition'
import type { CommonDaEntry } from '~/server/features/data-availability/getCommonDaEntry'

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
