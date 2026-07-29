import { useQuery } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { getInteropTokenUrl } from '../../../utils/getInteropTokenUrl'
import { getChainFlowDerivedStats } from '../utils/flowStats'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { AvgDurationStatValue } from './AvgDurationStatValue'
import { getChainFlowStatItems } from './getChainFlowStatItems'
import { TopItemsList } from './TopItemsList'

export function SingleChainStats({
  chainId,
  selectedChains,
  tokenId,
  linkTopProtocols,
  hideTopProtocols,
}: {
  chainId: string
  selectedChains: string[]
  tokenId?: string
  linkTopProtocols?: boolean
  hideTopProtocols?: boolean
}) {
  const trpc = useTRPC()
  const { selectedProtocols } = useInteropFlows()
  const { data, isLoading } = useQuery(
    trpc.interop.flows.queryOptions({
      chains: selectedChains,
      protocolIds: selectedProtocols,
      tokenId,
    }),
  )

  if (!data || isLoading) {
    return null
  }

  const chainData = data.chainData.find((cv) => cv.chainId === chainId)

  return (
    <>
      <Stats data={data} isLoading={isLoading} chainId={chainId} />
      <TopRoutes data={data} isLoading={isLoading} chainId={chainId} />
      {chainData && (
        <TopItemsList
          label="Top tokens"
          items={chainData.topTokens.map((t) => ({
            ...t,
            title: t.symbol,
            href: getInteropTokenUrl(t),
          }))}
        />
      )}
      {chainData && !hideTopProtocols && (
        <TopItemsList
          label="Top bridges"
          items={chainData.topProtocols.map((p) => ({
            ...p,
            title: p.name,
            href: linkTopProtocols ? `/interop/protocols/${p.slug}` : undefined,
          }))}
        />
      )}
    </>
  )
}

function Stats({
  data,
  isLoading,
  chainId,
}: {
  data: InteropFlowsData
  isLoading: boolean
  chainId: string
}) {
  const chainData = data?.chainData.find((cv) => cv.chainId === chainId)
  if (!chainData) {
    return null
  }

  const { volumePerSecond } = getChainFlowDerivedStats(chainData)

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <div className="mb-1.5 font-bold text-label-value-12 uppercase">
        Stats
      </div>
      <div className="space-y-1.5">
        {getChainFlowStatItems(chainData).map((item) => (
          <StatRow
            key={item.label}
            label={item.label}
            value={item.value}
            isLoading={isLoading}
          />
        ))}
        {chainData.avgDuration && (
          <StatRow
            label="Avg. transfer time"
            value={<AvgDurationStatValue avgDuration={chainData.avgDuration} />}
            isLoading={isLoading}
          />
        )}
        <StatRow
          label="Connected"
          value={`${chainData.connectedChains} chains`}
          isLoading={isLoading}
        />
        <StatRow
          label="Avg. value per second"
          value={`${formatCurrency(volumePerSecond, 'usd')}/s`}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

function TopRoutes({
  data,
  isLoading,
  chainId,
}: {
  data: InteropFlowsData
  isLoading: boolean
  chainId: string
}) {
  const { allChains, setHighlightedChainPair } = useInteropFlows()

  const flows = data?.flows
    .filter((cv) => cv.srcChain === chainId || cv.dstChain === chainId)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 3)

  if (flows.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <div className="mb-1.5 font-bold text-label-value-12 uppercase">
        Top routes
      </div>
      <div className="space-y-1">
        {flows.map((flow) => {
          const srcChain = allChains.find((c) => c.id === flow.srcChain)
          const dstChain = allChains.find((c) => c.id === flow.dstChain)
          return (
            <StatRow
              key={`${flow.srcChain}-${flow.dstChain}`}
              onClick={() =>
                setHighlightedChainPair(flow.srcChain, flow.dstChain)
              }
              label={
                <span className="flex items-center gap-1">
                  {srcChain && (
                    <img
                      src={srcChain.iconUrl}
                      alt={srcChain.name}
                      className="size-4"
                    />
                  )}
                  <ArrowRightIcon className="size-4 fill-brand" />
                  {dstChain && (
                    <img
                      src={dstChain.iconUrl}
                      alt={dstChain.name}
                      className="size-4"
                    />
                  )}
                </span>
              }
              value={formatCurrency(flow.volume, 'usd')}
              isLoading={isLoading}
            />
          )
        })}
      </div>
    </div>
  )
}

function StatRow({
  label,
  value,
  isLoading,
  onClick,
}: {
  label: ReactNode
  value: ReactNode
  isLoading: boolean
  onClick?: () => void
}) {
  const baseClassName =
    'flex w-full items-start justify-between gap-2 text-[13px]'
  const content = (
    <>
      <span className="whitespace-nowrap font-medium text-secondary leading-none">
        {label}
      </span>
      {isLoading ? (
        <Skeleton className="h-4 w-16" />
      ) : (
        <div className="text-right font-semibold leading-[1.15]">{value}</div>
      )}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          baseClassName,
          'rounded transition-opacity hover:opacity-80',
        )}
      >
        {content}
      </button>
    )
  }

  return <div className={baseClassName}>{content}</div>
}
