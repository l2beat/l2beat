import { UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { TopItemsList } from './TopItemsList'

export function MultipleChainsStats({
  chainIdA,
  chainIdB,
  selectedChains,
}: {
  chainIdA: string
  chainIdB: string
  selectedChains: string[]
}) {
  const { selectedProtocols } = useInteropFlows()
  const { data, isLoading } = api.interop.flows.useQuery({
    chains: selectedChains,
    protocolIds: selectedProtocols,
  })

  if (!data || isLoading) {
    return null
  }

  const pairData = data.chainPairData.find(
    (p) =>
      (p.chains[0] === chainIdA && p.chains[1] === chainIdB) ||
      (p.chains[0] === chainIdB && p.chains[1] === chainIdA),
  )

  return (
    <>
      <Stats
        data={data}
        isLoading={isLoading}
        chainIdA={chainIdA}
        chainIdB={chainIdB}
      />
      <Routes
        data={data}
        isLoading={isLoading}
        chainIdA={chainIdA}
        chainIdB={chainIdB}
      />
      {pairData && (
        <TopItemsList
          label="TOP TOKENS"
          items={pairData.topTokens.map((t) => ({
            ...t,
            title: t.symbol,
          }))}
        />
      )}
      {pairData && (
        <TopItemsList
          label="TOP BRIDGES"
          items={pairData.topProtocols.map((p) => ({
            ...p,
            title: p.name,
          }))}
        />
      )}
    </>
  )
}

function Stats({
  data,
  isLoading,
  chainIdA,
  chainIdB,
}: {
  data: {
    flows: {
      srcChain: string
      dstChain: string
      volume: number
      transferCount: number
    }[]
  }
  isLoading: boolean
  chainIdA: string
  chainIdB: string
}) {
  const { allChains } = useInteropFlows()

  const flowAtoB = data.flows.find(
    (f) => f.srcChain === chainIdA && f.dstChain === chainIdB,
  )
  const flowBtoA = data.flows.find(
    (f) => f.srcChain === chainIdB && f.dstChain === chainIdA,
  )

  const totalVolume = (flowAtoB?.volume ?? 0) + (flowBtoA?.volume ?? 0)
  const totalTransfers =
    (flowAtoB?.transferCount ?? 0) + (flowBtoA?.transferCount ?? 0)
  const avgTransferValue = totalTransfers > 0 ? totalVolume / totalTransfers : 0

  const netFlowValue = (flowAtoB?.volume ?? 0) - (flowBtoA?.volume ?? 0)
  const netFlowChainId = netFlowValue > 0 ? chainIdB : chainIdA
  const netFlowChain = allChains.find((c) => c.id === netFlowChainId)

  const volumePerSecond = totalVolume / UnixTime.DAY

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <div className="mb-1.5 font-bold text-label-value-12">STATS</div>
      <div className="space-y-1.5">
        <StatRow
          label="Total volume"
          value={formatCurrency(totalVolume, 'usd')}
          isLoading={isLoading}
        />
        <StatRow
          label="Total transfers"
          value={formatInteger(totalTransfers)}
          isLoading={isLoading}
        />
        <StatRow
          label="Avg. transfer value"
          value={formatCurrency(avgTransferValue, 'usd')}
          isLoading={isLoading}
        />
        <StatRow
          label="Net flow"
          value={`${formatCurrency(Math.abs(netFlowValue), 'usd')} to ${netFlowChain?.name}`}
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

function Routes({
  data,
  isLoading,
  chainIdA,
  chainIdB,
}: {
  data: {
    flows: {
      srcChain: string
      dstChain: string
      volume: number
      transferCount: number
    }[]
  }
  isLoading: boolean
  chainIdA: string
  chainIdB: string
}) {
  const { allChains } = useInteropFlows()

  const flows = data.flows
    .filter(
      (f) =>
        (f.srcChain === chainIdA && f.dstChain === chainIdB) ||
        (f.srcChain === chainIdB && f.dstChain === chainIdA),
    )
    .sort((a, b) => b.volume - a.volume)

  if (flows.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <div className="mb-1.5 font-bold text-label-value-12">ROUTES</div>
      <div className="space-y-1">
        {flows.map((flow) => {
          const srcChain = allChains.find((c) => c.id === flow.srcChain)
          const dstChain = allChains.find((c) => c.id === flow.dstChain)
          return (
            <div
              key={`${flow.srcChain}-${flow.dstChain}`}
              className="flex w-full items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1">
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
              </div>
              {isLoading ? (
                <Skeleton className="mt-0.5 h-4 w-full" />
              ) : (
                <div className="mt-0.5 flex items-center gap-2 font-semibold text-[13px] leading-none">
                  <span>{formatCurrency(flow.volume, 'usd')}</span>
                  <span className="text-secondary">
                    {formatInteger(flow.transferCount)} txs
                  </span>
                </div>
              )}
            </div>
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
}: {
  label: ReactNode
  value: string
  isLoading: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2 text-[13px]">
      <span className="font-medium text-secondary leading-none">{label}</span>
      {isLoading ? (
        <Skeleton className="h-4 w-16" />
      ) : (
        <span className="font-semibold leading-[1.15]">{value}</span>
      )}
    </div>
  )
}
