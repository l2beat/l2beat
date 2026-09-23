import type {
  PrivacyAdversarySentiment,
  PrivacyExitWindow,
  PrivacySummaryValue,
  PrivacyWalkawayTest,
} from '@l2beat/config'
import type { TrustedSetupRisk } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type {
  PrivacyAdversariesSummary,
  PrivacyAdversarySummaryCell,
} from '~/server/features/privacy/types'
import {
  type PrivacyTrustedSetup,
  toTrustedSetupSummaryValue,
} from '~/server/features/privacy/utils/getPrivacyTrustedSetup'
import { getPrivacyAdversaryTitle } from '../adversaries/privacyAdversaryUi'
import { sentimentToRiskDot } from '../sentimentToRiskDot'

/** One slice of the rosette, and one row of its legend. */
export interface PrivacyRosetteSlice {
  id: string
  /** What the slice grades, e.g. "Against public observer" or "Exit window". */
  label: string
  /** The verdict itself, e.g. "At risk" or "7d". */
  value: string
  /**
   * Colours the slice and its legend dot. Kept as a risk rather than a
   * sentiment because the trusted setup has two shapes - the star and the
   * slash - that only the dot can carry.
   */
  risk: TrustedSetupRisk
  /** A qualifier the value cannot hold, such as the walkaway test. */
  detail?: {
    text: string
    /** Shown as a warning rather than as a plain footnote. */
    negative: boolean
  }
  /** The full assessment behind the slice, shown while it is hovered. */
  source:
    | { type: 'adversary'; cell: PrivacyAdversarySummaryCell }
    | {
        type: 'risk'
        description: string
        walkawayTest?: PrivacyWalkawayTest
      }
}

export interface PrivacyRosetteGroup {
  /** Legend heading of the half, e.g. "Recipient privacy". */
  title: string
  slices: PrivacyRosetteSlice[]
}

export interface PrivacyRosetteGroups {
  /** Left half, listed first. */
  adversaries: PrivacyRosetteGroup
  /** Right half. */
  risks: PrivacyRosetteGroup
}

export interface PrivacyRosetteInput {
  adversaries: PrivacyAdversariesSummary
  trustedSetup: PrivacyTrustedSetup
  exitWindow: PrivacyExitWindow
  reproducibility: PrivacySummaryValue
}

const ADVERSARY_VERDICT: Record<PrivacyAdversarySentiment, string> = {
  good: 'Private',
  warning: 'At risk',
  bad: 'Exposed',
}

/**
 * Everything the privacy page grades, as two halves of one rosette: the
 * adversary assessment on one side, the protocol risks that apply no matter
 * who is watching on the other.
 */
export function getPrivacyRosetteGroups({
  adversaries,
  trustedSetup,
  exitWindow,
  reproducibility,
}: PrivacyRosetteInput): PrivacyRosetteGroups {
  const trustedSetupValue = toTrustedSetupSummaryValue(trustedSetup)

  return {
    adversaries: {
      title: adversaries.promiseLabel,
      slices: adversaries.cells.map((cell) => ({
        id: cell.id,
        label: getPrivacyAdversaryTitle(cell.label),
        // Every cell value is the promised field plus a state ("Recipient at
        // risk"); the heading already names the field, so only the state is
        // repeated per row.
        value: ADVERSARY_VERDICT[cell.sentiment],
        risk: sentimentToRiskDot(cell.sentiment),
        source: { type: 'adversary', cell },
      })),
    },
    risks: {
      title: 'Protocol risks',
      slices: [
        {
          id: 'trustedSetup',
          label: 'Trusted setup',
          value: trustedSetupValue.value,
          risk: trustedSetupValue.risk,
          source: { type: 'risk', description: trustedSetupValue.description },
        },
        {
          id: 'exitWindow',
          label: 'Exit window',
          value: exitWindow.value,
          risk: sentimentToRiskDot(exitWindow.sentiment),
          detail: exitWindow.walkawayTest.passed
            ? { text: 'Walkaway passed', negative: false }
            : { text: 'Walkaway failed', negative: true },
          source: {
            type: 'risk',
            description: exitWindow.description,
            walkawayTest: exitWindow.walkawayTest,
          },
        },
        {
          id: 'reproducibility',
          label: 'Reproducibility',
          value: reproducibility.value,
          risk: sentimentToRiskDot(reproducibility.sentiment),
          source: { type: 'risk', description: reproducibility.description },
        },
      ],
    },
  }
}
