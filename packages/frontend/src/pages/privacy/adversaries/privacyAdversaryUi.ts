import type {
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyExposure,
  PrivacyFieldExposure,
  TableReadyValue,
} from '@l2beat/config'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'

export const PRIVACY_ADVERSARIES_TOOLTIP =
  'On public blockchains like Ethereum, all actions transparent by default. A privacy protocol can at best cut the link between addresses or offer privacy while deposited. The colour says whether a careful user can keep the link, amount or recipient private against that adversary: green yes, yellow only outside supported options or by accepting another leak, red no.'

export const PRIVACY_EXPOSURE_LABEL: Record<PrivacyExposure, string> = {
  private: 'private',
  atRisk: 'at risk',
  exposed: 'exposed',
  unverifiable: 'unverifiable',
}

/** Chip colours of the interior field verdicts. */
export const PRIVACY_EXPOSURE_CHIP_CLASS_NAME: Record<PrivacyExposure, string> =
  {
    private: 'text-[#17452A] bg-[#C8F2D7] border-[#4FB875]',
    atRisk: 'text-[#5C3B00] bg-[#FFE8A3] border-[#D9A31A]',
    exposed: 'text-[#5D1111] bg-[#FFC9C9] border-[#E06565]',
    unverifiable: 'text-[#3A3F4B] bg-[#E3E6EC] border-[#9AA1AE]',
  }

/** Text colours of the interior field verdicts. */
export const PRIVACY_EXPOSURE_TEXT_CLASS_NAME: Record<PrivacyExposure, string> =
  {
    private: 'text-[#2C8A57] dark:text-[#4FC98B]',
    atRisk: 'text-[#C9900E] dark:text-[#E7A63A]',
    exposed: 'text-[#C2413E] dark:text-[#F07670]',
    unverifiable: 'text-[#6A5DB5] dark:text-[#AA9DEA]',
  }

/** Title of the interior field chips; entry and exit are public and have none. */
export const PRIVACY_INTERIOR_LABEL = 'Inside'

export function getExposure(leak: PrivacyFieldExposure): PrivacyExposure {
  return typeof leak === 'string' ? leak : leak.verdict
}

export function getExposureNote(
  leak: PrivacyFieldExposure,
): string | undefined {
  return typeof leak === 'string' ? undefined : leak.note
}

/** Title of a hover card for one adversary, e.g. "Against public observer". */
export function getPrivacyAdversaryTitle(label: string): string {
  return `Against ${label.charAt(0).toLowerCase()}${label.slice(1)}`
}

/** Points a cell contributes to the score; green is worth the most. */
const PRIVACY_SENTIMENT_POINTS: Record<PrivacyAdversarySentiment, number> = {
  good: 2,
  warning: 1,
  bad: 0,
}

/**
 * Every adversary summed, two points for green and one for yellow, so a higher
 * score is a better protocol. Orders the summary table. Unlike the folded
 * value below it counts the future adversary too, so the ranking grades the
 * whole spine of the assessment.
 */
export function getPrivacyAdversariesScore(
  adversaries: PrivacyAdversariesSummary,
): number {
  return adversaries.cells.reduce(
    (score, cell) => score + PRIVACY_SENTIMENT_POINTS[cell.sentiment],
    0,
  )
}

/**
 * All adversaries folded into one value: the homepage dot colour. The future
 * adversary is left out: it grades a potential post-quantum world, not
 * today's protocol. Any red cell makes it red, otherwise the majority colour
 * wins and a tie is green. Within a colour, fewer red and yellow cells sort
 * first.
 */
export function getPrivacyAdversariesTableValue(
  adversaries: PrivacyAdversariesSummary,
): TableReadyValue {
  const graded = adversaries.cells.filter((c) => c.id !== 'futureAdversary')
  const bad = graded.filter((c) => c.sentiment === 'bad').length
  const warnings = graded.filter((c) => c.sentiment === 'warning').length
  return {
    value: adversaries.promiseLabel,
    sentiment:
      bad > 0
        ? 'bad'
        : warnings > graded.length - warnings
          ? 'warning'
          : 'good',
    orderHint: -(bad * 10 + warnings),
  }
}

/** Anchor of an adversary block inside the project page section. */
export function getPrivacyAdversaryAnchor(id: PrivacyAdversaryId): string {
  return `privacy-adversaries-${id}`
}
