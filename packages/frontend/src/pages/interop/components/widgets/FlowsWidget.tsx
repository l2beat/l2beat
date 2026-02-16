import { assert } from '@l2beat/shared-pure'
import times from 'lodash/times'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { BetweenChainsInfo } from '../BetweenChainsInfo'

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
      name: chain.name,
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
        <BetweenChainsInfo className="mt-0.5" />
        <table className="-mb-1.5 mt-0.5 w-full border-separate border-spacing-y-1.5">
          <tbody>
            {isLoading &&
              times(4).map((index) => (
                <tr key={index}>
                  <td>
                    <Skeleton className="h-9.5 w-full" />
                  </td>
                </tr>
              ))}
            {flows?.map((flow) => (
              <PathItem
                key={flow.srcChain + flow.dstChain}
                from={getChainDetails(flow.srcChain)}
                to={getChainDetails(flow.dstChain)}
                volume={flow.volume}
              />
            ))}
          </tbody>
        </table>
      </div>
    </PrimaryCard>
  )
}

function PathItem({
  from,
  to,
  volume,
}: {
  from: { id: string; name: string; iconUrl: string }
  to: { id: string; name: string; iconUrl: string }
  volume: number
}) {
  return (
    <tr>
      <td className="rounded-l-lg border-divider border-t border-b border-l py-2 pl-2.5 leading-none">
        <div className="flex items-center gap-1.5">
          <img src={from.iconUrl} alt={from.name} className="size-5" />
          <div className="@max-[472px]:hidden font-medium text-label-value-15">
            {from.name}
          </div>
          <ArrowRightIcon className="size-5 fill-brand" />
          <img src={to.iconUrl} alt={to.name} className="size-5" />
          <div className="@max-[472px]:hidden font-medium text-label-value-15">
            {to.name}
          </div>
        </div>
      </td>
      <td
        align="right"
        className="w-0 rounded-r-lg border-divider border-t border-r border-b py-2 pr-6 text-left leading-none"
      >
        <div className="flex items-center justify-start gap-1">
          <div className="font-medium text-[13px] text-secondary leading-none">
            Volume:
          </div>
          <div className="whitespace-nowrap font-bold text-label-value-15">
            {formatCurrency(volume, 'usd')}
          </div>
        </div>
      </td>
    </tr>
  )
}
