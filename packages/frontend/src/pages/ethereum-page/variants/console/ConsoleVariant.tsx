import { useMemo } from 'react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { getSimulatedHistory } from '../../live/simulatedHistory'
import type { VariantProps } from '../types'
import { Deck } from './deck/Deck'
import { Masthead } from './Masthead'
import { Capacity } from './sections/Capacity'
import { Cost } from './sections/Cost'
import { Economics } from './sections/Economics'
import { Relies } from './sections/Relies'
import { RiskSections } from './sections/RiskSections'
import { getVerdict } from './verdict'

/**
 * Console: mission control for researchers. Every live signal sits above the
 * fold in one instrument; the deeper sections below keep its panel language,
 * in the page's story order: capacity, cost, who relies on it, the asset and
 * what you trust
 */
export function ConsoleVariant({ entry, posters, historyEnd }: VariantProps) {
  const history = useMemo(() => getSimulatedHistory(historyEnd), [historyEnd])
  const posterById = useMemo(
    () => new Map(posters.map((p) => [p.id, p])),
    [posters],
  )
  const posterColors = useMemo(
    () => new Map(posters.map((p) => [p.id, p.color])),
    [posters],
  )
  const verdict = useMemo(() => getVerdict(entry), [entry])

  return (
    <div className="pb-6 leading-[1.4] md:pt-2">
      <Masthead entry={entry} />
      <Deck
        posters={posterById}
        posterColors={posterColors}
        history={history}
        verdict={verdict.items}
        isUnderReview={verdict.isUnderReview}
      />
      <Capacity history={history} posterColors={posterColors} />
      <Cost history={history} />
      <HighlightableLinkContextProvider>
        <Relies
          entry={entry}
          posters={posterById}
          posterColors={posterColors}
        />
        <Economics history={history} />
        <RiskSections entry={entry} verdict={verdict} />
      </HighlightableLinkContextProvider>
    </div>
  )
}
