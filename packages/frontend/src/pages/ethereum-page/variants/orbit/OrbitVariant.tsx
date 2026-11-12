import { useMemo } from 'react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import { useEthereumHead } from '../../live/EthereumHeadContext'
import { getSimulatedHistory } from '../../live/simulatedHistory'
import type { VariantProps } from '../types'
import { OrbitHero } from './hero/OrbitHero'
import { getWindowStats, toPosterMap } from './model'
import { CapacitySection } from './sections/CapacitySection'
import { CostSection } from './sections/CostSection'
import { EconomicsSection } from './sections/EconomicsSection'
import { RelianceSection } from './sections/RelianceSection'
import { RiskSection } from './sections/RiskSection'

/**
 * Orbit: who relies on Ethereum, first. The hero is a live map of the systems
 * posting to Ethereum around it; the sections below keep the dependency
 * framing: the room left for them, what they pay, who they are, the asset
 * securing them, and the risk they all inherit
 */
export function OrbitVariant({ entry, posters, historyEnd }: VariantProps) {
  const live = useEthereumHead()
  const posterMap = useMemo(() => toPosterMap(posters), [posters])
  const stats = useMemo(
    () => getWindowStats(live.blocks, live.head, posterMap),
    [live.blocks, live.head, posterMap],
  )
  // seeded, so the server and the browser draw the same history
  const history = useMemo(() => getSimulatedHistory(historyEnd), [historyEnd])
  const flows = entry.sections.filter((s) => s.type === 'InteropFlowsSection')

  return (
    <HighlightableLinkContextProvider>
      <div className="smooth-scroll">
        <OrbitHero
          entry={entry}
          live={live}
          stats={stats}
          posters={posterMap}
        />
        <CapacitySection
          live={live}
          stats={stats}
          history={history}
          posters={posterMap}
        />
        <CostSection live={live} history={history} />
        <RelianceSection entry={entry} live={live} stats={stats} />
        <ProjectDetails items={flows} parentSection="3" />
        <EconomicsSection entry={entry} live={live} history={history} />
        <RiskSection entry={entry} live={live} />
      </div>
    </HighlightableLinkContextProvider>
  )
}
