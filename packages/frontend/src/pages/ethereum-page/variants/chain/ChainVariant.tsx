import { useMemo } from 'react'
import { HighlightableLinkContextProvider } from '~/components/link/highlightable/HighlightableLinkContext'
import type { VariantProps } from '../types'
import { riskVerdicts } from './risk'
import { Capacity } from './sections/Capacity'
import { Cost } from './sections/Cost'
import { Economics } from './sections/Economics'
import { Inspector } from './sections/Inspector'
import { Relies } from './sections/Relies'
import { Risk } from './sections/Risk'
import { AnchorProvider } from './state/anchor'
import { HistoryProvider } from './state/history'
import { PostersProvider } from './state/posters'
import { RewindProvider } from './state/rewind'
import { ChainTimeline } from './timeline/ChainTimeline'
import { Legend } from './timeline/Legend'

/**
 * Chain: the page is a block timeline. The last 64 slots stay stuck to the
 * top, and the reader can pick any of them: every per-block number below then
 * shows that block, so "everything lives at the tip of the chain" becomes
 * literal, and a reorg rewinds the page with the chain.
 */
export function ChainVariant({ entry, posters, historyEnd }: VariantProps) {
  const verdicts = useMemo(() => riskVerdicts(entry), [entry])
  return (
    <PostersProvider posters={posters}>
      <HistoryProvider historyEnd={historyEnd}>
        <AnchorProvider>
          <RewindProvider>
            <HighlightableLinkContextProvider>
              <div className="flex flex-col md:gap-4">
                <header className="flex flex-col gap-4 px-4 pt-6 pb-5 md:px-1 md:pt-8 md:pb-1 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.icon}
                        alt=""
                        className="size-9 md:size-11"
                      />
                      <h1 className="text-heading-32 md:text-heading-44">
                        {entry.name}
                      </h1>
                    </div>
                    <p className="mt-3 max-w-[60ch] text-paragraph-15 text-secondary md:text-paragraph-16">
                      The base layer every system we assess relies on. Below are
                      its last 64 slots, live. Pick any block and every number
                      on the page shows that block.
                    </p>
                  </div>
                  <Legend />
                </header>
                <ChainTimeline />
                <Inspector verdicts={verdicts} />
                <Capacity order={1} />
                <Cost order={2} />
                <Relies order={3} entry={entry} />
                <Economics order={4} entry={entry} />
                <Risk order={5} entry={entry} verdicts={verdicts} />
              </div>
            </HighlightableLinkContextProvider>
          </RewindProvider>
        </AnchorProvider>
      </HistoryProvider>
    </PostersProvider>
  )
}
