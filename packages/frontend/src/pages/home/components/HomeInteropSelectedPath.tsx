import type { ReactNode } from 'react'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import {
  getChainFlowDerivedStats,
  getPairFlowStats,
} from '~/pages/interop/components/flows/utils/flowStats'
import type {
  FlowProtocol,
  FlowToken,
  InteropFlowsData,
} from '~/server/features/scaling/interop/getInteropFlows'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface StatRow {
  label: string
  value: string
}

interface TopRoute {
  src: InteropChainWithIcon | undefined
  dst: InteropChainWithIcon | undefined
  volume: number
}

/**
 * Compact summary shown at the bottom of the home Interop widget when a chain
 * or chain-pair is selected on the graph. Two-column stats plus single top
 * route / token / bridge rows — a condensed version of the detailed-page panel.
 */
export function HomeInteropSelectedPath({
  data,
  allChains,
  selectedChains,
  visibleHighlightedChains,
}: {
  data: InteropFlowsData
  allChains: InteropChainWithIcon[]
  selectedChains: string[]
  visibleHighlightedChains: string[]
}) {
  const chainA = allChains.find((c) => c.id === visibleHighlightedChains[0])
  if (!chainA) {
    return null
  }
  const chainB =
    visibleHighlightedChains.length === 2
      ? allChains.find((c) => c.id === visibleHighlightedChains[1])
      : undefined

  const summary =
    chainB !== undefined
      ? getPairSummary(data, allChains, chainA.id, chainB.id)
      : getChainSummary(data, allChains, chainA.id)

  const subtitle = chainB
    ? chainB.name
    : `${selectedChains.length - 1} selected chains`

  return (
    <div className="rounded-lg bg-surface-secondary p-3 dark:bg-header-secondary">
      <div className="flex items-baseline gap-1.5">
        <span className="font-bold text-label-value-15">Selected path</span>
        <span className="min-w-0 truncate font-medium text-label-value-12 text-secondary">
          {chainA.name} ↔ {subtitle}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        {summary.stats.map((stat) => (
          <Row key={stat.label} label={stat.label}>
            <span className="font-semibold tabular-nums">{stat.value}</span>
          </Row>
        ))}
      </div>
      <div className="mt-2 space-y-1 border-divider border-t pt-2">
        {summary.topRoute && (summary.topRoute.src || summary.topRoute.dst) && (
          <Row label="Top route">
            <span className="flex items-center gap-1">
              <ChainIcon chain={summary.topRoute.src} />
              <ArrowRightIcon className="size-3 shrink-0 fill-brand" />
              <ChainIcon chain={summary.topRoute.dst} />
              <span className="font-semibold tabular-nums">
                {formatCurrency(summary.topRoute.volume, 'usd')}
              </span>
            </span>
          </Row>
        )}
        {summary.topToken && (
          <Row label="Top token">
            <span className="flex min-w-0 items-center gap-1">
              <img
                src={summary.topToken.iconUrl}
                alt={summary.topToken.symbol}
                className="size-4 shrink-0 rounded-full"
              />
              <span className="truncate font-semibold">
                {summary.topToken.symbol}
              </span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(summary.topToken.volume, 'usd')}
              </span>
            </span>
          </Row>
        )}
        {summary.topProtocol && (
          <Row label="Top bridge">
            <span className="flex min-w-0 items-center gap-1">
              <img
                src={summary.topProtocol.iconUrl}
                alt={summary.topProtocol.name}
                className="size-4 shrink-0 rounded-full"
              />
              <span className="truncate font-semibold">
                {summary.topProtocol.name}
              </span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(summary.topProtocol.volume, 'usd')}
              </span>
            </span>
          </Row>
        )}
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 text-label-value-12">
      <span className="shrink-0 font-medium text-secondary">{label}</span>
      <span className="min-w-0 truncate text-right">{children}</span>
    </div>
  )
}

