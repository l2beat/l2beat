import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo, useRef } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { EM_DASH } from '~/consts/characters'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  MIN_SELECTED_CHAINS,
  MIN_SELECTED_PROTOCOLS,
} from '~/pages/interop/components/flows/consts'
import { FlowsGeneralStats } from '~/pages/interop/components/flows/FlowsGeneralStats'
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

  // Card-width breakpoints are measured with a ResizeObserver instead of CSS
  // container queries: a container-type ancestor forces Blink to re-layout
  // per SMIL particle per frame (style inside a size container can depend on
  // its layout), which pegged the main thread on this card's flows graph.
  const contentRef = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref: contentRef })
  const isWide = width !== undefined && width >= 800
  const condenseTiles = width !== undefined && width >= 460 && width <= 620

  return (
    <HomeCard className="flex h-full flex-col">
      <HomeCardHeader
        title="Interop"
        href="/interop/summary"
        timeframe="Last 24h"
      />
      <div
        ref={contentRef}
        className={cn(
          'min-h-0 flex-1',
          isWide
            ? 'mt-4 grid grid-cols-[minmax(0,1fr)_240px] gap-4'
            : 'flex flex-col max-sm:flex-col-reverse',
        )}
      >
        <div
          className={cn(
            'mt-2.5 grid grid-cols-2 gap-2',
            isWide && 'hidden',
            width !== undefined && width >= 460 && 'sm:grid-cols-4',
          )}
        >
          <StatTile
            condensed={condenseTiles}
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
            condensed={condenseTiles}
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
            condensed={condenseTiles}
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
            condensed={condenseTiles}
            title="Top chain"
            isLoading={statsLoading}
            href={
              srcChain && dstChain
                ? '/interop/summary?from=' + srcChain.id + '&to=' + dstChain.id
                : undefined
            }
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
        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col',
            isWide ? 'order-1' : 'mt-6',
          )}
        >
          <div className="-mx-2 pointer-events-none flex min-h-0 min-w-0 flex-1 flex-col overflow-x-clip">
            <FlowsGraphPanel
              activeChains={activeChains}
              data={data}
              hasEnoughChains={hasEnoughChains}
              hasEnoughProtocols={hasEnoughProtocols}
              isLoading={isLoading}
              className="pb-2"
              maxSizeClassName={cn(
                'max-w-[max(min(70dvh,calc(100dvh-20rem)),30rem)]',
                isWide && 'h-full w-auto max-w-full',
              )}
            />
          </div>
        </div>
        <div className={cn('h-full', isWide ? 'order-3 block' : 'hidden')}>
          <FlowsGeneralStats title="" description="" linkTopRouteToSummary />
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
  condensed,
  className,
}: {
  title: string
  primary: ReactNode
  secondary?: string
  icon?: ReactNode
  isLoading: boolean
  emphasized?: boolean
  href?: string
  /**
   * Four tiles in a row on a ~460-620px card leave ~90px of text per tile,
   * so trade side padding for value width before it truncates.
   */
  condensed?: boolean
  className?: string
}) {
  const ValueWrapper = href ? 'a' : 'div'
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 rounded-lg border border-divider bg-surface-primary px-3 py-2 text-center',
        condensed && 'sm:px-2',
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
            <span className="min-w-0 truncate leading-tight">{primary}</span>
          </ValueWrapper>
          {secondary !== undefined && (
            <span className="truncate font-medium text-label-value-12 text-secondary leading-tight">
              {secondary}
            </span>
          )}
        </>
      )}
    </div>
  )
}
