import type { ProjectId } from '@l2beat/shared-pure'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
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

  const breakdownValues = [
    {
      value: data?.transferSize?.countUnder100 ?? 0,
      className: 'bg-[#567FFF]',
      label: 'Under $100',
    },
    {
      value: data?.transferSize?.count100To1K ?? 0,
      className: 'bg-[#7AE7C7]',
      label: '$100-$1K',
    },
    {
      value: data?.transferSize?.count1KTo10K ?? 0,
      className: 'bg-[#F7CB15]',
      label: '$1K-$10K',
    },
    {
      value: data?.transferSize?.count10KTo100K ?? 0,
      className: 'bg-[#503047]',
      label: '$10K-$100K',
    },
    {
      value: data?.transferSize?.countOver100K ?? 0,
      className: 'bg-[#F55D3E]',
      label: 'Over $100K',
    },
  ]

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
      <span className="font-medium text-paragraph-12 text-secondary">
        Protocol transfer size
      </span>
      <Breakdown values={breakdownValues} className="h-1.5 w-full" />
      <div className="mt-2 flex gap-2">
        {breakdownValues.map((value) => (
          <div key={value.label} className="flex items-center gap-[3px]">
            <div className={cn('size-3.5 rounded-xs', value.className)} />
            <span className="font-medium text-label-value-12 text-secondary leading-none">
              {value.label}
            </span>
          </div>
        ))}
      </div>
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
