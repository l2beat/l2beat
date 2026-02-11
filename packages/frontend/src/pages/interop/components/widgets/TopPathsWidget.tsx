import { assert } from '@l2beat/shared-pure'
import times from 'lodash/times'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function TopPathsWidget({
  interopChains,
  isLoading,
  top3Paths,
  className,
}: {
  interopChains: InteropChainWithIcon[]
  isLoading: boolean
  top3Paths: InteropDashboardData['top3Paths'] | undefined
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
      <h2 className="font-bold text-heading-16 md:text-heading-20">
        Top 3 paths by volume
      </h2>
      <div className="mt-0.5 font-medium text-label-value-12 text-secondary md:text-label-value-14">
        Between selected chains
      </div>
      <table className="-mb-1.5 mt-0.5 w-full border-separate border-spacing-y-1.5">
        <tbody>
          {isLoading &&
            times(3).map((index) => (
              <tr key={index}>
                <td>
                  <Skeleton className="h-9.5 w-full" />
                </td>
              </tr>
            ))}
          {top3Paths?.map((path) => (
            <PathItem
              key={path.srcChain + path.dstChain}
              from={getChainDetails(path.srcChain)}
              to={getChainDetails(path.dstChain)}
              volume={path.volume}
              setPath={() => {}}
              isOnlyPath={top3Paths.length === 1}
            />
          ))}
        </tbody>
      </table>
    </PrimaryCard>
  )
}

function PathItem({
  from,
  to,
  volume,
  setPath,
  isOnlyPath,
}: {
  from: { id: string; name: string; iconUrl: string }
  to: { id: string; name: string; iconUrl: string }
  volume: number
  setPath: (paths: { from: string; to: string }) => void
  isOnlyPath: boolean
}) {
  return (
    <tr>
      <td className="rounded-l-lg border-divider border-t border-b border-l py-2 pl-2.5 leading-none">
        <div className="flex items-center gap-1.5">
          <img src={from.iconUrl} alt={from.name} className="size-5" />
          <div className="@max-[465px]:hidden font-medium text-label-value-15">
            {from.name}
          </div>
          <ArrowRightIcon className="size-5 fill-brand" />
          <img src={to.iconUrl} alt={to.name} className="size-5" />
          <div className="@max-[465px]:hidden font-medium text-label-value-15">
            {to.name}
          </div>
        </div>
      </td>
      <td className="border-divider border-t border-b py-2 pr-1 leading-none">
        <div className="flex items-center gap-1">
          <div className="font-medium text-[13px] text-secondary leading-none">
            Volume:
          </div>
          <div className="whitespace-nowrap font-bold text-label-value-15">
            {formatCurrency(volume, 'usd')}
          </div>
        </div>
      </td>
      {!isOnlyPath ? (
        <td className="rounded-r-lg border-divider border-t border-r border-b py-2 pr-1 leading-none">
          <div className="flex items-center">
            <button
              onClick={() => setPath({ from: from.id, to: to.id })}
              className="text-label-value-14 text-link underline"
            >
              View path
            </button>
          </div>
        </td>
      ) : (
        <td className="rounded-r-lg border-divider border-t border-r border-b py-2 pr-1 leading-none" />
      )}
    </tr>
  )
}
