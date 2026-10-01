import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo } from 'react'
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
import { buildInteropUrl } from '~/pages/interop/utils/buildInteropUrl'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import type { InteropFlowsData } from '~/server/features/layer2s/interop/getInteropFlows'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { HOME_ICON_CLASS, HOME_TEXT } from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

/**
 * Interop as on the interop page: the same default chains (the top ones by
 * 24h volume) and every protocol, so the graph and the figures match it.
 */
export function HomeInteropSection({
  chains,
  defaultSelectedChains,
  protocols,
  className,
}: {
  /** Every active chain, ordered by volume. */
  chains: InteropChainWithIcon[]
  defaultSelectedChains: string[]
  protocols: InteropFlowsProtocol[]
  className?: string
}) {
  return (
    <InteropFlowsProvider
      chains={chains}
      protocols={protocols}
      defaultSelectedChains={defaultSelectedChains}
    >
      <Content chains={chains} className={className} />
    </InteropFlowsProvider>
  )
}

function Content({
  chains,
  className,
}: {
  chains: InteropChainWithIcon[]
  className?: string
}) {
  const trpc = useTRPC()
  const { selectedChains, selectedProtocols } = useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS

  const { data, isLoading } = useQuery(
    trpc.interop.flows.queryOptions(
      { chains: selectedChains, protocolIds: selectedProtocols },
      { enabled: hasEnoughChains && hasEnoughProtocols },
    ),
  )

  const activeChains = useMemo(() => {
    const activeIds = new Set(
      (data?.chainData ?? [])
        .filter((chain) => chain.totalVolume > 0)
        .map((chain) => chain.chainId),
    )
    return chains.filter(
      (chain) => selectedChains.includes(chain.id) && activeIds.has(chain.id),
    )
  }, [chains, selectedChains, data?.chainData])

  return (
    <HomeCard className={cn('flex flex-col gap-5', className)}>
      <HomeCardHeader
        title="Interop"
        subtitle="Last 24h"
        href="/interop/summary"
      />
      {data && <Stats data={data} chains={chains} />}
      {/* From lg the section is as tall as the column beside it and the graph
          takes what the figures leave (a 0px basis, so it never sets the
          height itself); below lg it is a fixed-size square. */}
      <div className="pointer-events-none flex min-h-[360px] min-w-0 flex-col items-center lg:flex-1 lg:basis-0">
        <FlowsGraphPanel
          activeChains={activeChains}
          data={data}
          hasEnoughChains={hasEnoughChains}
          hasEnoughProtocols={hasEnoughProtocols}
          isLoading={isLoading}
          // Chain labels hang below the bubbles; pb keeps them in the section.
          className="pb-6 max-lg:order-none"
          maxSizeClassName="max-w-[460px] lg:max-w-[680px]"
        />
      </div>
    </HomeCard>
  )
}

/**
 * The interop page's general stats: volume and transfers, then the top route,
 * chain, token and protocol, in columns split by hairlines like the KPI pairs.
 */
