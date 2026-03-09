import { formatSeconds } from '@l2beat/shared-pure'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
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

          const fastest = paths.slice(0, 3)
          const slowest = paths.length > 3 ? paths.slice(-3) : []

          return (
            <PrimaryCard key={fw.id}>
              <div className="mb-3 flex items-center gap-2">
                <img src={fw.iconUrl} alt={fw.shortName} className="size-5" />
                <span className="font-bold text-heading-16">
                  {fw.shortName}
                </span>
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
                    <span className="text-label-value-12 text-secondary">
                      ·
                    </span>
                    <span className="text-label-value-12 text-secondary">
                      {paths.length} routes
                    </span>
                  </div>
                </div>
              )}

              {paths.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <PathGroup
                    label="Fastest routes"
                    paths={fastest}
                    chainMap={chainMap}
                    colorClass={FW_COLORS[fw.id] ?? ''}
                  />
                  {slowest.length > 0 && (
                    <PathGroup
                      label="Slowest routes"
                      paths={slowest}
                      chainMap={chainMap}
                      colorClass={FW_COLORS[fw.id] ?? ''}
                    />
                  )}
                </div>
              ) : (
                <span className="py-2 text-label-value-12 text-secondary">
                  No route data
                </span>
              )}
            </PrimaryCard>
          )
        })}
      </div>
    </div>
  )
}

function PathGroup({
  label,
  paths,
  chainMap,
  colorClass,
}: {
  label: string
  paths: PathSpeedStats[]
  chainMap: Record<string, ChainInfo>
  colorClass: string
}) {
  return (
    <div>
      <span className="text-label-value-12 text-secondary">{label}</span>
      <div className="flex flex-col">
        {paths.map((p) => (
          <PathRow
            key={`${p.srcChain}-${p.dstChain}`}
            path={p}
            chainMap={chainMap}
            colorClass={colorClass}
          />
        ))}
      </div>
    </div>
  )
}

function PathRow({
  path,
  chainMap,
  colorClass,
}: {
  path: PathSpeedStats
  chainMap: Record<string, ChainInfo>
  colorClass: string
}) {
  const src = chainMap[path.srcChain]
  const dst = chainMap[path.dstChain]
  const animDuration = Math.max(1, path.p50Sec)

  return (
    <div className="border-b border-b-divider py-1.5 last:border-b-0">
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
    </div>
  )
}
