import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { TopTokenItem } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropTokenFramework } from '../getInteropTokenFrameworksData'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'
import { Last24HoursBadge } from './Last24HoursBadge'

export function TopTokensWidget({
  tokenFrameworks,
}: {
  tokenFrameworks: InteropTokenFramework[]
}) {
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const [activeTab, setActiveTab] = useState<string>('all')

  const { data, isLoading } = api.interop.tokenFrameworks.useQuery({
    from: selectedChains,
    to: selectedChains,
  })

  const items = data?.topTokens[activeTab]
  const frameworksById = new Map(tokenFrameworks.map((f) => [f.id, f]))

  return (
    <PrimaryCard className="@container border-divider max-md:border-b md:col-span-2 lg:row-span-5">
      <div className="flex items-center gap-2.5">
        <h2 className="font-bold text-heading-18 md:text-heading-20">
          Top Tokens by Volume
        </h2>
        <Last24HoursBadge />
      </div>

      <Tabs
        name="topTokensFramework"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-4"
        variant="highlighted"
      >
        <TabsList className="h-6 w-fit gap-1 bg-transparent p-0">
          <TabsTrigger
            value={'all'}
            className="rounded-full bg-surface-secondary px-2.5 py-[3px] font-bold text-sm leading-[1.15]"
          >
            All
          </TabsTrigger>
          {tokenFrameworks.map((framework) => (
            <TabsTrigger
              key={framework.id}
              value={framework.id}
              className="flex items-center gap-1 rounded-full bg-surface-secondary px-2.5 py-[3px] font-bold text-sm leading-[1.15]"
            >
              <img
                src={framework.iconUrl}
                alt={framework.name}
                className="size-4 rounded-full"
              />
              {framework.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <RowsSkeleton />
          ) : !items || items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {items.map((token) => {
                const framework =
                  activeTab === 'all' && token.frameworkId
                    ? frameworksById.get(token.frameworkId)
                    : undefined
                return (
                  <TokenRow
                    key={token.id}
                    token={token}
                    framework={framework}
                  />
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PrimaryCard>
  )
}

function TokenRow({
  token,
  framework,
}: {
  token: TopTokenItem
  framework: InteropTokenFramework | undefined
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <img
          src={token.iconUrl}
          alt={token.symbol}
          className="size-6 shrink-0 rounded-full"
        />
        <span className="font-bold text-heading-16">{token.symbol}</span>
        {framework && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex shrink-0 items-center gap-1 font-bold text-label-value-14"
                style={{ color: framework.color }}
              >
                <img
                  src={framework.iconUrl}
                  alt={framework.label}
                  className="size-4 rounded-sm"
                />
                <span className="@max-[450px]:hidden">{framework.label}</span>
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>{framework.label}</TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )}
        {token.topRoute && (
          <div className="flex items-center gap-1 text-label-value-12 text-secondary">
            <span className="font-medium">Top path</span>
            <ChainIcon
              iconUrl={token.topRoute.src.iconUrl}
              alt={token.topRoute.src.id}
            />
            <ArrowRightIcon className="size-4 fill-brand" />
            <ChainIcon
              iconUrl={token.topRoute.dst.iconUrl}
              alt={token.topRoute.dst.id}
            />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-bold text-label-value-15 md:text-label-value-16">
          {formatCurrency(token.volume, 'usd', { decimals: 2 })}
        </span>
        <span className="font-medium text-paragraph-14 text-secondary md:text-paragraph-16">
          {formatInteger(token.transferCount)} txs
        </span>
      </div>
    </div>
  )
}

function ChainIcon({
  iconUrl,
  alt,
}: {
  iconUrl: string | undefined
  alt: string
}) {
  if (!iconUrl) {
    return <span className="size-4 rounded-sm bg-surface-secondary" />
  }
  return (
    <img src={iconUrl} alt={alt} className="size-4 rounded-sm object-contain" />
  )
}

function RowsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-7 w-full" />
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-40 items-center justify-center font-medium text-secondary text-sm">
      No tokens found.
    </div>
  )
}
