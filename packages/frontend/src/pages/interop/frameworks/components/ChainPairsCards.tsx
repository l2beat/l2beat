import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type {
  ChainInfo,
  ChainPair,
  FrameworkOverview,
} from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { formatCurrency, formatNumber } from '../utils/format'

interface Props {
  chainPairs: ChainPair[]
  frameworks: FrameworkOverview[]
  chainMap: Record<string, ChainInfo>
}

function ChainIcon({
  chainId,
  chainMap,
}: {
  chainId: string
  chainMap: Record<string, ChainInfo>
}) {
  const info = chainMap[chainId]
  if (!info) return <span className="text-secondary">{chainId}</span>
  return <img src={info.iconUrl} alt={info.name} className="size-4" />
}

export function ChainPairsCards({ chainPairs, frameworks, chainMap }: Props) {
  return (
    <div>
      <h2 className="mb-4 font-bold text-heading-20 max-md:px-4 md:text-heading-24">
        Top Chain Pairs by Volume
        <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
          24h
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 min-[1600px]:grid-cols-4">
        {frameworks.map((fw) => {
          const pairs = chainPairs
            .filter((p) => p.frameworkId === fw.id)
            .sort((a, b) => b.volumeUsd - a.volumeUsd)
            .slice(0, 6)
          return (
            <PrimaryCard key={fw.id}>
              <div className="mb-3 flex items-center gap-2">
                <img src={fw.iconUrl} alt={fw.shortName} className="size-5" />
                <span className="font-bold text-heading-16">
                  {fw.shortName}
                </span>
              </div>
              <div className="flex flex-col">
                {pairs.length > 0 ? (
                  pairs.map((p) => (
                    <div
                      key={`${p.srcChain}-${p.dstChain}`}
                      className="flex items-center justify-between border-b border-b-divider py-2 text-label-value-14 last:border-b-0"
                    >
                      <div className="flex items-center gap-1">
                        <ChainIcon chainId={p.srcChain} chainMap={chainMap} />
                        <ArrowRightIcon className="size-4 min-w-4 fill-brand" />
                        <ChainIcon chainId={p.dstChain} chainMap={chainMap} />
                      </div>
                      <span className="ml-2 shrink-0 font-medium tabular-nums">
                        {formatCurrency(p.volumeUsd)}{' '}
                        <span className="text-2xs text-secondary">
                          ({formatNumber(p.count)})
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="py-2 text-label-value-12 text-secondary">
                    No pair data
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
