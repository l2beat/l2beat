import { formatSeconds } from '@l2beat/shared-pure'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/core/Dialog'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CloseIcon } from '~/icons/Close'
import type {
  ChainInfo,
  FrameworkOverview,
  PathSpeedStats,
  TransferSpeedStats,
} from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { cn } from '~/utils/cn'
import { FW_COLORS } from '../utils/constants'
import { formatNumber } from '../utils/format'

interface Props {
  transferSpeed: TransferSpeedStats[]
  pathSpeed: PathSpeedStats[]
  frameworks: FrameworkOverview[]
  chainMap: Record<string, ChainInfo>
}

export function TransferSpeedCards({
  transferSpeed,
  pathSpeed,
  frameworks,
  chainMap,
}: Props) {
  const speedMap = Object.fromEntries(
    transferSpeed.map((s) => [s.frameworkId, s]),
  )

  const [selectedRoute, setSelectedRoute] = useState<{
    srcChain: string
    dstChain: string
  } | null>(null)

  return (
    <div>
      <h2 className="mb-4 font-bold text-heading-20 max-md:px-4 md:text-heading-24">
        Transfer Speed
        <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
          Last 24h
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1600px]:grid-cols-4">
        {frameworks.map((fw) => {
          const stats = speedMap[fw.id]
          const paths = pathSpeed
            .filter((p) => p.frameworkId === fw.id)
            .sort((a, b) => a.p50Sec - b.p50Sec)

          return (
            <SpeedCard
              key={fw.id}
              fw={fw}
              stats={stats}
              paths={paths}
              chainMap={chainMap}
              onRouteClick={setSelectedRoute}
            />
          )
        })}
      </div>
      <RouteComparisonDialog
        route={selectedRoute}
        onClose={() => setSelectedRoute(null)}
        pathSpeed={pathSpeed}
        frameworks={frameworks}
        chainMap={chainMap}
      />
    </div>
  )
}

function SpeedCard({
  fw,
  stats,
  paths,
  chainMap,
  onRouteClick,
}: {
  fw: FrameworkOverview
  stats: TransferSpeedStats | undefined
  paths: PathSpeedStats[]
  chainMap: Record<string, ChainInfo>
  onRouteClick: (route: { srcChain: string; dstChain: string }) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <PrimaryCard>
      <div className="mb-3 flex items-center gap-2">
        <img src={fw.iconUrl} alt={fw.shortName} className="size-5" />
        <span className="font-bold text-heading-16">{fw.shortName}</span>
      </div>

      {stats && (
        <div className="mb-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-medium text-label-value-14 tabular-nums">
              {formatNumber(stats.count)}
            </span>
            <span className="text-label-value-12 text-secondary">
              transfers
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-label-value-12 text-secondary">
              {stats.srcChainCount + stats.dstChainCount} chains
            </span>
            <span className="text-label-value-12 text-secondary">·</span>
            <span className="text-label-value-12 text-secondary">
              {paths.length} routes
            </span>
          </div>
        </div>
      )}

      {paths.length > 0 ? (
        <div className="relative">
          <div ref={scrollRef} className="max-h-[350px] overflow-y-auto">
            <div className="flex flex-col">
              {paths.map((p) => (
                <PathRow
                  key={`${p.srcChain}-${p.dstChain}`}
                  path={p}
                  chainMap={chainMap}
                  colorClass={FW_COLORS[fw.id] ?? ''}
                  onClick={() =>
                    onRouteClick({
                      srcChain: p.srcChain,
                      dstChain: p.dstChain,
                    })
                  }
                />
              ))}
            </div>
          </div>
          <ScrollFadeHint scrollRef={scrollRef} />
        </div>
      ) : (
        <span className="py-2 text-label-value-12 text-secondary">
          No route data
        </span>
      )}
    </PrimaryCard>
  )
}

