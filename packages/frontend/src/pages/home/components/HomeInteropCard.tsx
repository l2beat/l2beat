import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { EM_DASH } from '~/consts/characters'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { CursorClickIcon } from '~/icons/CursorClick'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '~/pages/interop/components/flows/consts'
import { FlowsGraphPanel } from '~/pages/interop/components/flows/graph/FlowsGraphPanel'
import {
  type InteropFlowsProtocol,
  InteropFlowsProvider,
  useInteropFlows,
} from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'
import { HomeInteropSelectedPath } from './HomeInteropSelectedPath'

interface Props {
  interopChains: InteropChainWithIcon[]
  interopProtocols: InteropFlowsProtocol[]
  defaultSelectedFlowChains: string[]
}

export function HomeInteropCard({
  interopChains,
  interopProtocols,
  defaultSelectedFlowChains,
}: Props) {
  return (
    <InteropFlowsProvider
      chains={interopChains}
      protocols={interopProtocols}
      defaultSelectedChains={defaultSelectedFlowChains}
    >
      <HomeInteropCardContent interopChains={interopChains} />
    </InteropFlowsProvider>
  )
}

function HomeInteropCardContent({
  interopChains,
}: {
  interopChains: InteropChainWithIcon[]
}) {
  const trpc = useTRPC()
  const { selectedChains, allChains, selectedProtocols, highlightedChains } =
    useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS

  const { data, isLoading } = useQuery(
    trpc.interop.flows.queryOptions(
      {
        chains: selectedChains,
        protocolIds: selectedProtocols,
      },
      { enabled: hasEnoughChains && hasEnoughProtocols },
    ),
  )

  const activeIds = useMemo(
    () =>
      new Set<string>(
        (data?.chainData ?? [])
          .filter((chain) => chain.totalVolume > 0)
          .map((chain) => chain.chainId),
      ),
    [data?.chainData],
  )

  const visibleHighlightedChains = isLoading
    ? highlightedChains
    : highlightedChains.filter((chainId) => activeIds.has(chainId))
  const hasSelection = visibleHighlightedChains.length > 0

  const activeChains = useMemo(
    () =>
      interopChains.filter(
        (chain) => selectedChains.includes(chain.id) && activeIds.has(chain.id),
      ),
    [interopChains, selectedChains, activeIds],
  )

  const stats = data?.stats
  const totalVolume = stats?.totalVolume
  const { topChainData, topChainShare, srcChain, dstChain } = useMemo(() => {
    const topChain = stats?.topChain
    const topRoute = stats?.topRoute
    return {
      topChainData: topChain
        ? allChains.find((c) => c.id === topChain.chainId)
        : undefined,
      topChainShare:
        topChain && stats?.totalVolume
          ? topChain.totalVolume / stats.totalVolume
          : 0,
      srcChain: topRoute
        ? allChains.find((c) => c.id === topRoute.srcChain)
        : undefined,
      dstChain: topRoute
        ? allChains.find((c) => c.id === topRoute.dstChain)
        : undefined,
    }
  }, [stats, allChains])
  const topChain = stats?.topChain
  const topToken = stats?.topToken
  const topRoute = stats?.topRoute

  const statsLoading = isLoading && data === undefined

  return (
    <HomeCard className="flex h-full flex-col">
      <HomeCardHeader
        title="Interop"
        href="/interop/summary"
        timeframe="Last 24h"
      />
      <div className="mt-2.5 grid grid-cols-2 gap-2 md:grid-cols-4">
        <StatTile
          title="Volume"
          isLoading={statsLoading}
          emphasized
          primary={
            totalVolume !== undefined
              ? formatCurrency(totalVolume, 'usd')
              : EM_DASH
          }
        />
        <StatTile
          title="Top chain"
          isLoading={statsLoading}
          primary={topChainData?.name ?? EM_DASH}
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
          primary={topToken?.symbol ?? EM_DASH}
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
              EM_DASH
            )
          }
          secondary={
            topRoute ? formatCurrency(topRoute.volume, 'usd') : undefined
          }
        />
      </div>
      {/* overflow-x-clip: node halos render outside the square svg
          (overflow="visible") and would otherwise widen the page on
          mobile. */}
      <div className="-mx-2 mt-6 flex min-h-0 flex-1 flex-col overflow-x-clip">
        <FlowsGraphPanel
          activeChains={activeChains}
          data={data}
          hasEnoughChains={hasEnoughChains}
          hasEnoughProtocols={hasEnoughProtocols}
          isLoading={isLoading}
          // Center the width-capped graph in the leftover space so the
          // card doesn't end in a large blank area at xl.
          className="pb-2"
        />
      </div>
      {/* Always reserve the bottom panel height (min-h matches the tallest
          selected-path state) so the graph doesn't jump when a chain is
          (de)selected. */}
      <div className="mt-4 flex min-h-[180px] flex-col">
        {hasSelection && data ? (
          <HomeInteropSelectedPath
            data={data}
            allChains={allChains}
            selectedChains={selectedChains}
            visibleHighlightedChains={visibleHighlightedChains}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary">
            <SelectInfo
              highlightedChainsNumber={visibleHighlightedChains.length}
            />
          </div>
        )}
      </div>
    </HomeCard>
  )
}

function SelectInfo({
  highlightedChainsNumber,
}: {
  highlightedChainsNumber: number
}) {
  const text =
    highlightedChainsNumber === 1
      ? 'Select second chain to view detailed data'
      : 'Select chain or pair of chains to view detailed data'
  return (
    <div className="flex items-center gap-0.5">
      <CursorClickIcon className="size-3.5 shrink-0 fill-brand" />
      <p className="font-medium text-brand text-label-value-13 italic leading-none">
        {text}
      </p>
    </div>
  )
}

function StatTile({
  title,
  primary,
  secondary,
  icon,
  isLoading,
  emphasized,
  className,
}: {
  title: string
  primary: ReactNode
  secondary?: string
  icon?: ReactNode
  isLoading: boolean
  /** Larger value, vertically centered in the space below the label. */
  emphasized?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 rounded-lg border border-divider bg-surface-primary px-3 py-2 text-center',
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
          <div
            className={cn(
              'flex min-w-0 items-center justify-center gap-1.5 font-bold',
              emphasized ? 'flex-1 text-label-value-20' : 'text-label-value-15',
            )}
          >
            {icon}
            <span className="min-w-0 truncate">{primary}</span>
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
