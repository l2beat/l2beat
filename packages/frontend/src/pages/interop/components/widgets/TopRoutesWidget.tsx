import { assert } from '@l2beat/shared-pure'
import times from 'lodash/times'
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
import { formatInteger } from '~/utils/number-format/formatInteger'

type ChainDetails = {
  id: string
  iconUrl: string
  name: string
}

type EnrichedFlow = {
  from: ChainDetails
  to: ChainDetails
  volume: number
  transferCount: number | undefined
}

export function TopRoutesWidget({
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
  const enrichedFlows = flows?.map((flow): EnrichedFlow => {
    const from = interopChains.find((c) => c.id === flow.srcChain)
    const to = interopChains.find((c) => c.id === flow.dstChain)
    assert(from, `Chain not found: ${flow.srcChain}`)
    assert(to, `Chain not found: ${flow.dstChain}`)
    return {
      from: { id: from.id, iconUrl: from.iconUrl, name: from.name },
      to: { id: to.id, iconUrl: to.iconUrl, name: to.name },
      volume: flow.volume,
      transferCount: flow.transferCount,
    }
  })

  const flowCount = enrichedFlows?.length ?? 0
  const subtitle = flowCount > 2 ? 'Top routes by volume' : 'Flows by volume'

  return (
    <PrimaryCard
      className={cn(
        '@container h-full border-divider max-md:border-b',
        className,
      )}
    >
      <div className="flex h-full flex-col">
        <h2 className="font-bold text-heading-16 md:text-heading-20">
          Last 24 hours
        </h2>
        <div className="mt-1 font-medium text-label-value-12 text-secondary md:text-label-value-14">
          {subtitle}
        </div>
        <div className="mt-3 flex-1 md:mt-4">
          {isLoading && <LoadingState flowCount={2} />}
          {!isLoading && flowCount === 0 && <EmptyState />}
          {!isLoading && enrichedFlows && flowCount > 0 && flowCount <= 2 && (
            <div
              className={cn(
                'grid h-full gap-3',
                flowCount === 2 && 'grid-cols-2',
              )}
            >
              {enrichedFlows.map((flow) => (
                <RouteCard
                  key={flow.from.id + flow.to.id}
                  from={flow.from}
                  to={flow.to}
                  volume={flow.volume}
                  transferCount={flow.transferCount}
                  size={flowCount === 1 ? 'lg' : 'md'}
                />
              ))}
            </div>
          )}
          {!isLoading && enrichedFlows && flowCount >= 3 && (
            <TopRoutesList flows={enrichedFlows} />
          )}
        </div>
      </div>
    </PrimaryCard>
  )
}

function EmptyState() {
  return (
    <div className="flex h-full items-center justify-center font-medium text-label-value-14 text-secondary">
      No routes match the current selection.
    </div>
  )
}

function LoadingState({ flowCount }: { flowCount: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {times(flowCount).map((index) => (
        <Skeleton key={index} className="h-[110px] w-full" />
      ))}
    </div>
  )
}

function TopRoutesList({ flows }: { flows: EnrichedFlow[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {flows.map((flow) => (
        <li key={flow.from.id + flow.to.id}>
          <RouteRow
            from={flow.from}
            to={flow.to}
            volume={flow.volume}
            transferCount={flow.transferCount}
          />
        </li>
      ))}
    </ul>
  )
}

function RouteCard({
  from,
  to,
  volume,
  transferCount,
  size,
}: {
  from: ChainDetails
  to: ChainDetails
  volume: number
  transferCount: number | undefined
  size: 'md' | 'lg'
}) {
  const isLarge = size === 'lg'

  return (
    <div
      className={cn(
        'flex h-full flex-col items-center justify-center rounded-lg border border-divider px-4',
        isLarge ? 'gap-3 py-6' : 'py-3 md:py-4',
      )}
    >
      <div className={cn('flex items-center gap-2', isLarge && 'gap-3')}>
        <ChainBadge chain={from} isLarge={isLarge} />
        <ArrowRightIcon
          className={cn('fill-brand', isLarge ? 'size-6' : 'size-5')}
        />
        <ChainBadge chain={to} isLarge={isLarge} />
      </div>
      <div
        className={cn(
          'mt-2 flex flex-col items-center',
          isLarge && 'mt-3 gap-0.5',
        )}
      >
        <span className="font-medium text-label-value-12 text-secondary md:text-label-value-14">
          Volume
        </span>
        <div
          className={cn(
            'font-bold',
            isLarge ? 'text-heading-32' : 'text-heading-20 md:text-heading-24',
          )}
        >
          {formatCurrency(volume, 'usd')}
        </div>
        {transferCount !== undefined && (
          <div className="font-medium text-label-value-13 text-secondary md:text-label-value-14">
            {formatInteger(transferCount)} transfers
          </div>
        )}
      </div>
    </div>
  )
}

function ChainBadge({
  chain,
  isLarge,
}: {
  chain: ChainDetails
  isLarge: boolean
}) {
  return (
    <div className="flex items-center gap-1.5">
      <ChainIconWithTooltip
        chain={chain}
        className={cn(isLarge ? 'size-6' : 'size-5')}
      />
      {isLarge && (
        <span className="font-semibold text-label-value-15">{chain.name}</span>
      )}
    </div>
  )
}

function ChainIconWithTooltip({
  chain,
  className,
}: {
  chain: ChainDetails
  className?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <img src={chain.iconUrl} alt={chain.name} className={className} />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent fitContent>{chain.name}</TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}

function RouteRow({
  from,
  to,
  volume,
  transferCount,
}: {
  from: ChainDetails
  to: ChainDetails
  volume: number
  transferCount: number | undefined
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-divider px-3 py-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <ChainIconWithTooltip chain={from} className="size-5" />
        <span className="@max-[465px]:hidden truncate font-medium text-label-value-15">
          {from.name}
        </span>
        <ArrowRightIcon className="size-4 fill-brand" />
        <ChainIconWithTooltip chain={to} className="size-5" />
        <span className="@max-[465px]:hidden truncate font-medium text-label-value-15">
          {to.name}
        </span>
      </div>
      <div className="flex shrink-0 flex-col items-end">
        <span className="whitespace-nowrap font-bold text-label-value-15">
          {formatCurrency(volume, 'usd')}
        </span>
        {transferCount !== undefined && (
          <span className="whitespace-nowrap font-medium text-label-value-12 text-secondary">
            {formatInteger(transferCount)} transfers
          </span>
        )}
      </div>
    </div>
  )
}
