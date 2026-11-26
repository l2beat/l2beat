import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { AvgDurationStatValue } from '~/pages/interop/components/flows/selection-panel/AvgDurationStatValue'
import { getChainFlowStatItems } from '~/pages/interop/components/flows/selection-panel/getChainFlowStatItems'
import { StatsCardHeader } from '~/pages/interop/components/flows/selection-panel/StatsCardHeader'
import { describeChainScope } from '~/pages/interop/components/flows/utils/describeChainScope'
import { useInteropFlows } from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { InteropFlowsData } from '~/server/features/layer2s/interop/getInteropFlows'
import { cn } from '~/utils/cn'

interface StatItem {
  label: string
  value: ReactNode
  valueClassName?: string
  onClick?: () => void
}

export function BridgeFlowStats({
  data,
  chainId,
}: {
  data: InteropFlowsData
  chainId: string
}) {
  const { allChains, selectedChains, setHighlightedChainPair } =
    useInteropFlows()

  const chainData = data.chainData.find((c) => c.chainId === chainId)
  if (!chainData) return null

  const routes = data.flows
    .filter((f) => f.srcChain === chainId || f.dstChain === chainId)
    .sort((a, b) => b.volume - a.volume)
  const topFlow = routes.length > 1 ? routes[0] : undefined

  const items: StatItem[] = [
    ...getChainFlowStatItems(chainData),
    ...(chainData.avgDuration
      ? [
          {
            label: 'Avg. transfer time',
            value: <AvgDurationStatValue avgDuration={chainData.avgDuration} />,
          },
        ]
      : []),
    {
      label: 'Avg. value per second',
      value: `${formatCurrency(chainData.totalVolume / UnixTime.DAY, 'usd')}/s`,
    },
  ]

  if (topFlow) {
    const src = allChains.find((c) => c.id === topFlow.srcChain)
    const dst = allChains.find((c) => c.id === topFlow.dstChain)
    items.push({
      label: 'Top route',
      value: (
        <span className="flex items-center gap-1">
          {src && <img src={src.iconUrl} alt={src.name} className="size-4" />}
          <ArrowRightIcon className="size-4 fill-brand" />
          {dst && <img src={dst.iconUrl} alt={dst.name} className="size-4" />}
          <span className="ml-1">{formatCurrency(topFlow.volume, 'usd')}</span>
        </span>
      ),
      onClick: () =>
        setHighlightedChainPair(topFlow.srcChain, topFlow.dstChain),
    })
  }

  const half = Math.ceil(items.length / 2)
  const columns = [items.slice(0, half), items.slice(half)]

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <StatsCardHeader
        scope={describeChainScope(selectedChains.length, allChains.length)}
      />
      <div className="grid @min-[520px]:grid-cols-2 grid-cols-1 gap-x-12 gap-y-1">
        {columns.map((column, i) => (
          <div key={i} className="flex flex-col gap-1">
            {column.map((item) => (
              <StatRow key={item.label} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function StatRow({ item }: { item: StatItem }) {
  const content = (
    <>
      <span className="whitespace-nowrap font-normal leading-4">
        {item.label}
      </span>
      <div
        className={cn(
          'text-right font-semibold leading-4',
          item.valueClassName,
        )}
      >
        {item.value}
      </div>
    </>
  )
  const className = 'flex items-start justify-between gap-2 text-label-value-13'
  return item.onClick ? (
    <button
      type="button"
      onClick={item.onClick}
      className={cn(className, 'rounded transition-opacity hover:opacity-80')}
    >
      {content}
    </button>
  ) : (
    <div className={className}>{content}</div>
  )
}