function ChainIcon({ chain }: { chain: InteropChainWithIcon | undefined }) {
  if (!chain) {
    return null
  }
  return (
    <img
      src={chain.iconUrl}
      alt={chain.name}
      className="size-4 shrink-0 rounded-full"
    />
  )
}

interface Summary {
  stats: StatRow[]
  topRoute: TopRoute | undefined
  topToken: FlowToken | undefined
  topProtocol: FlowProtocol | undefined
}

function getChainSummary(
  data: InteropFlowsData,
  allChains: InteropChainWithIcon[],
  chainId: string,
): Summary {
  const chainData = data.chainData.find((cv) => cv.chainId === chainId)
  if (!chainData) {
    return {
      stats: [],
      topRoute: undefined,
      topToken: undefined,
      topProtocol: undefined,
    }
  }

  const { totalTransfers, avgTransferValue, volumePerSecond } =
    getChainFlowDerivedStats(chainData)

  const topFlow = data.flows
    .filter((f) => f.srcChain === chainId || f.dstChain === chainId)
    .sort((a, b) => b.volume - a.volume)[0]

  return {
    stats: [
      {
        label: 'Total volume',
        value: formatCurrency(chainData.totalVolume, 'usd'),
      },
      { label: 'Net flow', value: formatCurrency(chainData.netFlow, 'usd') },
      { label: 'Volume in', value: formatCurrency(chainData.inflow, 'usd') },
      { label: 'Volume out', value: formatCurrency(chainData.outflow, 'usd') },
      { label: 'Transfers', value: formatInteger(totalTransfers) },
      {
        label: 'Avg. transfer',
        value: formatCurrency(avgTransferValue, 'usd'),
      },
      { label: 'Connected', value: `${chainData.connectedChains} chains` },
      {
        label: 'Per second',
        value: `${formatCurrency(volumePerSecond, 'usd')}/s`,
      },
    ],
    topRoute: topFlow
      ? {
          src: allChains.find((c) => c.id === topFlow.srcChain),
          dst: allChains.find((c) => c.id === topFlow.dstChain),
          volume: topFlow.volume,
        }
      : undefined,
    topToken: chainData.topTokens[0],
    topProtocol: chainData.topProtocols[0],
  }
}

function getPairSummary(
  data: InteropFlowsData,
  allChains: InteropChainWithIcon[],
  chainIdA: string,
  chainIdB: string,
): Summary {
  const {
    totalVolume,
    totalTransfers,
    avgTransferValue,
    netFlowValue,
    netFlowChainId,
    volumePerSecond,
    topFlow,
  } = getPairFlowStats(data.flows, chainIdA, chainIdB)
  const netFlowChain = allChains.find((c) => c.id === netFlowChainId)

  const pairData = data.chainPairData.find(
    (p) =>
      (p.chains[0] === chainIdA && p.chains[1] === chainIdB) ||
      (p.chains[0] === chainIdB && p.chains[1] === chainIdA),
  )

  return {
    stats: [
      { label: 'Total volume', value: formatCurrency(totalVolume, 'usd') },
      { label: 'Transfers', value: formatInteger(totalTransfers) },
      {
        label: 'Avg. transfer',
        value: formatCurrency(avgTransferValue, 'usd'),
      },
      {
        label: 'Net flow',
        value: `${formatCurrency(Math.abs(netFlowValue), 'usd')}${netFlowChain ? ` → ${netFlowChain.name}` : ''}`,
      },
      {
        label: 'Per second',
        value: `${formatCurrency(volumePerSecond, 'usd')}/s`,
      },
    ],
    topRoute: topFlow
      ? {
          src: allChains.find((c) => c.id === topFlow.srcChain),
          dst: allChains.find((c) => c.id === topFlow.dstChain),
          volume: topFlow.volume,
        }
      : undefined,
    topToken: pairData?.topTokens[0],
    topProtocol: pairData?.topProtocols[0],
  }
}
