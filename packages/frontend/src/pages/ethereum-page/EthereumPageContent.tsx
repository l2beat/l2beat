import { useMemo } from 'react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import { ProjectsUsedIn } from '~/components/ProjectsUsedIn'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import type { EthereumProjectPageEntry } from '~/server/features/data-availability/project/getEthereumProjectEntry'
import { formatInteger, formatUsd } from './format'
import { riskVerdicts } from './risk'
import { Blobs } from './sections/Blobs'
import { Cost } from './sections/Cost'
import { Economics } from './sections/Economics'
import { Flows } from './sections/Flows'
import { Now } from './sections/Now'
import { Risk } from './sections/Risk'
import { AnchorProvider } from './state/anchor'
import { HistoryProvider } from './state/history'
import { PostersProvider } from './state/posters'
import { RewindProvider } from './state/rewind'
import { UpgradeFocusProvider } from './state/upgradeFocus'
import { CadenceMark } from './ui/Section'

export interface EthereumPageContentProps {
  /** The DA assessment: risk summary, risk analysis and technology sections */
  entry: EthereumProjectPageEntry
  /** Every project that posts blobs to Ethereum */
  posters: BlobPoster[]
  /** Unix seconds, 00:00 UTC today: where the daily history ends */
  historyEnd: number
}

/**
 * The page opens on the chain as it is now, then tells each part of
 * Ethereum's past week, and ends on what its users have to trust.
 */
export function EthereumPageContent({
  entry,
  posters,
  historyEnd,
}: EthereumPageContentProps) {
  const verdicts = useMemo(() => riskVerdicts(entry), [entry])
  return (
    <PostersProvider posters={posters}>
      <HistoryProvider historyEnd={historyEnd}>
        <AnchorProvider>
          <RewindProvider>
            <UpgradeFocusProvider>
              <HighlightableLinkContextProvider>
                <div className="flex flex-col md:gap-4">
                  <Header entry={entry} />
                  <Now order={1} />
                  <Cost order={2} />
                  <Blobs order={3} />
                  <Economics order={4} entry={entry} />
                  <Flows order={5} entry={entry} />
                  <Risk order={6} entry={entry} verdicts={verdicts} />
                </div>
              </HighlightableLinkContextProvider>
            </UpgradeFocusProvider>
          </RewindProvider>
        </AnchorProvider>
      </HistoryProvider>
    </PostersProvider>
  )
}

/** Who relies on Ethereum, before any number about the chain itself */
function Header({ entry }: { entry: EthereumProjectPageEntry }) {
  return (
    <header className="flex flex-col gap-5 px-4 pt-6 pb-5 md:px-1 md:pt-8 md:pb-1 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <img src={entry.icon} alt="" className="size-9 md:size-11" />
          <h1 className="text-heading-32 md:text-heading-44">{entry.name}</h1>
        </div>
        <p className="mt-3 max-w-[56ch] text-paragraph-15 text-secondary md:text-paragraph-16">
          The base layer every system we assess relies on: what it carries, what
          it costs and what its users have to trust, live from the tip of the
          chain.
        </p>
      </div>
      <div className="flex flex-col gap-2 lg:items-end lg:text-right">
        <div className="flex items-center gap-2 font-medium text-label-value-13 text-secondary">
          Value secured by systems using Ethereum for data
          <CadenceMark cadence="day" />
        </div>
        <div className="font-bold text-heading-28 tabular-nums md:text-heading-32">
          {formatUsd(entry.header.tvs)}
        </div>
        <div className="flex items-center gap-2 text-label-value-13 text-secondary lg:flex-row-reverse">
          <ProjectsUsedIn
            usedIn={entry.header.usedIn}
            className="flex-wrap justify-start"
          />
          <span>{formatInteger(entry.header.usedIn.length)} systems</span>
        </div>
      </div>
    </header>
  )
}
