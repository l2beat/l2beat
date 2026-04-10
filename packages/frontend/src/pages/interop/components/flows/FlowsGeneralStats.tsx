import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useInteropFlows } from './utils/InteropFlowsContext'

export function FlowsGeneralStats() {
  const { selectedChains, allChains } = useInteropFlows()

  const { data, isLoading } = api.interop.flows.useQuery({
    chains: selectedChains,
  })

  const topRoute = data?.stats.topRoute
  const srcChain = topRoute
    ? allChains.find((c) => c.id === topRoute.srcChain)
    : undefined
  const dstChain = topRoute
    ? allChains.find((c) => c.id === topRoute.dstChain)
    : undefined

  return (
    <div className="flex h-full flex-col rounded-lg bg-surface-secondary p-4">
      <div className="font-bold text-heading-20">General stats</div>
      <div className="mt-1 font-medium text-label-value-14 text-secondary">
        For past 24h between the selected chains and protocols
      </div>
      <div className="mt-1.5 space-y-2">
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
        <HorizontalSeparator className="my-4" />
        <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-divider bg-surface-primary px-4 py-2">
          <span className="font-medium text-label-value-14 text-secondary">
            Top route
          </span>
          {isLoading ? (
            <Skeleton className="h-6 w-20" />
          ) : srcChain && dstChain ? (
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
            <div className="font-bold text-heading-20">-</div>
          )}
        </div>
      </div>
    </div>
  )
}

function Card({
  title,
  value,
  isLoading,
}: {
  title: string
  value: string
  isLoading: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-divider bg-surface-primary px-4 py-2">
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
