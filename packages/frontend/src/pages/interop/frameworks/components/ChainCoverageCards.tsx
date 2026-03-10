import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type {
  ChainCoverageData,
  ChainInfo,
  FrameworkOverview,
} from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { cn } from '~/utils/cn'

interface Props {
  chainCoverage: ChainCoverageData[]
  frameworks: FrameworkOverview[]
  chainMap: Record<string, ChainInfo>
  allTrackedChains: ChainInfo[]
}

export function ChainCoverageCards({
  chainCoverage,
  frameworks,
  chainMap,
  allTrackedChains,
}: Props) {
  const coverageMap = Object.fromEntries(
    chainCoverage.map((c) => [c.frameworkId, c]),
  )

  return (
    <div>
      <h2 className="mb-4 font-bold text-heading-20 max-md:px-4 md:text-heading-24">
        Chain Coverage
        <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
          Last 24h
        </span>
      </h2>
      <div className="flex flex-col gap-4 md:flex-row md:overflow-x-auto">
        {frameworks.map((fw) => {
          const coverage = coverageMap[fw.id]
          const observedSet = new Set(coverage?.chains ?? [])
          return (
            <PrimaryCard key={fw.id} className="md:min-w-[240px] md:flex-1">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={fw.iconUrl} alt={fw.shortName} className="size-5" />
                  <span className="font-bold text-heading-16">
                    {fw.shortName}
                  </span>
                </div>
                <span className="text-label-value-12 text-secondary">
                  {observedSet.size}/{allTrackedChains.length} tracked chains
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {allTrackedChains.map((chain) => {
                  const observed = observedSet.has(chain.id)
                  const info = chainMap[chain.id] ?? chain
                  return (
                    <span
                      key={chain.id}
                      className={cn(
                        'flex items-center gap-1.5 rounded border px-2 py-1 text-2xs',
                        observed
                          ? 'border-positive/30 bg-positive/10'
                          : 'border-divider bg-surface-secondary opacity-40',
                      )}
                    >
                      <img
                        src={info.iconUrl}
                        alt={info.name}
                        className={cn('size-4', !observed && 'grayscale')}
                      />
                      {info.name}
                    </span>
                  )
                })}
              </div>
            </PrimaryCard>
          )
        })}
      </div>
    </div>
  )
}
