import type { PrivacyAdversarySentiment } from '@l2beat/config'
import type { TrustedSetupRisk } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type {
  PrivacyAdversariesSummary,
  PrivacyAdversarySummaryCell,
} from '~/server/features/privacy/types'
import { getPrivacyAdversaryTitle } from '../adversaries/privacyAdversaryUi'
import { sentimentToRiskDot } from '../sentimentToRiskDot'

/** One slice of the rosette, and one row of its legend. */
export interface PrivacyRosetteSlice {
  id: string
  /** What the slice grades, e.g. "Against public observer". */
  label: string
  /** The verdict itself, e.g. "At risk". */
  value: string
  /** Colours the legend dot. */
  risk: TrustedSetupRisk
  /** The full assessment behind the slice, shown while it is hovered. */
  cell: PrivacyAdversarySummaryCell
}

const ADVERSARY_VERDICT: Record<PrivacyAdversarySentiment, string> = {
  good: 'Private',
  warning: 'At risk',
  bad: 'Exposed',
}

/** One slice per adversary the privacy page grades. */
export function getPrivacyRosetteSlices(
  adversaries: PrivacyAdversariesSummary,
): PrivacyRosetteSlice[] {
  return adversaries.cells.map((cell) => ({
    id: cell.id,
    label: getPrivacyAdversaryTitle(cell.label),
    // Every cell value is the promised field plus a state ("Recipient at
    // risk"); the heading already names the field, so only the state is
    // repeated per row.
    value: ADVERSARY_VERDICT[cell.sentiment],
    risk: sentimentToRiskDot(cell.sentiment),
    cell,
  }))
}
