import type { ProjectSequencerSetSpec } from '@l2beat/config'

/** Display order of the sequencer set spec fields, shared by the spec sheet and its markdown. */
export const SEQUENCER_SET_FIELDS = [
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

/** Committee rotation only applies to sets with a committee, so the row is dropped when unset. */
export function getSequencerSetRows(spec: ProjectSequencerSetSpec) {
  return SEQUENCER_SET_FIELDS.filter(
    ({ key }) => key !== 'committeeRotationTime' || spec[key] !== undefined,
  ).map(({ key, label }) => ({ label, value: spec[key] }))
}
