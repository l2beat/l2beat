import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo } from 'react'
import { EM_DASH } from '~/consts/characters'
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
import type {
  Flow,
  InteropFlowsData,
} from '~/server/features/layer2s/interop/getInteropFlows'
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
      {/* From lg the section is as tall as the column beside it, so its body
          is a size container (it never sets the height itself). Roughly
          square, the graph fills it, the largest square it fits, and the
          figures go in the corners its ring leaves free. Clearly taller than
          wide, or too narrow for the corners, it stacks as on phones: the
          figures, the graph as a square (smaller when the height runs out, so
          nothing spills), then as many top routes as the height left holds. Below lg it stacks too, the graph a fixed-size
          square. */}
      <div className="relative flex min-w-0 flex-col gap-5 lg:min-h-[480px] lg:flex-1 lg:basis-0 lg:[container:interop-body/size]">
        {data && (
          <Stats
            data={data}
            chains={chains}
            className="interop-corners:hidden"
          />
        )}
        <div className="pointer-events-none interop-corners:absolute interop-corners:inset-0 flex interop-stacked:aspect-square interop-corners:min-h-0 interop-stacked:min-h-0 min-h-[360px] interop-stacked:w-full min-w-0 interop-stacked:shrink flex-col items-center">
          <FlowsGraphPanel
            activeChains={activeChains}
            data={data}
            hasEnoughChains={hasEnoughChains}
            hasEnoughProtocols={hasEnoughProtocols}
            isLoading={isLoading}
            // Chain labels hang below the bubbles; pb keeps them in the section.
            className="pb-6 max-lg:order-none"
            maxSizeClassName="max-w-[460px] lg:max-w-none"
          />
        </div>
        {data && (
          <>
            <TopRoutes
              flows={data.flows}
              chains={chains}
              className="interop-corners:hidden interop-stacked:min-h-0 interop-stacked:flex-1 interop-stacked:basis-0 interop-stacked:overflow-hidden"
            />
            <CornerStats data={data} chains={chains} />
          </>
        )}
      </div>
    </HomeCard>
  )
}

const TOP_ROUTES_COUNT = 5
/** Stacked from lg the routes fill the height left; whole rows only. */
const FILL_ROUTES_COUNT = 15
/** A corner fits fewer rows than the list under the graph. */
const CORNER_ROUTES_COUNT = 3

/**
 * The interop page's general stats: volume, transfers and routes, then the
 * top chain, token and protocol, in columns split by hairlines like the KPI
 * pairs. The busiest routes are listed apart, in TopRoutes.
 */
