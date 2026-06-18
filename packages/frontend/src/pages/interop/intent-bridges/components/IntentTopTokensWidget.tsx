import { useQuery } from '@tanstack/react-query'
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
import { Last24HoursBadge } from '~/pages/interop/token-frameworks/components/Last24HoursBadge'
import type { IntentBridgeTopTokenItem } from '~/server/features/scaling/interop/getIntentBridgesData'
import { useTRPC } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { getInteropTokenUrl } from '../../utils/getInteropTokenUrl'
import type { InteropIntentBridge } from '../getInteropIntentBridgesData'
import { useIntentBridgesSelectedChains } from '../utils/IntentBridgesSelectedChainsContext'
import { IntentBridgesTransferTrigger } from './IntentBridgesTransferTrigger'

export function IntentTopTokensWidget({
  intentBridges,
}: {
  intentBridges: InteropIntentBridge[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useIntentBridgesSelectedChains()
  const [activeTab, setActiveTab] = useState<string>('all')

  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  const apiSelection = { from: selectedChains, to: selectedChains }
  const bridgesById = new Map(
    intentBridges.map((bridge) => [bridge.id, bridge]),
  )

  const items =
    activeTab === 'all'
      ? data?.topTokens
      : data?.bridgeTable.find((entry) => entry.id === activeTab)?.tokens
  const activeBridgeTokenCount = activeTab === 'all' ? undefined : items?.length

  return (
    <PrimaryCard className="@container border-divider max-md:border-b md:col-span-2 lg:row-span-5">
      <div className="flex items-center gap-2.5">
        <h2 className="font-bold text-heading-18 md:text-heading-20">
          Top Tokens by Volume
        </h2>
        <Last24HoursBadge />
      </div>

      <Tabs
        name="topTokensIntentBridge"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mt-4 gap-1"
        variant="highlighted"
      >
        <TabsList className="h-6 w-fit gap-1 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="rounded-full bg-surface-secondary px-2.5 py-[3px] font-bold text-sm leading-[1.15]"
          >
            All
          </TabsTrigger>
          {intentBridges.map((bridge) => (
            <TabsTrigger
              key={bridge.id}
              value={bridge.id}
              className="flex items-center gap-1 rounded-full bg-surface-secondary px-2.5 py-[3px] font-bold text-sm leading-[1.15]"
            >
              <img
                src={bridge.iconUrl}
                alt={bridge.name}
                className="size-4 rounded-full"
              />
              <span className="@max-[420px]:hidden">{bridge.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-1 h-3.5 font-medium text-secondary text-xs leading-none">
          {activeBridgeTokenCount
            ? `${formatInteger(activeBridgeTokenCount)} active tokens`
            : null}
        </div>
        <TabsContent value={activeTab} className="mt-2">
          {isLoading ? (
            <RowsSkeleton />
          ) : !items || items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {items.slice(0, 5).map((token) => {
                const bridge =
                  activeTab === 'all'
                    ? token.bridgeId
                      ? bridgesById.get(token.bridgeId)
                      : undefined
                    : bridgesById.get(activeTab)
                return (
                  <TokenRow
                    key={token.id}
                    token={token}
                    bridge={bridge}
                    showBridgeBadge={activeTab === 'all'}
                    href={getInteropTokenUrl(token, apiSelection)}
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
  bridge,
  showBridgeBadge,
  href,
}: {
  token: IntentBridgeTopTokenItem
  bridge: InteropIntentBridge | undefined
  showBridgeBadge: boolean
  href: string | undefined
}) {
  const txsLabel = `${formatInteger(token.transferCount)} txs`
  const identity = (
    <>
      <img
        src={token.iconUrl}
        alt={token.symbol}
        className="size-6 shrink-0 rounded-full"
      />
      <span className="font-bold text-heading-16">{token.symbol}</span>
    </>
  )

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        {href ? (
          <a href={href} className="flex items-center gap-2 hover:underline">
            {identity}
          </a>
        ) : (
          identity
        )}
        {showBridgeBadge && bridge && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex shrink-0 items-center gap-1 font-bold text-label-value-14"
                style={{ color: bridge.color }}
              >
                <img
                  src={bridge.iconUrl}
                  alt={bridge.name}
                  className="size-4 rounded-sm"
                />
                <span className="@max-[450px]:hidden">{bridge.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent>{bridge.name}</TooltipContent>
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
            <ArrowRightIcon className="size-4 shrink-0 fill-brand" />
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
        {bridge ? (
          <IntentBridgesTransferTrigger
            protocol={{
              id: bridge.projectId,
              name: bridge.name,
              slug: bridge.slug,
              iconUrl: bridge.iconUrl,
            }}
            tokenId={token.id}
            className="cursor-pointer font-medium text-paragraph-14 text-secondary hover:underline md:text-paragraph-16"
          >
            {txsLabel}
          </IntentBridgesTransferTrigger>
        ) : (
          <span className="font-medium text-paragraph-14 text-secondary md:text-paragraph-16">
            {txsLabel}
          </span>
        )}
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
