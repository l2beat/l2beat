import type { ProjectSequencerSetSpec } from '@l2beat/config'
import { SpecSheet } from './SpecSheet'
import { getSequencerSetRows } from './sequencerSetFields'

interface Props {
  spec: ProjectSequencerSetSpec
}

export function SequencerSetSpecSheet({ spec }: Props) {
  return (
    <SpecSheet
      title="Sequencer set spec sheet"
      rows={getSequencerSetRows(spec)}
    />
  )
}
