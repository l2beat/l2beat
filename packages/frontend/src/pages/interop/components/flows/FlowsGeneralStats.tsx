import { UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useScaledParticleCounts } from './graph/utils/useScaledParticleCounts'
import { useInteropFlows } from './utils/InteropFlowsContext'

export function FlowsGeneralStats() {
  const { selectedChains, allChains, selectedProtocols } = useInteropFlows()

  const { data, isLoading } = api.interop.flows.useQuery({
    chains: selectedChains,
    protocolIds: selectedProtocols,
  })

  const { dollarsPerParticle } = useScaledParticleCounts(
    selectedChains,
    data?.chainData,
    data?.flows,
  )

  const topRoute = data?.stats.topRoute
  const srcChain = topRoute
    ? allChains.find((c) => c.id === topRoute.srcChain)
    : undefined
  const dstChain = topRoute
    ? allChains.find((c) => c.id === topRoute.dstChain)
    : undefined
  const topChain = data?.stats.topChain
  const topChainData = topChain
    ? allChains.find((c) => c.id === topChain.chainId)
    : undefined
  const topToken = data?.stats.topToken
  const avgValuePerSecond = (data?.stats.totalVolume ?? 0) / UnixTime.DAY

  return (
    <div className="flex h-full flex-col rounded-lg bg-surface-secondary p-4 dark:bg-header-secondary">
      <div className="font-bold text-heading-20">General stats</div>
      <div className="mt-1 font-medium text-label-value-14 text-secondary">
        For past 24h between the selected chains and protocols
      </div>
      <div className="mt-1.5 space-y-2">
        <div className="grid grid-cols-1 gap-2 md:max-lg:grid-cols-3">
          <Card
            title="Volume"
            value={formatCurrency(data?.stats.totalVolume ?? 0, 'usd')}
            isLoading={isLoading}
          />
          <Card
            title="Active routes"
            value={formatInteger(data?.stats.activeFlows ?? 0)}
            isLoading={isLoading}
          />
          <Card
            title="Transfers"
            value={formatInteger(data?.stats.totalTransferCount ?? 0)}
            isLoading={isLoading}
          />
        </div>
        <HorizontalSeparator className="my-4" />
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-divider bg-surface-primary p-4">
          <Card
            title="Top route"
            isLoading={isLoading}
            className="border-0 p-0!"
            value={
              srcChain && dstChain ? (
                <div className="flex items-center gap-1.5">
                  <img
                    src={srcChain.iconUrl}
                    alt={srcChain.id}
                    className="size-5"
                  />
                  <ArrowRightIcon className="size-4 fill-brand" />
                  <img
                    src={dstChain.iconUrl}
                    alt={dstChain.id}
                    className="size-5"
                  />
                </div>
              ) : (
                '-'
              )
            }
          />
          <HorizontalSeparator />
          <Card
            title="Top chain"
            isLoading={isLoading}
            className="border-0 p-0!"
            value={
              topChain && topChainData ? (
                <div className="flex flex-col items-center gap-0.5 text-heading-18">
                  <span className="text-brand">{topChainData.name}</span>
                  <span className="font-medium text-secondary">
                    {formatCurrency(topChain.totalVolume, 'usd')}
                  </span>
                </div>
              ) : (
                '-'
              )
            }
          />
          <HorizontalSeparator />
          <Card
            title="Top token"
            isLoading={isLoading}
            className="border-0 p-0!"
            value={
              topToken ? (
                <div className="flex items-center gap-1.5">
                  <img
                    src={topToken.iconUrl}
                    alt={topToken.symbol}
                    className="size-5"
                  />
                  <span className="font-bold text-heading-20">
                    {topToken.symbol}
                  </span>
                  <span className="font-medium text-label-value-14 text-secondary">
                    {formatCurrency(topToken.volume, 'usd')}
                  </span>
                </div>
              ) : (
                '-'
              )
            }
          />
        </div>
      </div>
      <div className="mt-auto space-y-1 pt-4 text-center font-medium text-label-value-14 text-secondary">
        {isLoading ? (
          <Skeleton className="mx-auto h-5 w-40" />
        ) : (
          <>
            {dollarsPerParticle && (
              <div className="flex items-center justify-center gap-1">
                <div className="size-1.5 rounded-full bg-brand" />1 particle ≈{' '}
                <span className="font-bold text-brand">
                  {formatCurrency(dollarsPerParticle, 'usd', {
                    decimals: 0,
                  })}
                </span>
              </div>
            )}
            <div>
              Avg value per second ≈{' '}
              <span className="font-bold text-brand">
                {formatCurrency(avgValuePerSecond, 'usd')}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function Card({
  title,
  value,
  isLoading,
  className,
}: {
  title: string
  value: ReactNode
  isLoading: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-lg border border-divider bg-surface-primary px-4 py-2',
        className,
      )}
    >
      <span className="font-medium text-label-value-14 text-secondary">
        {title}
      </span>
      {isLoading ? (
        <Skeleton className="h-6 w-20" />
      ) : (
        <div className="font-bold text-heading-20">{value}</div>
      )}
    </div>
  )
}