function Stats({
  data,
  chains,
}: {
  data: InteropFlowsData
  chains: InteropChainWithIcon[]
}) {
  const { stats } = data
  const chain = (id: string | undefined) =>
    id ? chains.find((c) => c.id === id) : undefined
  const topChain = chain(stats.topChain?.chainId)
  const routeSrc = chain(stats.topRoute?.srcChain)
  const routeDst = chain(stats.topRoute?.dstChain)

  return (
    <div className="flex flex-col gap-5">
      <div className={STAT_ROW_CLASS}>
        {/* Two columns each, so the line between them meets the one
            between the top chain and the top token below. */}
        <Figure
          label="Volume"
          value={formatCurrency(stats.totalVolume, 'usd')}
          className="@min-[640px]/home:col-span-2"
        />
        <Figure
          label="Transfers"
          value={formatInteger(stats.totalTransferCount)}
          className="@min-[640px]/home:col-span-2"
        />
      </div>
      <div className={cn(STAT_ROW_CLASS, 'border-divider border-t pt-5')}>
        <Top
          label="Top route"
          href={
            routeSrc && routeDst
              ? buildInteropUrl('/interop/summary', {
                  from: [routeSrc.id],
                  to: [routeDst.id],
                })
              : undefined
          }
          value={stats.topRoute && formatCurrency(stats.topRoute.volume, 'usd')}
        >
          {routeSrc && routeDst && (
            <>
              <img
                src={routeSrc.iconUrl}
                alt={routeSrc.name}
                className={HOME_ICON_CLASS}
              />
              <ArrowRightIcon className="size-3 shrink-0 fill-secondary" />
              <img
                src={routeDst.iconUrl}
                alt={routeDst.name}
                className={HOME_ICON_CLASS}
              />
            </>
          )}
        </Top>
        <Top
          label="Top chain"
          href={topChain?.href}
          value={
            stats.topChain && stats.totalVolume > 0
              ? `${formatPercent(stats.topChain.totalVolume / stats.totalVolume)} of volume`
              : undefined
          }
        >
          {topChain && (
            <>
              <img src={topChain.iconUrl} alt="" className={HOME_ICON_CLASS} />
              <span className={cn('truncate', HOME_TEXT.row)}>
                {topChain.name}
              </span>
            </>
          )}
        </Top>
        <Top
          label="Top token"
          href={stats.topToken && getInteropTokenUrl(stats.topToken)}
          value={stats.topToken && formatCurrency(stats.topToken.volume, 'usd')}
        >
          {stats.topToken && (
            <>
              <img
                src={stats.topToken.iconUrl}
                alt=""
                className={HOME_ICON_CLASS}
              />
              <span className={cn('truncate', HOME_TEXT.row)}>
                {stats.topToken.symbol}
              </span>
            </>
          )}
        </Top>
        <Top
          label="Top protocol"
          href={
            stats.topProtocol && `/interop/protocols/${stats.topProtocol.slug}`
          }
          value={
            stats.topProtocol && formatCurrency(stats.topProtocol.volume, 'usd')
          }
        >
          {stats.topProtocol && (
            <>
              <img
                src={stats.topProtocol.iconUrl}
                alt=""
                className={HOME_ICON_CLASS}
              />
              <span className={cn('truncate', HOME_TEXT.row)}>
                {stats.topProtocol.name}
              </span>
            </>
          )}
        </Top>
      </div>
    </div>
  )
}

/** Four columns split by hairlines; two by two, without them, on phones. */
const STAT_ROW_CLASS = cn(
  'grid grid-cols-2 gap-x-4 gap-y-5',
  '@min-[640px]/home:grid-cols-4 @min-[640px]/home:gap-x-0 @min-[640px]/home:divide-x @min-[640px]/home:divide-divider',
  '@min-[640px]/home:*:px-4 @min-[640px]/home:*:first:pl-0 @min-[640px]/home:*:last:pr-0',
)

function Figure({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1', className)}>
      <span className={cn('truncate', HOME_TEXT.meta)}>{label}</span>
      <span className={cn('truncate', HOME_TEXT.number)}>{value}</span>
    </div>
  )
}

/** One top item: what it is, who it is, and how much. */
function Top({
  label,
  href,
  value,
  children,
}: {
  label: string
  href: string | undefined
  value: string | undefined
  children: ReactNode
}) {
  const Who = href ? 'a' : 'span'
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className={cn('truncate', HOME_TEXT.meta)}>{label}</span>
      <Who
        href={href}
        className="flex min-w-0 items-center gap-2 underline-offset-2 hover:underline"
      >
        {children ?? EM_DASH}
      </Who>
      <span className={cn('truncate', HOME_TEXT.meta)}>{value ?? EM_DASH}</span>
    </div>
  )
}
