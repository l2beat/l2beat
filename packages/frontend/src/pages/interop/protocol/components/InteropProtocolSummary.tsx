import type { ProjectId } from '@l2beat/shared-pure'
import type { CSSProperties } from 'react'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { EM_DASH } from '~/consts/characters'
import type { InteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import type { TransferSizeDataPoint } from '~/server/features/scaling/interop/utils/getTransferSizeChartData'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { AvgDurationCell } from '../../components/table/AvgDurationCell'
import { BridgeTypeBadge } from '../../components/table/BridgeTypeBadge'
import { TopTokensCell } from '../../components/top-items/TopTokensCell'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { transferSizeBuckets } from '../../utils/transferSizeBuckets'

export function InteropProtocolSummary({
  protocol,
}: {
  protocol: InteropProtocolEntry
}) {
  const { selectionForApi } = useInteropSelectedChains()
  const { data, isLoading } = api.interop.protocol.useQuery({
    ...selectionForApi,
    id: protocol.id,
  })

  const breakdownValues = [
    {
      value: data?.transferSize?.countUnder100 ?? 0,
      label: transferSizeBuckets.under100.label,
      style: { backgroundColor: transferSizeBuckets.under100.color },
    },
    {
      value: data?.transferSize?.count100To1K ?? 0,
      label: transferSizeBuckets.from100To1K.label,
      style: { backgroundColor: transferSizeBuckets.from100To1K.color },
    },
    {
      value: data?.transferSize?.count1KTo10K ?? 0,
      label: transferSizeBuckets.from1KTo10K.label,
      style: { backgroundColor: transferSizeBuckets.from1KTo10K.color },
    },
    {
      value: data?.transferSize?.count10KTo100K ?? 0,
      label: transferSizeBuckets.from10KTo100K.label,
      style: { backgroundColor: transferSizeBuckets.from10KTo100K.color },
    },
    {
      value: data?.transferSize?.countOver100K ?? 0,
      label: transferSizeBuckets.over100K.label,
      style: { backgroundColor: transferSizeBuckets.over100K.color },
    },
  ]

  return (
    <section
      id="summary"
      data-role="nav-section"
      className="mt-4 flex w-full scroll-mt-[100vh] flex-col border-divider px-4 max-md:border-b max-md:pb-6 md:rounded-lg md:bg-surface-primary md:p-6"
    >
      <div className="grid grid-cols-1 gap-x-3 max-md:gap-y-3 md:grid-cols-3">
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
        <HorizontalSeparator className="col-span-3 my-4 max-md:hidden" />
        <StatsItem
          title="Last 24h avg. transfer time"
          isLoading={isLoading}
          value={
            <AvgDurationCell
              className="font-bold text-label-value-16"
              splitClassName="flex-row text-label-value-16 font-bold"
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
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            <Breakdown
              values={breakdownValues}
              className="mt-2! h-1.5 w-full"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {breakdownValues.map((value) => (
                <div key={value.label} className="flex items-center gap-[3px]">
                  <div className="size-3.5 rounded-xs" style={value.style} />
                  <span className="font-medium text-label-value-12 text-secondary leading-none">
                    {value.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent fitContent>
          <TransferSizeTooltipContent
            breakdownValues={breakdownValues}
            transferSize={data?.transferSize}
          />
        </TooltipContent>
      </Tooltip>
      {protocol.header.description && (
        <div className="max-md:hidden">
          <HorizontalSeparator className="my-4" />
          <AboutSection description={protocol.header.description} />
        </div>
      )}
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
    <div className="flex gap-1.5 max-md:justify-between md:flex-col">
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

function TransferSizeTooltipContent({
  breakdownValues,
  transferSize,
}: {
  breakdownValues: { value: number; style: CSSProperties; label: string }[]
  transferSize: TransferSizeDataPoint | undefined
}) {
  const totalTransfers = breakdownValues.reduce((sum, v) => sum + v.value, 0)

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">
            Total transfers
          </span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatInteger(totalTransfers)} transfers
          </span>
        </div>
        {breakdownValues.map((entry) => (
          <div
            key={entry.label}
            className="flex items-center justify-between gap-x-6"
          >
            <div className="flex items-center gap-1">
              <div className="size-3 rounded-xs" style={entry.style} />
              <span className="font-medium text-label-value-14">
                {entry.label}
              </span>
            </div>
            <span className="font-medium text-label-value-15 text-primary tabular-nums">
              {formatInteger(entry.value)} transfers
            </span>
          </div>
        ))}
      </div>
      <HorizontalSeparator className="my-1.5" />
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Min size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(transferSize?.minTransferValueUsd)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Average size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(transferSize?.averageTransferSizeUsd)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-x-6">
          <span className="font-medium text-label-value-14">Max size</span>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatTransferSize(transferSize?.maxTransferValueUsd)}
          </span>
        </div>
      </div>
    </div>
  )
}

function formatTransferSize(value: number | undefined) {
  return value !== undefined ? formatCurrency(value, 'usd') : EM_DASH
}
