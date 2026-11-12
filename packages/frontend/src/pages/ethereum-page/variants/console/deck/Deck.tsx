import { useRef, useState } from 'react'
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { cn } from '~/utils/cn'
import { useEthereumHead } from '../../../live/EthereumHeadContext'
import type { DailyPoint } from '../../../live/simulatedHistory'
import { useChainLog, useRewind } from '../live'
import { Instrument } from '../ui/Panel'
import { RewindContext } from '../ui/Ticker'
import type { VerdictItem } from '../verdict'
import { BlobSpace } from './BlobSpace'
import { BlockTape } from './BlockTape'
import { FeeMarket } from './FeeMarket'
import { Finality } from './Finality'
import { KpiRow } from './KpiRow'
import { StatusStrip } from './StatusStrip'
import { TodayRow } from './TodayRow'

const GROUPS = ['Tape', 'Fees', 'Blobs', 'Finality'] as const

/**
 * Every live signal in one instrument. On a desktop it is one aligned grid
 * above the fold; on a phone the four panels become groups to swipe between,
 * so the page stays dense without shrinking any of them past legibility
 */
export function Deck({
  posters,
  posterColors,
  history,
  verdict,
  isUnderReview,
}: {
  posters: Map<string, BlobPoster>
  posterColors: Map<string, string>
  history: DailyPoint[]
  verdict: VerdictItem[]
  isUnderReview: boolean
}) {
  const head = useEthereumHead()
  const reducedMotion = usePrefersReducedMotion()
  const rewind = useRewind(head, reducedMotion)
  const log = useChainLog(head)
  const rewinding = !!rewind && rewind.phase !== 'forward'

  return (
    <RewindContext value={rewinding}>
      <Instrument className="md:grid-cols-12" as="section">
        <StatusStrip
          head={head}
          verdict={verdict}
          isUnderReview={isUnderReview}
        />
        <KpiRow head={head} />
        <Swiper>
          <BlockTape
            blocks={head.blocks}
            limits={head.limits}
            rewind={rewind}
            lastReorg={head.lastReorg}
            log={log}
            posterColors={posterColors}
            className="md:col-span-7 md:row-span-2"
          />
          <FeeMarket
            blocks={head.blocks}
            limits={head.limits}
            className="md:col-span-5"
          />
          <BlobSpace
            blocks={head.blocks}
            limits={head.limits}
            posters={posters}
            posterColors={posterColors}
            className="md:col-span-5"
          />
          <Finality
            head={head}
            className="md:col-span-5 md:col-start-8 md:row-start-5"
          />
        </Swiper>
        <TodayRow
          today={head.today}
          history={history}
          className="md:col-span-7 md:col-start-1 md:row-start-5"
        />
      </Instrument>
    </RewindContext>
  )
}

/**
 * On phones a row of snapping panels with tabs; from `md` up it dissolves
 * (`display: contents`) and its panels take their places in the grid
 */
function Swiper({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  function go(index: number) {
    const element = track.current
    if (!element) return
    element.scrollTo({ left: index * element.clientWidth, behavior: 'smooth' })
  }

  return (
    <>
      <div
        role="tablist"
        aria-label="Live panels"
        className="flex gap-1 overflow-x-auto bg-surface-primary px-3 py-2 md:hidden"
      >
        {GROUPS.map((group, i) => (
          <button
            key={group}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => go(i)}
            className={cn(
              'h-7 rounded-md px-2.5 font-medium text-[12px] text-secondary',
              active === i && 'bg-surface-secondary text-primary',
            )}
          >
            {group}
          </button>
        ))}
      </div>
      <div
        ref={track}
        onScroll={(e) => {
          const element = e.currentTarget
          setActive(Math.round(element.scrollLeft / element.clientWidth))
        }}
        className="flex snap-x snap-mandatory gap-px overflow-x-auto bg-divider [scrollbar-width:none] md:contents [&>*]:w-full [&>*]:shrink-0 [&>*]:snap-start md:[&>*]:w-auto"
      >
        {children}
      </div>
    </>
  )
}
