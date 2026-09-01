import type { ProjectCentralizedSequencingSpec } from '@l2beat/config'

export type CentralizedSequencingFieldKey = Exclude<
  keyof ProjectCentralizedSequencingSpec,
  'type'
>

interface CentralizedSequencingFieldMeta {
  /** Row label on the project-page spec sheet. */
  label: string
  /** Column header on the sequencing risk table. */
  header: string
  /** Column tooltip on the sequencing risk table. */
  tooltip: string
}

/**
 * Single source of field metadata for both centralized-sequencing renderers.
 * The Record is keyed by the spec's own fields, so adding a field to
 * ProjectCentralizedSequencingSpec fails compilation here until it gets
 * metadata — neither UI can silently drop it.
 */
export const CENTRALIZED_SEQUENCING_FIELDS: Record<
  CentralizedSequencingFieldKey,
  CentralizedSequencingFieldMeta
> = {
  trustedPreconfirmation: {
    label: 'Trusted preconfirmation',
    header: 'Trusted\npreconfirmation',
    tooltip:
      'Target latency of the trusted sequencer preconfirmation. The second line shows the regular L2 block time (another preconfirmation in most protocols).',
  },
  trustedOrdering: {
    label: 'Trusted ordering',
    header: 'Trusted\nordering',
    tooltip:
      'Policy the centralized sequencer claims to use for ordering transactions. Not enforced by the host chain.',
  },
  sequencer: {
    label: 'Sequencer',
    header: 'Sequencer',
    tooltip: 'Operators controlling real-time transaction ordering.',
  },
  realtimeCensorshipResistance: {
    label: 'Real-time censorship resistance',
    header: 'RT\nCR',
    tooltip:
      'Realtime CR: Whether the normal low-latency sequencing path resists censorship by the operator.',
  },
  forcedInclusion: {
    label: 'Forced inclusion',
    header: 'Forced\ninclusion',
    tooltip:
      'How users bypass the sequencer while the chain is otherwise live (selective censorship), and how many L1 transactions this inclusion path requires.',
  },
  inclusionDelay: {
    label: 'Inclusion delay',
    header: 'Inclusion\ndelay',
    tooltip:
      'Protocol delay after the first L1 transaction is included until the transaction enters the canonical L2 order while the chain otherwise remains live (selective censorship).',
  },
  inclusionMechanics: {
    label: 'Inclusion mechanics',
    header: 'Inclusion\nmechanics',
    tooltip:
      'How forced inclusion works, including transaction format, size, address aliasing, resource limits and permission controls.',
  },
  exitDelay: {
    label: 'Exit delay',
    header: 'Exit\ndelay',
    tooltip:
      'Worst-case protocol delay to force inclusion (sequencer failure), self-propose the resulting state (proposer failure), resolve any challenge and finalize an L1 exit under blanket censorship or operator walkaway.',
  },
  exitEconomics: {
    label: 'Exit economics',
    header: 'Exit\neconomics',
    tooltip:
      'Capital and proof or dispute work required to self-propose and defend one state update needed for an exit under blanket censorship or operator walkaway.',
  },
}

export const CENTRALIZED_SEQUENCING_FIELD_KEYS = Object.keys(
  CENTRALIZED_SEQUENCING_FIELDS,
) as CentralizedSequencingFieldKey[]
