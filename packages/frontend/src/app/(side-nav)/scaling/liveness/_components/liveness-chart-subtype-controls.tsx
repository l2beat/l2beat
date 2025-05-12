'use client'

import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import { ChartTimeRangeControls } from '~/components/core/chart/chart-time-range-controls'

interface Props {
  subtype: TrackedTxsConfigSubtype
  setSubtype: (subtype: TrackedTxsConfigSubtype) => void
  projectSection?: boolean
  configuredSubtypes: TrackedTxsConfigSubtype[]
}

const VALUES: { value: TrackedTxsConfigSubtype; label: string }[] = [
  { value: 'batchSubmissions', label: 'TX DATA' },
  { value: 'proofSubmissions', label: 'PROOFS' },
  { value: 'stateUpdates', label: 'STATE UPDATES' },
]

export function LivenessChartSubtypeControls({
  subtype,
  setSubtype,
  projectSection,
  configuredSubtypes,
}: Props) {
  return (
    <ChartTimeRangeControls
      name="livenessChartTimeRange"
      value={subtype}
      setValue={setSubtype}
      options={VALUES.filter((x) => configuredSubtypes.includes(x.value))}
      projectSection={projectSection}
    />
  )
}
