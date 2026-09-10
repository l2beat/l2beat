import type { ProjectCentralizedSequencingSpec } from '@l2beat/config'
import { CENTRALIZED_SEQUENCING_FIELDS } from './centralizedSequencingFields'
import { SpecSheet } from './SpecSheet'

interface Props {
  spec: ProjectCentralizedSequencingSpec
}

export function CentralizedSequencingSpecSheet({ spec }: Props) {
  const rows = CENTRALIZED_SEQUENCING_FIELDS.map(({ key, label }) => ({
    label,
    value: spec[key],
  }))

  return <SpecSheet title="Centralized sequencing spec sheet" rows={rows} />
}
