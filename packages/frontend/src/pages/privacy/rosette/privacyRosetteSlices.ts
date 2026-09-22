import type { PrivacyExitWindow, PrivacySummaryValue } from '@l2beat/config'
import type { TrustedSetupRisk } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  type PrivacyTrustedSetup,
  toTrustedSetupSummaryValue,
} from '~/server/features/privacy/utils/getPrivacyTrustedSetup'
import { sentimentToRiskDot } from '../sentimentToRiskDot'

/** One slice of the rosette, and one row of its legend. */
export interface PrivacyRosetteSlice {
  id: string
  /** What the slice grades, e.g. "Public observer" or "Exit window". */
  label: string
  /** The verdict itself, e.g. "Private" or "7d". */
  value: string
  /**
   * Colours the slice and its legend dot. Kept as a risk rather than a
   * sentiment because the trusted setup has two shapes - the star and the
   * slash - that only the dot can carry.
   */
  risk: TrustedSetupRisk
  /** A qualifier the value cannot hold, such as the walkaway test. */
  detail?: string
}

export interface PrivacyRosetteGroup {
  /** Legend heading of the half, e.g. "Against adversaries". */
  title: string
  slices: PrivacyRosetteSlice[]
}

export interface PrivacyRosetteGroups {
  /** Right half. */
  adversaries: PrivacyRosetteGroup
  /** Left half. */
  risks: PrivacyRosetteGroup
}

export interface PrivacyRosetteInput {
  adversaries: PrivacyAdversariesSummary
  trustedSetup: PrivacyTrustedSetup
  exitWindow: PrivacyExitWindow
  reproducibility: PrivacySummaryValue
}

/**
 * Everything the privacy page grades, as two halves of one rosette: the
 * adversary assessment on one side, the protocol risks that apply no matter
 * who is watching on the other. Risk order follows the table columns.
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
      title: 'Against adversaries',
      slices: adversaries.cells.map((cell) => ({
        id: cell.id,
        label: cell.label,
        value: cell.value,
        risk: sentimentToRiskDot(cell.sentiment),
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
        },
        {
          id: 'exitWindow',
          label: 'Exit window',
          value: exitWindow.value,
          risk: sentimentToRiskDot(exitWindow.sentiment),
          detail: exitWindow.walkawayTest.passed
            ? 'Walkaway passed'
            : 'Walkaway failed',
        },
        {
          id: 'reproducibility',
          label: 'Reproducibility',
          value: reproducibility.value,
          risk: sentimentToRiskDot(reproducibility.sentiment),
        },
      ],
    },
  }
}
