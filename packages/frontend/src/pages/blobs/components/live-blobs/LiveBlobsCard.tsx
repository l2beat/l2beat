import {
  lazy,
  Component as ReactComponent,
  type ReactNode,
  Suspense,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useIsClient } from '~/hooks/useIsClient'
import type { BlobPoster } from '~/server/features/data-availability/live-blobs/getBlobPosters'
import { LivePosters } from './LivePosters'
import { LivePulse } from './LivePulse'
import { LiveStats } from './LiveStats'
import { createLandings, LandingsContext } from './landings'
import { type BlockLimits, toLivePosters } from './model'

// Loaded on its own: it sits below the fold and draws only in the browser
const LiveBlocks = lazy(() =>
  import('./blocks/LiveBlocks').then((m) => ({ default: m.LiveBlocks })),
)

interface Props {
  /** Every project that posts blobs to Ethereum */
  projects: BlobPoster[]
  limits: BlockLimits
}

/** Ethereum's blobs, block by block, as they are made, above who posted them */
export function LiveBlobsCard({ projects, limits }: Props) {
  const posters = useMemo(() => toLivePosters(projects), [projects])
  const [highlighted, setHighlighted] = useState<string>()
  const toggleHighlighted = useCallback(
    (id: string) =>
      setHighlighted((current) => (current === id ? undefined : id)),
    [],
  )
  // the belt draws on a canvas sized to the screen, which the server has not got
  const isClient = useIsClient()
  const [landings] = useState(createLandings)

  return (
    <LandingsContext value={landings}>
      <PrimaryCard className="space-y-5">
        <LiveStats limits={limits} />
        {isClient ? (
          <LiveBoundary>
            <Suspense fallback={<LiveSkeleton />}>
              <LiveBlocks
                posters={posters}
                limits={limits}
                highlighted={highlighted}
                onSelect={toggleHighlighted}
                history={<LivePulse limits={limits} />}
              />
            </Suspense>
          </LiveBoundary>
        ) : (
          <LiveSkeleton />
        )}
        <LivePosters
          posters={posters}
          highlighted={highlighted}
          onSelect={toggleHighlighted}
        />
      </PrimaryCard>
    </LandingsContext>
  )
}

function LiveSkeleton() {
  // as tall as the belt with the hour and the legend under it
  return <Skeleton className="h-[30rem] w-full rounded-lg md:h-[40rem]" />
}

/** Keeps a belt that fails to draw from taking the page down with it */
class LiveBoundary extends ReactComponent<
  { children: ReactNode },
  { error: Error | undefined }
> {
  state = { error: undefined }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error === undefined) return this.props.children
    return (
      <div className="flex h-[30rem] w-full flex-col items-center justify-center gap-2 rounded-lg bg-surface-secondary p-6 text-center md:h-[40rem]">
        <div className="font-bold text-heading-18">
          The blocks could not be drawn
        </div>
        <div className="max-w-[48ch] font-mono text-label-value-12 text-secondary">
          {String(this.state.error)}
        </div>
      </div>
    )
  }
}
