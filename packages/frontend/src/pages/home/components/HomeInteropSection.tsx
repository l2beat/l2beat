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
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import type {
  FlowProtocol,
  InteropFlowsData,
} from '~/server/features/layer2s/interop/getInteropFlows'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import {
  HOME_ICON_CLASS,
  HOME_ROW_CLASS,
  HOME_ROW_LINES_CLASS,
  HOME_TEXT,
} from '../homeStyles'
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

  // Only the busiest chains: past about nine, the home graph's ring (343px
  // across on phones) leaves each chain too little arc for its label. The
  // figures still cover every selected chain, as on the interop page.
  const graphChains = useMemo(() => {
    const activeIds = new Set(
      (data?.chainData ?? [])
        .filter((chain) => chain.totalVolume > 0)
        .map((chain) => chain.chainId),
    )
    return chains
      .filter(
        (chain) => selectedChains.includes(chain.id) && activeIds.has(chain.id),
      )
      .slice(0, GRAPH_CHAINS_COUNT)
  }, [chains, selectedChains, data?.chainData])

  return (
    <HomeCard className={cn('flex flex-col gap-5', className)}>
      <HomeCardHeader
        title="Interop"
        subtitle="Last 24h"
        link={{ href: '/interop/summary', label: 'Dashboard' }}
      />
      {/* From lg the section is as tall as the column beside it, so its body
          is a size container (it never sets the height itself). Roughly
          square, the graph fills it, the largest square it fits with 48px
          spare at either side, and the figures go in the corners its ring
          leaves free; without that spare they run into the ring where the
          body is about as wide as tall. Clearly taller than
          wide, or too narrow for the corners, it stacks as on phones: the
          figures, the graph as a square (smaller when the height runs out, so
          nothing spills), then as many top protocols as the height left holds.
          Below lg it stacks too, the graph a fixed-size square. */}
      <div className="relative flex min-w-0 flex-col gap-5 lg:min-h-[480px] lg:flex-1 lg:basis-0 lg:[container:interop-body/size]">
        {data && (
          <Stats
            data={data}
            chains={chains}
            className="interop-corners:hidden"
          />
        )}
        <div className="pointer-events-none interop-corners:absolute interop-corners:inset-x-12 interop-corners:inset-y-0 flex interop-stacked:aspect-square interop-corners:min-h-0 interop-stacked:min-h-0 min-h-[360px] interop-stacked:w-full min-w-0 interop-stacked:shrink flex-col items-center">
          <FlowsGraphPanel
            activeChains={graphChains}
            data={data}
            hasEnoughChains={hasEnoughChains}
            hasEnoughProtocols={hasEnoughProtocols}
            isLoading={isLoading}
            // Chain labels hang below the bubbles; pb keeps them in the
            // section, and on phones px keeps the outer ones off its edges.
            className="pb-6 max-sm:px-2 max-lg:order-none"
            maxSizeClassName="max-w-[460px] lg:max-w-none"
          />
        </div>
        {data && (
          <>
            <TopProtocols
              protocols={data.stats.topProtocols}
              className="interop-corners:hidden interop-stacked:min-h-0 interop-stacked:flex-1 interop-stacked:basis-0 interop-stacked:overflow-hidden"
            />
            <CornerStats data={data} chains={chains} />
          </>
        )}
      </div>
    </HomeCard>
  )
}

const GRAPH_CHAINS_COUNT = 9
/** Protocols under the graph; stacked from lg, as many as the height holds. */
const TOP_PROTOCOLS_COUNT = 5
/** The busiest protocols, in a corner beside the graph. */
const CORNER_PROTOCOLS_COUNT = 3

/**
 * The interop page's general stats: volume, transfers and routes, then the
 * top chain, token and protocol. The busiest protocols are listed apart: under
 * the graph in TopProtocols, or in a corner beside it.
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
    <div className={cn(STATS_GRID_CLASS, className)}>
      <Figure label="Volume" value={formatCurrency(stats.totalVolume, 'usd')} />
      <Figure
        label="Transfers"
        value={formatInteger(stats.totalTransferCount)}
      />
      <Figure label="Active routes" value={formatInteger(stats.activeFlows)} />
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
  )
}

/**
 * Two rows of three on shared tracks, spread from edge to edge: the first
 * column flush left, the last flush right, so the figures span the width the
 * graph under them is centred in.
 */
const STATS_GRID_CLASS =
  'grid grid-cols-[repeat(3,minmax(0,max-content))] justify-between gap-x-3 gap-y-6 sm:gap-x-6'

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

/** The busiest protocols over the last 24h, ranked like the other cards. */
function TopProtocols({
  protocols,
  className,
}: {
  protocols: FlowProtocol[]
  className?: string
}) {
  if (protocols.length === 0) {
    return null
  }
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <h3 className={HOME_TEXT.sectionTitle}>Top protocols</h3>
      {/* Stacked from lg, the list takes the height left and shows as many
          whole rows as fit. */}
      <ol
        className={cn(
          'interop-stacked:home-fill-rows interop-stacked:min-h-0 interop-stacked:flex-1 interop-stacked:basis-0 interop-stacked:overflow-hidden',
          HOME_ROW_LINES_CLASS,
        )}
      >
        {protocols.map(({ slug, name, iconUrl, volume }, index) => (
          <li
            key={slug}
            className={cn(
              'flex w-full items-center gap-2',
              HOME_ROW_CLASS,
              index >= TOP_PROTOCOLS_COUNT && 'interop-stacked:flex hidden',
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
              href={`/interop/protocols/${slug}`}
              className="group flex min-w-0 flex-1 items-center gap-1.5"
            >
              <img src={iconUrl} alt="" className={HOME_ICON_CLASS} />
              <span
                className={cn(
                  'truncate underline-offset-2 group-hover:underline',
                  HOME_TEXT.row,
                )}
              >
                {name}
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
 * bottom left, the busiest protocols bottom right.
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
  const protocols = stats.topProtocols.slice(0, CORNER_PROTOCOLS_COUNT)

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
      {protocols.length > 0 && (
        <div
          className={cn(CORNER_CLASS, 'right-0 bottom-0 items-end text-right')}
        >
          <span className={HOME_TEXT.meta}>Top protocols</span>
          <ol className="flex max-w-full flex-col items-end gap-2">
            {protocols.map(({ slug, name, iconUrl, volume }) => (
              <li key={slug} className="max-w-full">
                <a
                  href={`/interop/protocols/${slug}`}
                  title={name}
                  className="group flex min-w-0 items-center gap-2"
                >
                  <img src={iconUrl} alt="" className={HOME_ICON_CLASS} />
                  <span
                    className={cn(
                      'truncate underline-offset-2 group-hover:underline',
                      HOME_TEXT.row,
                    )}
                  >
                    {name}
                  </span>
                  <span className={cn('shrink-0', HOME_TEXT.value)}>
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
