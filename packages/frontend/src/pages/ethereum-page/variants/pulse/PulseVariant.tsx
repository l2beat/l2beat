import { useMemo } from 'react'
import { useEthereumHead } from '../../live/EthereumHeadContext'
import { getSimulatedHistory } from '../../live/simulatedHistory'
import type { VariantProps } from '../types'
import { CapacityBand } from './capacity/CapacityBand'
import { CostBand } from './cost/CostBand'
import { EconomicsBand } from './economics/EconomicsBand'
import { PulseHero } from './hero/PulseHero'
import { RelianceBand } from './reliance/RelianceBand'
import { RiskBand } from './risk/RiskBand'
import { getVerdict } from './risk/verdict'
import { useRewind } from './useRewind'
import { useSlotClock } from './useSlotClock'

/**
 * Pulse: one heartbeat, for everyone. The first screen is the chain's live
 * heartbeat and a handful of big numbers; each band below answers one
 * question in a sentence and a chart, and keeps the detail behind "Go deeper".
 */
export function PulseVariant({ entry, posters, historyEnd }: VariantProps) {
  const live = useEthereumHead()
  const clock = useSlotClock(live.head, live.nextSlotAt)
  const rewind = useRewind(live.lastReorg)
  const verdict = useMemo(() => getVerdict(entry), [entry])
  const history = useMemo(() => getSimulatedHistory(historyEnd), [historyEnd])
  const posterById = useMemo(
    () => new Map(posters.map((p) => [p.id, p])),
    [posters],
  )
  const interopSection = entry.sections.find(
    (s) => s.type === 'InteropFlowsSection',
  )

  return (
    <div className="pb-6 md:pt-2">
      <PulseHero live={live} clock={clock} rewind={rewind} verdict={verdict} />
      <CapacityBand live={live} history={history} posters={posterById} />
      <CostBand live={live} history={history} />
      <RelianceBand
        entry={entry}
        blocks={live.blocks}
        posters={posterById}
        interopSection={interopSection}
      />
      <EconomicsBand live={live} history={history} />
      <RiskBand entry={entry} verdict={verdict} />
    </div>
  )
}
