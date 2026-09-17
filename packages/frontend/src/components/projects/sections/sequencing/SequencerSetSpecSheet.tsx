import type { ProjectSequencerSetSpec } from '@l2beat/config'
import { SpecSheet } from './SpecSheet'

interface Props {
  spec: ProjectSequencerSetSpec
}

const SPEC_ROWS = [
  { key: 'blockTime', label: 'L2 block time' },
  { key: 'proposerRotationTime', label: 'Proposer rotation' },
  { key: 'committeeRotationTime', label: 'Committee rotation' },
  { key: 'sequencerCount', label: 'Number of block producers' },
  { key: 'blockProductionAccess', label: 'Access to block production rights' },
  { key: 'stakePerValidator', label: 'Stake per validator' },
  { key: 'rateLimit', label: 'Rate-limit to join' },
  { key: 'deterministicCrGadget', label: 'Deterministic CR gadget' },
  { key: 'additionalCrGadgets', label: 'Additional CR gadgets' },
] satisfies { key: keyof ProjectSequencerSetSpec; label: string }[]

export function SequencerSetSpecSheet({ spec }: Props) {
  const rows = SPEC_ROWS.filter(
    ({ key }) => key !== 'committeeRotationTime' || spec[key] !== undefined,
  ).map(({ key, label }) => ({ label, value: spec[key] }))

  return <SpecSheet title="Sequencer set spec sheet" rows={rows} />
}