function Stats({
  data,
  chains,
  className,
}: {
  data: InteropFlowsData
  chains: InteropChainWithIcon[]
  className?: string
}) {
  const { stats } = data
  const topChain = stats.topChain
    ? chains.find((c) => c.id === stats.topChain?.chainId)
    : undefined

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <div className={STAT_ROW_CLASS}>
        <Figure
          label="Volume"
          value={formatCurrency(stats.totalVolume, 'usd')}
        />
        <Figure
          label="Transfers"
          value={formatInteger(stats.totalTransferCount)}
        />
        <Figure
          label="Active routes"
          value={formatInteger(stats.activeFlows)}
        />
      </div>
      <div className={cn(STAT_ROW_CLASS, 'border-divider border-t pt-5')}>
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

/** Three columns split by hairlines. */
const STAT_ROW_CLASS =
  'grid grid-cols-3 divide-x divide-divider *:px-3 *:first:pl-0 *:last:pr-0 sm:*:px-4'

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
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

/** The busiest routes, one direction each, ranked like the other cards. */
function useTopRoutes(
  flows: Flow[],
  chains: InteropChainWithIcon[],
  count: number,
) {
  return useMemo(
    () =>
      flows
        .toSorted((a, b) => b.volume - a.volume)
        .slice(0, count)
        .flatMap((flow) => {
          const src = chains.find((c) => c.id === flow.srcChain)
          const dst = chains.find((c) => c.id === flow.dstChain)
          return src && dst
            ? [
                {
                  src,
                  dst,
                  volume: flow.volume,
                  href: buildInteropUrl('/interop/summary', {
                    from: [src.id],
                    to: [dst.id],
                  }),
                },
              ]
            : []
        }),
    [flows, chains, count],
  )
}

function RouteIcons({
  src,
  dst,
}: {
  src: InteropChainWithIcon
  dst: InteropChainWithIcon
}) {
  return (
    <span className="-space-x-1 flex shrink-0">
      {[src, dst].map((chain) => (
        <img
          key={chain.id}
          src={chain.iconUrl}
          alt=""
          className={cn(HOME_ICON_CLASS, 'ring-2 ring-surface-primary')}
        />
      ))}
    </span>
  )
}

/** The busiest routes, one direction each, ranked like the other cards. */
function TopRoutes({
  flows,
  chains,
  className,
}: {
  flows: Flow[]
  chains: InteropChainWithIcon[]
  className?: string
}) {
  const routes = useTopRoutes(flows, chains, FILL_ROUTES_COUNT)
  if (routes.length === 0) {
    return null
  }
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <h3 className={HOME_TEXT.sectionTitle}>Top routes</h3>
      {/* Stacked from lg, the list takes the height left and wraps the rows
          that do not fit into a second column, out of view: whole rows only,
          as many as fit. */}
      <ol className="interop-stacked:flex interop-stacked:min-h-0 interop-stacked:flex-1 interop-stacked:flex-col interop-stacked:flex-wrap divide-y divide-divider interop-stacked:overflow-hidden">
        {routes.map(({ src, dst, volume, href }, index) => (
          <li
            key={`${src.id}-${dst.id}`}
            className={cn(
              'flex interop-stacked:h-10 min-h-10 w-full interop-stacked:shrink-0 items-center gap-2 py-2',
              index >= TOP_ROUTES_COUNT && 'interop-stacked:flex hidden',
            )}
          >
            <span
              className={cn(
                'w-3 shrink-0 text-right tabular-nums',
                HOME_TEXT.meta,
              )}
            >
              {index + 1}
            </span>
            <a
              href={href}
              className="group flex min-w-0 flex-1 items-center gap-1.5"
            >
              <RouteIcons src={src} dst={dst} />
              <span
                className={cn(
                  'truncate underline-offset-2 group-hover:underline',
                  HOME_TEXT.row,
                )}
              >
                {src.name} → {dst.name}
              </span>
            </a>
            <span className={cn('shrink-0', HOME_TEXT.value)}>
              {formatCurrency(volume, 'usd')}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * The figures in the four corners the graph's ring leaves free: totals top
 * left, routes and the top chain top right, the top token and protocol
 * bottom left, the busiest routes bottom right.
 */
function CornerStats({
  data,
  chains,
}: {
  data: InteropFlowsData
  chains: InteropChainWithIcon[]
}) {
  const { stats } = data
  const topChain = stats.topChain
    ? chains.find((c) => c.id === stats.topChain?.chainId)
    : undefined
  const routes = useTopRoutes(data.flows, chains, CORNER_ROUTES_COUNT)

  return (
    <div className="pointer-events-none absolute inset-0 interop-corners:block hidden">
      <div className={cn(CORNER_CLASS, 'top-0 left-0')}>
        <Figure
          label="Volume"
          value={formatCurrency(stats.totalVolume, 'usd')}
        />
        <Figure
          label="Transfers"
          value={formatInteger(stats.totalTransferCount)}
        />
      </div>
      <div className={cn(CORNER_CLASS, 'top-0 right-0 items-end text-right')}>
        <Figure
          label="Active routes"
          value={formatInteger(stats.activeFlows)}
        />
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
      </div>
      <div className={cn(CORNER_CLASS, 'bottom-0 left-0')}>
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
      {routes.length > 0 && (
        <div
          className={cn(CORNER_CLASS, 'right-0 bottom-0 items-end text-right')}
        >
          <span className={HOME_TEXT.meta}>Top routes</span>
          <ol className="flex flex-col items-end gap-2">
            {routes.map(({ src, dst, volume, href }) => (
              <li key={`${src.id}-${dst.id}`}>
                <a
                  href={href}
                  title={`${src.name} → ${dst.name}`}
                  className="group flex items-center gap-2"
                >
                  <RouteIcons src={src} dst={dst} />
                  <span
                    className={cn(
                      'underline-offset-2 group-hover:underline',
                      HOME_TEXT.value,
                    )}
                  >
                    {formatCurrency(volume, 'usd')}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

const CORNER_CLASS =
  'pointer-events-auto absolute flex max-w-[180px] flex-col gap-4'
