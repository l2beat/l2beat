import type {
  PrivacyAdversary,
  PrivacyAdversaryCell,
  PrivacyAdversarySentiment,
  PrivacyExposure,
  PrivacyFieldExposure,
  TableReadyValue,
} from '@l2beat/config'
import type { RosetteValue } from '~/components/rosette/types'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'

export const PRIVACY_ADVERSARIES_TOOLTIP =
  "Ethereum is public by default. Each protocol is rated on its main privacy promise, like hiding who paid, who received, how much, or which deposit became which withdrawal. Against each adversary, the colour says whether it holds for a careful user with the app's own settings: green yes, yellow only with significant extra work, red no."

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

/** The full cell description of the project page; the tooltip shows only the short one. */
export function getPrivacyAdversaryDescription(
  cell: Pick<PrivacyAdversaryCell, 'exposureShort' | 'exposureContinued'>,
): string {
  return [cell.exposureShort, cell.exposureContinued].filter(Boolean).join(' ')
}

/**
 * All adversaries folded into one value: the homepage dot colour and the
 * summary table sort key. The future adversary is left out: it grades a
 * future cryptographic break, not today's protocol. Any red cell makes it
 * red, otherwise the majority colour wins and a tie is green. Within a colour,
 * fewer red and yellow cells sort first.
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

/** How each slice of the rosette words its sentiment. */
export const PRIVACY_ADVERSARY_VERDICT: Record<
  PrivacyAdversarySentiment,
  string
> = {
  good: 'Private',
  warning: 'At risk',
  bad: 'Exposed',
}

/** One rosette slice per adversary, in spine order, explained by its reason. */
export function getPrivacyAdversaryRosetteValues(
  adversaries: PrivacyAdversariesSummary,
): RosetteValue[] {
  return adversaries.cells.map((cell) =>
    toPrivacyRosetteValue(cell.label, cell.sentiment, cell.reason),
  )
}

/** A slice of the project page rosette, explaining who the adversary is. */
export function getPrivacyAdversarySectionRosetteValue(
  adversary: PrivacyAdversary,
  cell: PrivacyAdversaryCell,
): RosetteValue {
  return toPrivacyRosetteValue(
    adversary.label,
    cell.sentiment,
    `${adversary.description} Examples: ${adversary.examples}`,
  )
}

function toPrivacyRosetteValue(
  name: string,
  sentiment: PrivacyAdversarySentiment,
  description: string,
): RosetteValue {
  return {
    name,
    value: PRIVACY_ADVERSARY_VERDICT[sentiment],
    sentiment,
    description,
  }
}

export const PRIVACY_ADVERSARIES_SECTION_ID = 'privacy-adversaries'

export function getPrivacyAdversariesSectionHref(projectHref: string): string {
  return `${projectHref}#${PRIVACY_ADVERSARIES_SECTION_ID}`
}
