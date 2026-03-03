import { assert } from '@l2beat/shared-pure'
import times from 'lodash/times'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
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
      name: chain.name,
    }
  }

  const totalVolume = flows?.reduce((acc, flow) => acc + flow.volume, 0)

  return (
    <PrimaryCard
      className={cn(
        '@container h-full border-divider max-md:border-b',
        className,
      )}
    >
      <div className="flex flex-col">
        <h2 className="font-bold text-heading-16 md:text-heading-20">
          Last 24 hours flows
        </h2>
        <div className="mt-1 font-medium text-label-value-12 text-secondary max-md:hidden md:text-label-value-14">
          By volume
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 md:mt-4">
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-pointer">
                <Breakdown
                  className="mt-3! h-1.5 w-full md:mt-4!"
                  values={flows?.map((flow, i) => ({
                    value: flow.volume,
                    className: i === 0 ? 'bg-purple-100' : 'bg-n-pink-350',
                  }))}
                />
              </div>
            </TooltipTrigger>
            <TooltipPortal>
              <TooltipContent className="flex flex-col gap-1.5">
                {flows.map((flow) => (
                  <FlowTooltipItem
                    key={flow.srcChain + flow.dstChain}
                    flow={flow}
                    from={getChainDetails(flow.srcChain)}
                    to={getChainDetails(flow.dstChain)}
                    totalVolume={totalVolume ?? 0}
                  />
                ))}
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        )}
      </div>
    </PrimaryCard>
  )
}

function FlowTooltipItem({
  flow,
  from,
  to,
  totalVolume,
}: {
  flow: InteropDashboardData['flows'][number]
  from: { id: string; iconUrl: string; name: string }
  to: { id: string; iconUrl: string; name: string }
  totalVolume: number
}) {
  return (
    <div
      key={flow.srcChain + flow.dstChain}
      className="flex items-center gap-2.5"
    >
      <div className="flex items-center gap-1.5 font-medium text-label-value-15">
        <img src={from.iconUrl} alt={from.id} className="size-5" />
        <span>{from.name}</span>
        <ArrowRightIcon className="size-5 fill-brand" />
        <img src={to.iconUrl} alt={to.id} className="size-5" />
        <span>{to.name}</span>
      </div>
      <div className="font-bold text-label-value-15">
        {Math.round((flow.volume / totalVolume) * 100)}%
      </div>
    </div>
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
    <div className="flex flex-col items-center rounded-lg border border-divider px-4 py-3 md:py-4">
      <div className="flex gap-1.5">
        <img src={from.iconUrl} alt={from.id} className="size-5" />
        <ArrowRightIcon className="size-5 fill-brand" />
        <img src={to.iconUrl} alt={to.id} className="size-5" />
      </div>
      <span className="mt-2 font-medium text-label-value-12 text-secondary md:text-label-value-14">
        Volume
      </span>
      <div className="mt-0.5 font-bold text-heading-20 md:text-heading-24">
        {formatCurrency(volume, 'usd')}
      </div>
    </div>
  )
}
