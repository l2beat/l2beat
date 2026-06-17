import { UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { getChainFlowStatItems } from '~/pages/interop/components/flows/selection-panel/getChainFlowStatItems'
import { useInteropFlows } from '~/pages/interop/components/flows/utils/InteropFlowsContext'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface StatItem {
  label: string
  value: ReactNode
  onClick?: () => void
}

export function BridgeFlowStats({
  data,
  chainId,
}: {
  data: InteropFlowsData
  chainId: string
}) {
  const { allChains, setHighlightedChainPair } = useInteropFlows()

  const chainData = data.chainData.find((c) => c.chainId === chainId)
  if (!chainData) return null

  const routes = data.flows
    .filter((f) => f.srcChain === chainId || f.dstChain === chainId)
    .sort((a, b) => b.volume - a.volume)
  const topFlow = routes.length > 1 ? routes[0] : undefined

  const items: StatItem[] = [
    ...getChainFlowStatItems(chainData),
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
          <ArrowRightIcon className="size-3 fill-brand" />
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
      <div className="mb-1.5 font-bold text-label-value-12 uppercase">
        Stats
      </div>
      <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
        {columns.map((column, i) => (
          <div key={i} className="flex flex-col gap-1.5">
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
      <span className="font-medium text-secondary leading-none">
        {item.label}
      </span>
      <span className="font-semibold leading-[1.15]">{item.value}</span>
    </>
  )
  const className = 'flex items-center justify-between gap-2 text-[13px]'
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
