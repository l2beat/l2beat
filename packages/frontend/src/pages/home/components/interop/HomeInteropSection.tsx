import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { BridgesIcon } from '~/icons/pages/Bridges'
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
import { cn } from '~/utils/cn'
import { HomeCard } from '../HomeCard'
import { HomeCardHeader } from '../HomeCardHeader'
import { InteropCornerFigures } from './InteropCornerFigures'
import { getInteropFigures } from './InteropFigures'
import { InteropTopList } from './InteropTopList'

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
      <Content className={className} />
    </InteropFlowsProvider>
  )
}

function Content({ className }: { className?: string }) {
  const trpc = useTRPC()
  const { allChains, selectedChains, selectedProtocols } = useInteropFlows()
  const hasEnoughChains = selectedChains.length >= MIN_SELECTED_CHAINS
  const hasEnoughProtocols = selectedProtocols.length >= MIN_SELECTED_PROTOCOLS

  const { data, isLoading } = useQuery(
    trpc.interop.flowsOverview.queryOptions(
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
    return allChains
      .filter(
        (chain) => selectedChains.includes(chain.id) && activeIds.has(chain.id),
      )
      .slice(0, GRAPH_CHAINS_COUNT)
  }, [allChains, selectedChains, data?.chainData])
  const figures = data && getInteropFigures(data.stats, allChains)

  return (
    <HomeCard className={cn('flex flex-col gap-5', className)}>
      <HomeCardHeader
        title="Interop"
        icon={<BridgesIcon aria-hidden />}
        subtitle="Last 24h"
        link={{ href: '/interop/summary', label: 'Dashboard' }}
      />
      {/* From lg the section is as tall as the column beside it, its body at
          least 480px; from md to lg it has the whole row, so its body is 480px
          tall. Either way the body is a size container (it never sets the
          height itself). Roughly square, the graph fills it, the largest
          square it fits with 48px spare at either side, and the figures go in
          the corners its ring leaves free; without that spare they run into
          the ring where the body is about as wide as tall. Clearly taller than
          wide, or too narrow for the corners, it stacks as on phones: the
          figures, the graph as a square (smaller when the height runs out, so
          nothing spills), then up to five top protocols, as many as the height left holds.
          Below md it stacks too, the graph a fixed-size square.
          In the page's three columns (`home-wide`) the card is about twice as
          wide as tall, so it splits in two instead: the graph, as large a
          square as the body holds, and beside it a 440px panel. The panel shows
          the totals, with the top protocols and tokens at its foot. The body is
          648px tall there (728px over 1700px), so the research list beside
          the card ends on a whole row. */}
      <div className="relative flex home-wide:@min-[1700px]/home:min-h-[728px] home-wide:min-h-[648px] min-w-0 flex-col gap-5 md:max-lg:h-[480px] lg:min-h-[480px] lg:flex-1 lg:basis-0 md:[container:interop-body/size]">
        <div className="home-wide:absolute home-wide:inset-0 home-wide:grid contents home-wide:grid-cols-[minmax(0,1fr)_27.5rem] home-wide:grid-rows-[auto_minmax(0,1fr)_auto] home-wide:gap-x-12 home-wide:gap-y-8">
          {figures && (
            // Two rows of three on shared tracks, spread from edge to edge: the
            // first column flush left, the last flush right, so the figures
            // span the width the graph or the list under them takes. Over the
            // list, the last column also aligns right, on its values' edge.
            // Beside the graph the top route takes the top token's place:
            // the token list under them already starts with it. On the
            // narrowest phones three 32px figures don't fit one row, so the
            // volume takes a row of its own.
            <div className="home-wide:col-start-2 home-wide:row-start-1 grid interop-corners:hidden grid-cols-[repeat(3,minmax(0,max-content))] justify-between gap-x-3 gap-y-6 max-[390px]:grid-cols-2 sm:gap-x-6 max-[390px]:[&>:first-child]:col-span-2 home-wide:[&>:nth-child(3)]:items-end home-wide:[&>:nth-child(3)]:text-right home-wide:[&>:nth-child(n+6)]:hidden">
              {figures.volume}
              {figures.transfers}
              {figures.activeRoutes}
              {figures.topChain}
              <div className="home-wide:col-span-2 home-wide:flex hidden min-w-0">
                {figures.topRoute}
              </div>
              {figures.topToken}
              {figures.topProtocol}
            </div>
          )}
          <div className="pointer-events-none interop-corners:absolute interop-corners:inset-x-12 interop-corners:inset-y-0 home-wide:col-start-1 home-wide:row-span-3 home-wide:row-start-1 flex interop-stacked:aspect-square home-wide:min-h-0 interop-corners:min-h-0 interop-stacked:min-h-0 min-h-[360px] interop-stacked:w-full min-w-0 interop-stacked:shrink flex-col items-center [&_text]:stroke-[4px] [&_text]:stroke-surface-primary [&_text]:[paint-order:stroke] [&_text]:[stroke-linejoin:round]">
            <FlowsGraphPanel
              activeChains={graphChains}
              data={data}
              hasEnoughChains={hasEnoughChains}
              hasEnoughProtocols={hasEnoughProtocols}
              isLoading={isLoading}
              // Chain labels hang below the bubbles; pb keeps them in the
              // section, and on phones px keeps the outer ones off its edges.
              className="pb-6 max-sm:px-2 max-lg:order-none"
              maxSizeClassName="max-w-[460px] md:max-w-none"
            />
          </div>
          {data && figures && (
            <>
              <InteropTopList
                title="Top protocols"
                rows={data.stats.topProtocols.map((p) => ({
                  id: p.slug,
                  name: p.name,
                  href: `/interop/protocols/${p.slug}`,
                  iconUrl: p.iconUrl,
                  volume: p.volume,
                }))}
                className="home-wide:col-start-2 home-wide:row-start-2 home-wide:self-end"
              />
              <InteropTopList
                title="Top tokens"
                rows={data.stats.topTokens.items.map((t) => ({
                  id: t.id,
                  name: t.symbol,
                  href: getInteropTokenUrl(t),
                  iconUrl: t.iconUrl,
                  volume: t.volume,
                }))}
                className="home-wide:col-start-2 home-wide:row-start-3 home-wide:flex hidden"
              />
            </>
          )}
        </div>
        {data && figures && (
          <InteropCornerFigures
            figures={figures}
            protocols={data.stats.topProtocols}
          />
        )}
      </div>
    </HomeCard>
  )
}

const GRAPH_CHAINS_COUNT = 9
