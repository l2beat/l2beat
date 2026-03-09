import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type {
  ChainCoverageData,
  ChainInfo,
  FrameworkOverview,
} from '~/server/features/scaling/interop/getFrameworkComparisonData'

interface Props {
  chainCoverage: ChainCoverageData[]
  frameworks: FrameworkOverview[]
  chainMap: Record<string, ChainInfo>
}

export function ChainCoverageCards({
  chainCoverage,
  frameworks,
  chainMap,
}: Props) {
  const coverageMap = Object.fromEntries(
    chainCoverage.map((c) => [c.frameworkId, c]),
  )

  return (
    <div>
      <h2 className="mb-4 font-bold text-heading-20 max-md:px-4 md:text-heading-24">
        Chain Coverage
        <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
          24h
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1600px]:grid-cols-4">
        {frameworks.map((fw) => {
          const coverage = coverageMap[fw.id]
          const chains = coverage?.chains ?? []
          return (
            <PrimaryCard key={fw.id}>
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={fw.iconUrl} alt={fw.shortName} className="size-5" />
                  <span className="font-bold text-heading-16">
                    {fw.shortName}
                  </span>
                </div>
                <span className="text-label-value-12 text-secondary">
                  {chains.length} chains observed
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chains.map((chainId) => {
                  const info = chainMap[chainId]
                  return (
                    <span
                      key={chainId}
                      className="flex items-center gap-1.5 rounded border border-divider bg-surface-secondary px-2 py-1 text-2xs"
                    >
                      {info && (
                        <img
                          src={info.iconUrl}
                          alt={info.name}
                          className="size-4"
                        />
                      )}
                      {info?.name ?? chainId}
                    </span>
                  )
                })}
                {chains.length === 0 && (
                  <span className="text-label-value-12 text-secondary">
                    No data
                  </span>
                )}
              </div>
            </PrimaryCard>
          )
        })}
      </div>
    </div>
  )
}
