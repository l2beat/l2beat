import { assert } from '@l2beat/shared-pure'
import times from 'lodash/times'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function FlowsWidget({
  interopChains,
  isLoading,
  flows,
  className,
}: {
  interopChains: InteropChainWithIcon[]
  isLoading: boolean
  flows: InteropDashboardData['flows'] | undefined
  className?: string
}) {
  const getChainDetails = (id: string) => {
    const chain = interopChains.find((c) => c.id === id)
    assert(chain, `Chain not found: ${id}`)
    return {
      id: chain.id,
      iconUrl: chain.iconUrl,
    }
  }

  return (
    <PrimaryCard
      className={cn('@container h-full max-md:rounded-lg', className)}
    >
      <div className="flex flex-col">
        <h2 className="font-bold text-heading-16 md:text-heading-20">
          Last 24h flows
        </h2>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {isLoading &&
            times(2).map((index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          {flows?.map((flow) => (
            <FlowItem
              key={flow.srcChain + flow.dstChain}
              from={getChainDetails(flow.srcChain)}
              to={getChainDetails(flow.dstChain)}
              volume={flow.volume}
            />
          ))}
        </div>
        {flows && (
          <Breakdown
            className="mt-2! h-1 w-full"
            values={flows?.map((flow, i) => ({
              value: flow.volume,
              className: i === 0 ? 'bg-purple-100' : 'bg-[#6AC9FF]',
            }))}
          />
        )}
      </div>
    </PrimaryCard>
  )
}

function FlowItem({
  from,
  to,
  volume,
}: {
  from: { id: string; iconUrl: string }
  to: { id: string; iconUrl: string }
  volume: number
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-divider px-4 py-3">
      <div className="flex gap-1.5">
        <img src={from.iconUrl} alt={from.id} className="size-5" />
        <ArrowRightIcon className="size-5 fill-brand" />
        <img src={to.iconUrl} alt={to.id} className="size-5" />
      </div>
      <span className="mt-2 font-medium text-label-value-12 text-secondary">
        Volume
      </span>
      <div className="mt-0.5 font-bold text-label-value-20">
        {formatCurrency(volume, 'usd')}
      </div>
    </div>
  )
}
