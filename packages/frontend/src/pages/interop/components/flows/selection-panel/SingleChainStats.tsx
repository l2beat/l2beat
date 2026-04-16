import { UnixTime } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { Skeleton } from '~/components/core/Skeleton'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropFlowsData } from '~/server/features/scaling/interop/getInteropFlows'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useInteropFlows } from '../utils/InteropFlowsContext'
import { TopItemsList } from './TopItemsList'

export function SingleChainStats({
  chainId,
  selectedChains,
}: {
  chainId: string
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
          }))}
        />
      )}
      {chainData && (
        <TopItemsList
          label="Top bridges"
          items={chainData.topProtocols.map((p) => ({
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

  const totalTransfers = chainData.transfersIn + chainData.transfersOut
  const avgTransferValue =
    totalTransfers > 0 ? chainData.totalVolume / totalTransfers : 0

  const volumePerSecond = chainData.totalVolume / UnixTime.DAY

  return (
    <div className="rounded-lg border border-divider bg-surface-primary px-4 py-3">
      <div className="mb-1.5 font-bold text-label-value-12 uppercase">
        Stats
      </div>
      <div className="space-y-1.5">
        <StatRow
          label="Volume in"
          value={formatCurrency(chainData.inflow, 'usd')}
          isLoading={isLoading}
        />
        <StatRow
          label="Volume out"
          value={formatCurrency(chainData.outflow, 'usd')}
          isLoading={isLoading}
        />
        <StatRow
          label="Net flow"
          value={formatCurrency(chainData.netFlow, 'usd')}
          isLoading={isLoading}
        />
        <StatRow
          label="Transfers in"
          value={formatInteger(chainData.transfersIn)}
          isLoading={isLoading}
        />
        <StatRow
          label="Transfers out"
          value={formatInteger(chainData.transfersOut)}
          isLoading={isLoading}
        />
        <StatRow
          label="Avg. transfer value"
          value={formatCurrency(avgTransferValue, 'usd')}
          isLoading={isLoading}
        />
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
  const { allChains } = useInteropFlows()

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