function RouteComparisonDialog({
  route,
  onClose,
  pathSpeed,
  frameworks,
  chainMap,
}: {
  route: { srcChain: string; dstChain: string } | null
  onClose: () => void
  pathSpeed: PathSpeedStats[]
  frameworks: FrameworkOverview[]
  chainMap: Record<string, ChainInfo>
}) {
  if (!route) return null

  const src = chainMap[route.srcChain]
  const dst = chainMap[route.dstChain]
  const srcName = src?.name ?? route.srcChain
  const dstName = dst?.name ?? route.dstChain

  const matches = frameworks.map((fw) => {
    const path = pathSpeed.find(
      (p) =>
        p.frameworkId === fw.id &&
        p.srcChain === route.srcChain &&
        p.dstChain === route.dstChain,
    )
    return { fw, path }
  })

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90dvh] w-full bg-surface-primary max-md:w-[calc(100%-1rem)] md:max-w-[480px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-1.5">
              {src && (
                <img src={src.iconUrl} alt={srcName} className="size-5" />
              )}
              <span>{srcName}</span>
              <ArrowRightIcon className="size-4 fill-secondary" />
              {dst && (
                <img src={dst.iconUrl} alt={dstName} className="size-5" />
              )}
              <span>{dstName}</span>
            </DialogTitle>
            <DialogClose>
              <CloseIcon className="size-4 fill-primary" />
            </DialogClose>
          </div>
          <DialogDescription className="sr-only">
            Speed comparison for {srcName} to {dstName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {matches.map(({ fw, path }) => {
            const colorClass = FW_COLORS[fw.id] ?? ''
            const animDuration = path ? Math.max(1, path.p50Sec) : 0
            return (
              <div
                key={fw.id}
                className="rounded-lg border border-divider bg-surface-secondary p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={fw.iconUrl}
                      alt={fw.shortName}
                      className="size-4"
                    />
                    <span className="font-medium text-label-value-14">
                      {fw.shortName}
                    </span>
                  </div>
                  {path ? (
                    <div className="flex items-center gap-2">
                      <span className="text-2xs text-secondary">
                        {path.count} txs
                      </span>
                      <span className="font-bold text-label-value-15 tabular-nums">
                        {formatSeconds(path.p50Sec)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-label-value-12 text-secondary">
                      No data
                    </span>
                  )}
                </div>
                {path && (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
                    <div
                      className={cn('h-full rounded-full', colorClass)}
                      style={{
                        animationName: 'speed-fill',
                        animationDuration: `${animDuration.toFixed(2)}s`,
                        animationTimingFunction: 'linear',
                        animationIterationCount: 'infinite',
                      }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ScrollFadeHint({
  scrollRef,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>
}) {
  const [showFade, setShowFade] = useState(true)

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return
    const check = () => {
      const atBottom =
        scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight < 4
      setShowFade(!atBottom)
    }
    check()
    scrollEl.addEventListener('scroll', check)
    return () => scrollEl.removeEventListener('scroll', check)
  }, [scrollRef])

  if (!showFade) return null

  return (
    <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-surface-primary to-transparent" />
  )
}

function PathRow({
  path,
  chainMap,
  colorClass,
  onClick,
}: {
  path: PathSpeedStats
  chainMap: Record<string, ChainInfo>
  colorClass: string
  onClick: () => void
}) {
  const src = chainMap[path.srcChain]
  const dst = chainMap[path.dstChain]
  const animDuration = Math.max(1, path.p50Sec)

  return (
    <button
      type="button"
      className="cursor-pointer border-b border-b-divider py-1.5 text-left transition-colors last:border-b-0 hover:bg-surface-secondary"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {src ? (
            <img src={src.iconUrl} alt={src.name} className="size-3.5" />
          ) : (
            <span className="text-2xs text-secondary">{path.srcChain}</span>
          )}
          <ArrowRightIcon className="size-3 fill-secondary" />
          {dst ? (
            <img src={dst.iconUrl} alt={dst.name} className="size-3.5" />
          ) : (
            <span className="text-2xs text-secondary">{path.dstChain}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xs text-secondary">{path.count} txs</span>
          <span className="font-medium text-label-value-12 tabular-nums">
            {formatSeconds(path.p50Sec)}
          </span>
        </div>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/20">
        <div
          className={cn('h-full rounded-full', colorClass)}
          style={{
            animationName: 'speed-fill',
            animationDuration: `${animDuration.toFixed(2)}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        />
      </div>
    </button>
  )
}
