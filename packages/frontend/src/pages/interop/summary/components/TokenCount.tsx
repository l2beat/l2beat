import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTopItems'
import { api } from '~/trpc/React'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { BetweenChainsInfo } from '../../components/BetweenChainsInfo'
import { TokensDialog } from '../../components/tokens/TokensDialog'
import { InteropTopItems } from '../../components/top-items/TopItems'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'

export function TokenCount({
  isLoading,
  tokenCount,
  topItems,
}: {
  isLoading: boolean
  tokenCount: number | undefined
  topItems: TopItems<TokenData> | undefined
}) {
  const [isOpen, setIsOpen] = useState(false)
  const utils = api.useUtils()
  const { selectionForApi } = useInteropSelectedChains()
  const hasTokens =
    (tokenCount ?? 0) > 0 && !!topItems && topItems.items.length > 0

  return (
    <PrimaryCard className="flex flex-col border-transparent max-md:border-b max-md:border-b-divider md:border-t-4">
      <div className="flex h-[34px] shrink-0 items-center gap-2">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Count of all tokens
        </h2>
      </div>
      <div className="mt-1 font-medium text-label-value-12 text-secondary md:text-label-value-14">
        Count of unique tokens transferred{' '}
        <div className="inline-block">
          <BetweenChainsInfo className="lowercase" />
        </div>
      </div>

      <div className="mt-4 flex min-h-[128px] flex-1 flex-col items-center justify-center rounded-lg border border-divider px-4 py-5">
        {isLoading ? (
          <TokenCountSkeleton />
        ) : (
          <>
            <span className="font-bold text-[44px] leading-none md:text-[56px]">
              {formatInteger(tokenCount ?? 0)}
            </span>
            {hasTokens && topItems ? (
              <InteropTopItems
                topItems={{
                  items: topItems.items.map((token) => ({
                    id: token.id,
                    displayName: token.symbol,
                    iconUrl: token.iconUrl,
                    volume: token.volume,
                    issuer: token.issuer,
                    transferCount: token.transferCount,
                    avgDuration: token.avgDuration,
                    avgValue: token.avgValue,
                    minTransferValueUsd: token.minTransferValueUsd,
                    maxTransferValueUsd: token.maxTransferValueUsd,
                    netMintedValue: token.netMintedValue,
                    flows: token.flows,
                  })),
                  remainingCount: topItems.remainingCount,
                }}
                className="mt-4"
                onMouseEnter={() =>
                  utils.interop.tokens.prefetch(selectionForApi)
                }
                setIsOpen={setIsOpen}
              />
            ) : null}
          </>
        )}
      </div>
      <TokensDialog
        id={undefined}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="All tokens & pairs by volume"
      />
    </PrimaryCard>
  )
}

function TokenCountSkeleton() {
  return (
    <div className="flex w-full flex-col items-center">
      <Skeleton className="h-14 w-24 md:h-16 md:w-28" />
      <div className="mt-4 flex items-center gap-2">
        <div className="-space-x-2 flex items-center">
          {[0, 1, 2, 3, 4].map((index) => (
            <Skeleton
              key={index}
              className="size-7 rounded-full"
              style={{ zIndex: 5 - index }}
            />
          ))}
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  )
}
