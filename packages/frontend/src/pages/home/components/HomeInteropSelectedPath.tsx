import { pluralize } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { Button } from '~/components/core/Button'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { AvgDurationStatValue } from '~/pages/interop/components/flows/selection-panel/AvgDurationStatValue'
import { getChainFlowStatItems } from '~/pages/interop/components/flows/selection-panel/getChainFlowStatItems'
import {
  getChainFlowDerivedStats,
  getPairFlowStats,
} from '~/pages/interop/components/flows/utils/flowStats'
import { buildInteropUrl } from '~/pages/interop/utils/buildInteropUrl'
import type {
  FlowProtocol,
  FlowToken,
  InteropFlowsData,
} from '~/server/features/scaling/interop/getInteropFlows'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'

interface StatRow {
  label: string
  value: ReactNode
}

interface TopRoute {
  src: InteropChainWithIcon | undefined
  dst: InteropChainWithIcon | undefined
  volume: number
}

export function HomeInteropSelectedPath({
  data,
  allChains,
  selectedChains,
  visibleHighlightedChains,
  className,
}: {
  data: InteropFlowsData
  allChains: InteropChainWithIcon[]
  selectedChains: string[]
  visibleHighlightedChains: string[]
  className?: string
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
    : `${selectedChains.length - 1} selected ${pluralize(selectedChains.length - 1, 'chain')}`

  const cta = chainB
    ? {
        label: 'View path details',
        href: buildInteropUrl('/interop/summary', {
          from: [chainA.id, chainB.id],
          to: [chainA.id, chainB.id],
        }),
      }
    : chainA.href
      ? {
          label: 'View chain details',
          href: `${chainA.href}#interop-flows`,
        }
      : undefined

  return (
    <div
      className={cn(
        '@container flex flex-col rounded-lg bg-surface-secondary p-3 dark:bg-header-secondary',
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-1.5">
        <span className="shrink-0 font-bold text-label-value-15">
          Selected path
        </span>
        <span className="min-w-0 truncate font-medium text-label-value-12 text-secondary">
          {chainA.name} ↔ {subtitle}
        </span>
      </div>
      <div className="mt-2 grid @min-[300px]:grid-cols-2 grid-cols-1 gap-x-4 gap-y-1">
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
      {cta && (
        <a href={cta.href} className="mt-auto pt-3">
          <Button variant="fill" size="sm" className="w-full">
            {cta.label}
          </Button>
        </a>
      )}
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

  const { volumePerSecond } = getChainFlowDerivedStats(chainData)

  const topFlow = data.flows
    .filter((f) => f.srcChain === chainId || f.dstChain === chainId)
    .sort((a, b) => b.volume - a.volume)[0]

  return {
    stats: [
      ...getChainFlowStatItems(chainData),
      ...(chainData.avgDuration
        ? [
            {
              label: 'Avg. transfer time',
              value: (
                <AvgDurationStatValue avgDuration={chainData.avgDuration} />
              ),
            },
          ]
        : []),
      { label: 'Connected', value: `${chainData.connectedChains} chains` },
      {
        label: 'Avg. value per second',
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
      { label: 'Total transfers', value: formatInteger(totalTransfers) },
      {
        label: 'Avg. transfer value',
        value: formatCurrency(avgTransferValue, 'usd'),
      },
      ...(pairData?.avgDuration
        ? [
            {
              label: 'Avg. transfer time',
              value: (
                <AvgDurationStatValue avgDuration={pairData.avgDuration} />
              ),
            },
          ]
        : []),
      {
        label: 'Net flow',
        value: `${formatCurrency(Math.abs(netFlowValue), 'usd')}${netFlowChain ? ` to ${netFlowChain.name}` : ''}`,
      },
      {
        label: 'Avg. value per second',
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
