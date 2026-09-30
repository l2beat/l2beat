import type { Sentiment } from '@l2beat/config'
import type { L3RiskAnalysisSectionProps } from '~/components/projects/sections/L3RiskAnalysisSection'
import type { RosetteValue } from '~/components/rosette/types'
import {
  heading,
  joinBlocks,
  nestHeadings,
  subsection,
  table,
  warning,
  withSentiment,
} from './markdown'

/**
 * A rosette value on one line, worded as the HTML risk banner: an exit
 * window with a regular upgrade path shows both paths.
 */
export function formatRiskValue(risk: RosetteValue) {
  const main = qualify(risk.value, [
    risk.regular && 'emergency upgrade path',
    risk.secondLine && oneLine(risk.secondLine),
    sentimentNote(risk.sentiment),
  ])
  if (!risk.regular) return main
  const regular = qualify(risk.regular.value, [
    'regular upgrade path',
    sentimentNote(risk.regular.sentiment),
  ])
  return `${main}; ${regular}`
}

/** Config wraps some second lines, which the HTML reflows anyway. */
function oneLine(text: string) {
  return text.replaceAll(/\s+/g, ' ').trim()
}

/** The HTML shows it under the value, with its own sentiment color. */
export function formatRiskWarning(risk: RosetteValue) {
  return risk.warning
    ? warning(withSentiment(risk.warning.value, risk.warning.sentiment))
    : ''
}

/** Each value as the HTML risk banner: value, regular upgrade path, warning, then the explanation. */
export function renderRiskValues(values: RosetteValue[], level: number) {
  return joinBlocks(
    values.map((risk) =>
      joinBlocks([
        heading(level, risk.name),
        formatRiskValue(risk),
        nestHeadings(risk.regular?.description, level + 1),
        formatRiskWarning(risk),
        nestHeadings(risk.description, level + 1),
      ]),
    ),
  )
}

export function isAnyRiskUnderReview(values: RosetteValue[]) {
  return values.some((value) => value.sentiment === 'UnderReview')
}

/** The HTML table comparing the host L2, the L3 alone and the L3 combined with its host, then the banners of the row that applies. */
export function renderL3RiskValues(
  {
    l2,
    l3,
    combined,
  }: Pick<L3RiskAnalysisSectionProps, 'l2' | 'l3' | 'combined'>,
  level: number,
) {
  const kind = combined ? 'combined' : 'individual'
  return joinBlocks([
    table(
      ['', ...l2.risks.map((risk) => risk.name)],
      [
        [`${l2.name} (L2)`, ...l2.risks.map(formatRiskCell)],
        [`${l3.name} (L3, individual)`, ...l3.risks.map(formatRiskCell)],
        [
          `${l3.name} (L3, combined)`,
          ...(combined?.map(formatRiskCell) ??
            l3.risks.map(() => 'Under review')),
        ],
      ],
    ),
    subsection(
      level,
      `L3 ${kind} risks`,
      joinBlocks([
        `The information below reflects ${combined ? 'combined L2 & L3' : 'individual L3'} risks.`,
        renderRiskValues(combined ?? l3.risks, level + 1),
      ]),
    ),
  ])
}

function formatRiskCell(risk: RosetteValue) {
  return withSentiment(risk.value, risk.sentiment)
}

function qualify(value: string, notes: (string | false | undefined)[]) {
  const present = notes.filter((note): note is string => !!note)
  return present.length > 0 ? `${value} (${present.join('; ')})` : value
}

function sentimentNote(sentiment: Sentiment | undefined) {
  return sentiment && `sentiment: ${sentiment}`
}
