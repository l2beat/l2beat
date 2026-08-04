import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { EM_DASH } from '~/consts/characters'
import { ArrowRightIcon } from '~/icons/ArrowRight'
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
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

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
  const { selectedChains, allChains, selectedProtocols } = useInteropFlows()
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
    <HomeCard className="@container flex h-full flex-col">
      <HomeCardHeader
        title="Interop"
        href="/interop/summary"
        timeframe="Last 24h"
      />
      {/* On wide cards (full-width row between lg and xl) the tiles move
          from a top row to a vertical stack right of the graph, filling
          the whitespace around the circular layout. */}
      <div className="flex @min-[900px]:grid min-h-0 flex-1 @min-[900px]:grid-cols-[minmax(0,1fr)_280px] @min-[900px]:grid-rows-[minmax(0,1fr)] flex-col @min-[900px]:gap-6">
        <div className="@min-[900px]:col-start-2 @min-[900px]:row-start-1 @min-[900px]:mt-0 mt-2.5 grid @min-[440px]:grid-cols-4 @min-[900px]:grid-cols-1 grid-cols-2 @min-[900px]:content-center @min-[900px]:gap-3 gap-2">
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
            href={topChainData?.href}
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
            href={topToken ? getInteropTokenUrl(topToken) : undefined}
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
            href={srcChain && dstChain ? '/interop/summary' : undefined}
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
        <div className="@min-[900px]:col-start-1 @min-[900px]:row-start-1 @min-[900px]:mt-0 mt-6 flex min-h-0 flex-1 flex-col">
          {/* Static preview: interactions happen on the interop page */}
          <div className="-mx-2 pointer-events-none flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip">
            <FlowsGraphPanel
              activeChains={activeChains}
              data={data}
              hasEnoughChains={hasEnoughChains}
              hasEnoughProtocols={hasEnoughProtocols}
              isLoading={isLoading}
              className="pb-2"
            />
          </div>
        </div>
      </div>
    </HomeCard>
  )
}

function StatTile({
  title,
  primary,
  secondary,
  icon,
  isLoading,
  emphasized,
  href,
  className,
}: {
  title: string
  primary: ReactNode
  secondary?: string
  icon?: ReactNode
  isLoading: boolean
  emphasized?: boolean
  href?: string
  className?: string
}) {
  const ValueWrapper = href ? 'a' : 'div'
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
          <ValueWrapper
            href={href}
            className={cn(
              'flex min-w-0 items-center justify-center gap-1.5 font-bold',
              emphasized ? 'flex-1 text-label-value-20' : 'text-label-value-15',
              href && 'hover:underline',
            )}
          >
            {icon}
            <span className="min-w-0 truncate">{primary}</span>
          </ValueWrapper>
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
