import partition from 'lodash/partition'
import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { ChevronIcon } from '~/icons/Chevron'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '~/pages/interop/components/flows/consts'
import { FlowsGraphPanel } from '~/pages/interop/components/flows/graph/FlowsGraphPanel'
import {
  InteropFlowsProvider,
  useInteropFlows,
} from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import { api } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { OVERVIEW_INTEROP_CARD_CLASS } from './overviewChartHeight'

interface Props {
  interopChains: InteropChainWithIcon[]
  interopProtocols: (ProtocolDisplayable & { id: string })[]
  defaultSelectedFlowChains: string[]
  totalInterop24hVolume: number
}

export function OverviewInteropCard({
  interopChains,
  interopProtocols,
  defaultSelectedFlowChains,
  totalInterop24hVolume,
}: Props) {
  return (
    <InteropFlowsProvider
      chains={interopChains}
      protocols={interopProtocols}
      defaultSelectedChains={defaultSelectedFlowChains}
    >
      <OverviewInteropCardContent
        interopChains={interopChains}
        totalInterop24hVolume={totalInterop24hVolume}
      />
    </InteropFlowsProvider>
  )
}

function OverviewInteropCardContent({
  interopChains,
  totalInterop24hVolume,
}: {
  interopChains: InteropChainWithIcon[]
  totalInterop24hVolume: number
}) {
  const { selectedChains, allChains, selectedProtocols } = useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS

  const { data, isLoading } = api.interop.flows.useQuery(
    {
      chains: selectedChains,
      protocolIds: selectedProtocols,
    },
    { enabled: hasEnoughChains && hasEnoughProtocols },
  )

  const activeIds = new Set<string>(
    (data?.chainData ?? [])
      .filter((chain) => chain.totalVolume > 0)
      .map((chain) => chain.chainId),
  )

  const selectedChainsWithIcons = interopChains.filter((chain) =>
    selectedChains.includes(chain.id),
  )
  const [activeChains] = partition(selectedChainsWithIcons, (chain) =>
    activeIds.has(chain.id),
  )

  const liveTotalVolume =
    data?.flows.reduce((acc, flow) => acc + flow.volume, 0) ??
    totalInterop24hVolume

  const stats = data?.stats
  const topChain = stats?.topChain
  const topChainData = topChain
    ? allChains.find((c) => c.id === topChain.chainId)
    : undefined
  const topChainShare =
    topChain && stats?.totalVolume
      ? topChain.totalVolume / stats.totalVolume
      : 0
  const topToken = stats?.topToken
  const topRoute = stats?.topRoute
  const srcChain = topRoute
    ? allChains.find((c) => c.id === topRoute.srcChain)
    : undefined
  const dstChain = topRoute
    ? allChains.find((c) => c.id === topRoute.dstChain)
    : undefined

  const statsLoading = isLoading && data === undefined

  return (
    <PrimaryCard
      className={cn(OVERVIEW_INTEROP_CARD_CLASS, 'flex h-full flex-col')}
    >
      <Header totalVolume={liveTotalVolume} isLoading={statsLoading} />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <StatTile
          title="Top chain"
          isLoading={statsLoading}
          primary={topChainData?.name ?? '—'}
          secondary={
            topChain
              ? `${formatPercent(topChainShare)} · ${formatCurrency(topChain.totalVolume, 'usd')}`
              : undefined
          }
          icon={
            topChainData ? (
              <img
                src={topChainData.iconUrl}
                alt={topChainData.name}
                className="size-5 shrink-0 rounded-full"
              />
            ) : undefined
          }
        />
        <StatTile
          title="Top token"
          isLoading={statsLoading}
          primary={topToken?.symbol ?? '—'}
          secondary={
            topToken ? formatCurrency(topToken.volume, 'usd') : undefined
          }
          icon={
            topToken ? (
              <img
                src={topToken.iconUrl}
                alt={topToken.symbol}
                className="size-5 shrink-0 rounded-full"
              />
            ) : undefined
          }
        />
        <StatTile
          title="Top chain path"
          isLoading={statsLoading}
          primary={
            srcChain && dstChain ? (
              <div className="flex items-center gap-1.5">
                <img
                  src={srcChain.iconUrl}
                  alt={srcChain.name}
                  className="size-5 shrink-0 rounded-full"
                />
                <ArrowRightIcon className="size-3 fill-brand" />
                <img
                  src={dstChain.iconUrl}
                  alt={dstChain.name}
                  className="size-5 shrink-0 rounded-full"
                />
              </div>
            ) : (
              '—'
            )
          }
          secondary={
            srcChain && dstChain && topRoute
              ? `${srcChain.name} → ${dstChain.name} · ${formatCurrency(topRoute.volume, 'usd')}`
              : undefined
          }
        />
      </div>
      <div className="-mx-2 mt-2 flex min-h-0 flex-1 flex-col pb-1">
        <FlowsGraphPanel
          activeChains={activeChains}
          data={data}
          hasEnoughChains={hasEnoughChains}
          hasEnoughProtocols={hasEnoughProtocols}
          isLoading={isLoading}
        />
      </div>
    </PrimaryCard>
  )
}

function Header({
  totalVolume,
  isLoading,
}: {
  totalVolume: number
  isLoading: boolean
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="font-bold text-xl">Interop Flows</span>
        <a
          className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 font-bold text-[13px] text-link leading-none"
          href="/interop/summary"
        >
          View details
          <ChevronIcon className="-rotate-90 size-2.5 fill-current" />
        </a>
      </div>
      <div className="flex flex-col items-end leading-tight">
        <div className="whitespace-nowrap text-right font-bold text-xl leading-tight">
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            `${formatCurrency(totalVolume, 'usd')} volume`
          )}
        </div>
        <p className="mt-0.5 whitespace-nowrap text-right text-secondary text-xs leading-tight">
          over the last 24h
        </p>
      </div>
    </div>
  )
}

function StatTile({
  title,
  primary,
  secondary,
  icon,
  isLoading,
  className,
}: {
  title: string
  primary: ReactNode
  secondary?: string
  icon?: ReactNode
  isLoading: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-lg border border-divider bg-surface-primary px-3 py-2',
        className,
      )}
    >
      <span className="font-medium text-2xs text-secondary uppercase tracking-wider">
        {title}
      </span>
      {isLoading ? (
        <>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="mt-0.5 h-3 w-16" />
        </>
      ) : (
        <>
          <div className="flex min-w-0 items-center gap-1.5 font-bold text-label-value-15">
            {icon}
            <span className="truncate">{primary}</span>
          </div>
          {secondary !== undefined && (
            <span className="truncate font-medium text-label-value-12 text-secondary">
              {secondary}
            </span>
          )}
        </>
      )}
    </div>
  )
}
