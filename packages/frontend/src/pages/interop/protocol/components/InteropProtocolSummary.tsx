import type { ProjectId } from '@l2beat/shared-pure'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { AvgDurationCell } from '../../components/table/AvgDurationCell'
import { BridgeTypeBadge } from '../../components/table/BridgeTypeBadge'
import { TopTokensCell } from '../../components/top-items/TopTokensCell'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'

export function InteropProtocolSummary({ id }: { id: ProjectId }) {
  const { selectionForApi } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.protocol.useQuery({
    ...selectionForApi,
    id,
  })

  return (
    <section
      id="summary"
      data-role="nav-section"
      className="mt-4 w-full scroll-mt-[100vh] border-divider px-4 max-md:border-b md:rounded-lg md:bg-surface-primary md:p-6"
    >
      <div className="grid grid-cols-6 gap-3">
        <StatsItem
          title="Type"
          isLoading={isLoading}
          value={
            <div className="flex flex-wrap items-start gap-0.5">
              {data?.entry?.bridgeTypes.map((t) => (
                <BridgeTypeBadge key={t} bridgeType={t} />
              ))}
            </div>
          }
        />
        <StatsItem
          title="Last 24h volume"
          isLoading={isLoading}
          value={formatCurrency(data?.entry?.volume ?? 0, 'usd')}
        />
        <StatsItem
          title="Last 24 transfer count"
          isLoading={isLoading}
          value={formatInteger(data?.entry?.transferCount ?? 0)}
        />
        <StatsItem
          title="Last 24h avg. transfer time"
          isLoading={isLoading}
          value={
            <AvgDurationCell
              averageDuration={
                data?.entry?.averageDuration ?? {
                  type: 'unknown',
                }
              }
            />
          }
        />
        <StatsItem
          title="Last 24 avg. transfer value"
          isLoading={isLoading}
          value={formatCurrency(data?.entry?.averageValue ?? 0, 'usd')}
        />
        <StatsItem
          title="Tokens by volume"
          isLoading={isLoading}
          value={
            <TopTokensCell
              topItems={data?.entry?.tokens ?? { items: [], remainingCount: 0 }}
              type={undefined}
              protocol={{
                id: data?.entry?.id as ProjectId,
                name: data?.entry?.name ?? '',
                iconUrl: data?.entry?.iconUrl ?? '',
                bridgeTypes: data?.entry?.bridgeTypes ?? [],
              }}
            />
          }
        />
      </div>
      <HorizontalSeparator className="my-4" />
    </section>
  )
}

function StatsItem({
  title,
  value,
  isLoading,
}: {
  title: string
  value: React.ReactNode
  isLoading?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-medium text-paragraph-12 text-secondary">
        {title}
      </span>
      {isLoading ? (
        <Skeleton className="h-4 w-full" />
      ) : (
        <div className="font-bold text-label-value-16 leading-none">
          {value}
        </div>
      )}
    </div>
  )
}
