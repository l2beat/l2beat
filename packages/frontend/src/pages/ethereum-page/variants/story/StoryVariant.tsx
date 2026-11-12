import { useMemo } from 'react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { ProjectDetails } from '~/components/projects/ProjectDetails'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { useEthereumHead } from '../../live/EthereumHeadContext'
import { getSimulatedHistory } from '../../live/simulatedHistory'
import type { VariantProps } from '../types'
import { TYPE } from './Article'
import { BlockFigures } from './BlockFigures'
import { Capacity } from './chapters/Capacity'
import { Cost } from './chapters/Cost'
import { Economics } from './chapters/Economics'
import { Reliance } from './chapters/Reliance'
import { TrustChapter, toAssessment, Verdict } from './chapters/Trust'
import { Dateline } from './Dateline'
import { DAY_SECONDS, getWindowStats } from './facts'
import { Lede } from './Lede'
import { Sources } from './Sources'
import { toTodayPoint } from './today'

const RISK_SECTIONS: ProjectDetailsSection['type'][] = [
  'DaRiskSummarySection',
  'GrissiniRiskAnalysisSection',
  'MarkdownSection',
]

/**
 * Story: the page as a long read that writes itself from the chain. A lede
 * sentence about the newest block, then five chapters, each headed by a
 * claim built from live data with one annotated chart under it, and our
 * assessment at the end. The existing assessment sections slot in as the
 * chapters' own cards.
 */
export function StoryVariant({ entry, posters, historyEnd }: VariantProps) {
  const head = useEthereumHead()
  const history = useMemo(() => getSimulatedHistory(historyEnd), [historyEnd])
  const posterMap = useMemo(
    () => new Map(posters.map((p) => [p.id, p])),
    [posters],
  )
  const window = useMemo(() => getWindowStats(head.blocks), [head.blocks])
  const today = useMemo(() => toTodayPoint(head.today), [head.today])
  const assessment = useMemo(
    () => toAssessment(entry.sections),
    [entry.sections],
  )
  const flows = entry.sections.filter((s) => s.type === 'InteropFlowsSection')
  const risks = entry.sections.filter((s) => RISK_SECTIONS.includes(s.type))
  const from = history[0]?.timestamp ?? historyEnd
  const to = historyEnd + DAY_SECONDS

  return (
    <div className="smooth-scroll relative">
      <Dateline head={head} />
      <article className="bg-surface-primary px-4 pt-8 pb-10 font-inter max-md:border-divider max-md:border-b md:rounded-b-xl md:px-8 md:pt-12 md:pb-12 xl:px-12">
        <header className="mb-6 flex items-center gap-2.5 md:mb-8">
          <img src={entry.icon} alt="" className="size-6" />
          <h1 className="font-semibold text-[17px]">Ethereum</h1>
          <span className="text-[15px] text-secondary max-sm:hidden">
            the base layer, written live from the chain
          </span>
        </header>
        <div className="max-w-[54rem]">
          <Lede head={head} />
        </div>
        <section className="mt-10 md:mt-14" aria-label="The newest block">
          <h2 className={TYPE.label}>
            The block behind that sentence, at the head of the chain
          </h2>
          <div className="mt-3">
            <BlockFigures head={head} window={window} />
          </div>
        </section>
        <div className="mt-10 border-divider border-t pt-8 md:mt-12 md:pt-10">
          <Verdict assessment={assessment} head={head} />
        </div>
      </article>

      <Capacity
        history={history}
        head={head}
        window={window}
        today={today}
        posters={posterMap}
        from={from}
        to={to}
        storageSeconds={entry.header.durationStorage}
      />
      <Cost
        history={history}
        block={head.head}
        window={window}
        today={today}
        from={from}
        to={to}
      />
      <Reliance
        window={window}
        posters={posterMap}
        usedIn={entry.header.usedIn}
        tvs={entry.header.tvs}
      />
      <HighlightableLinkContextProvider>
        <ProjectDetails items={flows} parentSection="3" />
      </HighlightableLinkContextProvider>
      <Economics
        history={history}
        head={head}
        today={today}
        from={from}
        to={to}
      />
      <TrustChapter assessment={assessment} />
      <HighlightableLinkContextProvider>
        <ProjectDetails items={risks} parentSection="5" />
      </HighlightableLinkContextProvider>
      <Sources />
    </div>
  )
}
