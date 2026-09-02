import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DaThroughputEntry } from '~/server/features/data-availability/throughput/getDaThroughputEntries'
import { toTableEntry } from './DaThroughputPublicTable'

describe(toTableEntry.name, () => {
  it('uses the L2-only sync warning when L2-only data is selected', () => {
    const entry = {
      id: ProjectId('avail'),
      icon: '',
      name: 'Avail',
      slug: 'avail',
      backgroundColor: undefined,
      statuses: {
        syncWarning: 'No throughput data since 2026 August 31, 01:00 UTC.',
      },
      tab: 'public',
      href: '/avail',
      finality: undefined,
      isSynced: false,
      data: {
        syncWarning: 'No throughput data since 2026 August 31, 01:00 UTC.',
        pastDayData: undefined,
        maxThroughputPerSecond: 1,
        maxRegistered: undefined,
      },
      l2OnlyData: {
        syncWarning: 'No throughput data since 2026 August 30, 23:00 UTC.',
        pastDayData: undefined,
        maxThroughputPerSecond: 1,
        maxRegistered: undefined,
      },
    } satisfies DaThroughputEntry

    const result = toTableEntry(entry, true)

    expect(result.statuses?.syncWarning).toEqual(
      'No throughput data since 2026 August 30, 23:00 UTC.',
    )
    expect(result.isSynced).toEqual(false)
  })
})
