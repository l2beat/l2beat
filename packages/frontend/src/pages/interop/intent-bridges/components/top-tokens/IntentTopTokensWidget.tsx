import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/core/Tabs'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { TokenData } from '~/server/features/scaling/interop/types'
import { useTRPC } from '~/trpc/React'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useInteropSelectedChains } from '../../../components/chain-selector/InteropSelectedChainsContext'
import { Last24HoursBadge } from '../../../components/Last24HoursBadge'
import type { InteropIntentBridge } from '../../getInteropIntentBridgesData'
import { IntentTokenRow } from './IntentTokenRow'

export function IntentTopTokensWidget({
  intentBridges,
}: {
  intentBridges: InteropIntentBridge[]
}) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const [activeTab, setActiveTab] = useState<string>('all')

  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  const bridgesBySlug = new Map(
    intentBridges.map((bridge) => [bridge.slug, bridge]),
  )
  const activeBridge = intentBridges.find((bridge) => bridge.id === activeTab)

  const tokens =
    activeTab === 'all'
      ? data?.topTokens
      : data?.table.entries.find((entry) => entry.id === activeTab)?.tokens
  const activeTokenCount = activeBridge
    ? (tokens?.items.length ?? 0) + (tokens?.remainingCount ?? 0)
    : undefined

  const getRowBridge = (token: TokenData) =>
    activeBridge ??
    (token.topProtocol ? bridgesBySlug.get(token.topProtocol.slug) : undefined)

  return (
    <PrimaryCard className="@container border-divider max-md:border-b">
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
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
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
          {activeTokenCount
            ? `${formatInteger(activeTokenCount)} active tokens`
            : null}
        </div>
        <TabsContent value={activeTab} className="mt-2">
          {isLoading ? (
            <RowsSkeleton />
          ) : !tokens || tokens.items.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-3">
              {tokens.items.map((token) => (
                <IntentTokenRow
                  key={token.id}
                  token={token}
                  bridge={getRowBridge(token)}
                  showBridgeBadge={activeTab === 'all'}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PrimaryCard>
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
