import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type {
  FrameworkOverview,
  TopToken,
} from '~/server/features/scaling/interop/getFrameworkComparisonData'
import { formatCurrency, formatNumber } from '../utils/format'
import { HorizontalScrollContainer } from './HorizontalScrollContainer'

interface Props {
  topTokens: TopToken[]
  frameworks: FrameworkOverview[]
}

export function TopTokensCards({ topTokens, frameworks }: Props) {
  return (
    <div>
      <h2 className="mb-4 font-bold text-heading-20 max-md:px-4 md:text-heading-24">
        Top Tokens by Volume
        <span className="ml-2 font-normal text-paragraph-12 text-secondary md:text-paragraph-13">
          Last 24h
        </span>
      </h2>
      <HorizontalScrollContainer>
        {frameworks.map((fw) => {
          const tokens = topTokens
            .filter((t) => t.frameworkId === fw.id)
            .sort((a, b) => b.volumeUsd - a.volumeUsd)
            .slice(0, 8)
          return (
            <PrimaryCard key={fw.id} className="md:min-w-[240px] md:flex-1">
              <div className="mb-3 flex items-center gap-2">
                <img src={fw.iconUrl} alt={fw.shortName} className="size-5" />
                <span className="font-bold text-heading-16">
                  {fw.shortName}
                </span>
              </div>
              <div className="flex flex-col">
                {tokens.length > 0 ? (
                  tokens.map((t) => (
                    <div
                      key={t.symbol}
                      className="flex items-center justify-between border-b border-b-divider py-2 text-label-value-14 last:border-b-0"
                    >
                      <span className="flex items-center gap-1.5">
                        {t.iconUrl && (
                          <img
                            src={t.iconUrl}
                            alt={t.symbol}
                            className="size-4 rounded-full bg-white shadow"
                          />
                        )}
                        {t.symbol}
                      </span>
                      <span className="font-medium tabular-nums">
                        {formatCurrency(t.volumeUsd)}{' '}
                        <span className="text-2xs text-secondary">
                          ({formatNumber(t.count)} txs)
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="py-2 text-label-value-12 text-secondary">
                    No token data
                  </span>
                )}
              </div>
            </PrimaryCard>
          )
        })}
      </HorizontalScrollContainer>
    </div>
  )
}
