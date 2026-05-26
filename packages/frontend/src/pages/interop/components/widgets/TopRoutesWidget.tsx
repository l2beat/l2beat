import { assert } from '@l2beat/shared-pure'
import times from 'lodash/times'
import { Skeleton } from '~/components/core/Skeleton'
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

type Flow = InteropDashboardData['flows'][number]

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
  const getChainDetails = (id: string): ChainDetails => {
    const chain = interopChains.find((c) => c.id === id)
    assert(chain, `Chain not found: ${id}`)
    return { id: chain.id, iconUrl: chain.iconUrl, name: chain.name }
  }

  const flowCount = flows?.length ?? 0
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
          {!isLoading && flowCount === 1 && flows?.[0] && (
            <SinglePairLayout
              flow={flows[0]}
              getChainDetails={getChainDetails}
            />
          )}
          {!isLoading && flowCount === 2 && flows && (
            <TwoPairsLayout flows={flows} getChainDetails={getChainDetails} />
          )}
          {!isLoading && flowCount >= 3 && flows && (
            <TopRoutesList flows={flows} getChainDetails={getChainDetails} />
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

function SinglePairLayout({
  flow,
  getChainDetails,
}: {
  flow: Flow
  getChainDetails: (id: string) => ChainDetails
}) {
  return (
    <RouteCard
      from={getChainDetails(flow.srcChain)}
      to={getChainDetails(flow.dstChain)}
      volume={flow.volume}
      transferCount={flow.transferCount}
      size="lg"
    />
  )
}

function TwoPairsLayout({
  flows,
  getChainDetails,
}: {
  flows: Flow[]
  getChainDetails: (id: string) => ChainDetails
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {flows.map((flow) => (
        <RouteCard
          key={flow.srcChain + flow.dstChain}
          from={getChainDetails(flow.srcChain)}
          to={getChainDetails(flow.dstChain)}
          volume={flow.volume}
          transferCount={flow.transferCount}
          size="md"
        />
      ))}
    </div>
  )
}

function TopRoutesList({
  flows,
  getChainDetails,
}: {
  flows: Flow[]
  getChainDetails: (id: string) => ChainDetails
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {flows.map((flow) => (
        <li key={flow.srcChain + flow.dstChain}>
          <RouteRow
            from={getChainDetails(flow.srcChain)}
            to={getChainDetails(flow.dstChain)}
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
      <img
        src={chain.iconUrl}
        alt={chain.name}
        className={cn(isLarge ? 'size-6' : 'size-5')}
      />
      {isLarge && (
        <span className="font-semibold text-label-value-15">{chain.name}</span>
      )}
    </div>
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
        <img src={from.iconUrl} alt={from.name} className="size-5" />
        <span className="@max-[465px]:hidden truncate font-medium text-label-value-15">
          {from.name}
        </span>
        <ArrowRightIcon className="size-4 fill-brand" />
        <img src={to.iconUrl} alt={to.name} className="size-5" />
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
