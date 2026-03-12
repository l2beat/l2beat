import type { RouterOutputs } from '@l2beat/interop-backoffice'

export type SummaryEventRow = RouterOutputs['summary']['events'][number]
export type SummaryMessageRow = RouterOutputs['summary']['messages'][number]
export type SummaryMessagePairRow = SummaryMessageRow['chains'][number]
