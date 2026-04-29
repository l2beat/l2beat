import type { CSSProperties, ReactNode } from 'react'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { AboutSection } from '~/components/projects/sections/AboutSection'
import { EM_DASH } from '~/consts/characters'
import { BidirectionalArrowIcon } from '~/icons/BidirectionalArrow'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import type { TransferSizeDataPoint } from '~/server/features/scaling/interop/utils/getTransferSizeChartData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { InteropNoDataBadge } from '../../components/InteropNoDataBadge'
import { AvgDurationCell } from '../../components/table/AvgDurationCell'
import { TopTokensCell } from '../../components/tokens/TopTokensCell'
import {
  INTEROP_TYPE_TO_BG_COLOR,
  TRANSFER_TYPE_DISPLAY,
} from '../../utils/display'
import { transferSizeBuckets } from '../../utils/transferSizeBuckets'
import type { InteropSelection } from '../../utils/types'

type TransferType = keyof typeof TRANSFER_TYPE_DISPLAY

export function InteropProtocolSummary({
  protocol,
  apiSelection,
  protocolData,
}: {
  protocol: InteropProtocolEntry
  apiSelection: InteropSelection
  protocolData: InteropProtocolDashboardData
}) {
  const breakdownValues = [
    {
      value: protocolData?.transferSize?.countUnder100 ?? 0,
      label: transferSizeBuckets.under100.label,
      style: { backgroundColor: transferSizeBuckets.under100.color },
    },
    {
      value: protocolData?.transferSize?.count100To1K ?? 0,
      label: transferSizeBuckets.from100To1K.label,
      style: { backgroundColor: transferSizeBuckets.from100To1K.color },
    },
    {
      value: protocolData?.transferSize?.count1KTo10K ?? 0,
      label: transferSizeBuckets.from1KTo10K.label,
      style: { backgroundColor: transferSizeBuckets.from1KTo10K.color },
    },
    {
      value: protocolData?.transferSize?.count10KTo100K ?? 0,
      label: transferSizeBuckets.from10KTo100K.label,
      style: { backgroundColor: transferSizeBuckets.from10KTo100K.color },
    },
    {
      value: protocolData?.transferSize?.countOver100K ?? 0,
      label: transferSizeBuckets.over100K.label,
      style: { backgroundColor: transferSizeBuckets.over100K.color },
    },
  ]
  const byBridgeType = protocolData?.entry?.byBridgeType
  const transferTypeBreakdownValues = Object.keys(byBridgeType ?? {}).flatMap(
    (type) => {
      const transferType = type as TransferType
      const stats = byBridgeType?.[transferType]
      if (!stats) return []

      return {
        value: stats.volume,
        label: TRANSFER_TYPE_DISPLAY[transferType].label,
        className: INTEROP_TYPE_TO_BG_COLOR[transferType],
      }
    },
  )

  return (
    <section
      id="summary"
      data-role="nav-section"
      className="mt-4 flex w-full scroll-mt-[100vh] flex-col border-divider px-4 max-md:border-b max-md:pb-6 md:rounded-lg md:bg-surface-primary md:p-6"
    >
      <div className="grid grid-cols-1 gap-x-3 max-md:gap-y-3 md:grid-cols-3">
        <StatsItem
          title="Last 24h volume"
          value={
            protocolData?.entry?.volume
              ? formatCurrency(protocolData.entry.volume, 'usd')
              : EM_DASH
          }
        />
        <StatsItem
          title="Last 24h transfer count"
          value={formatInteger(protocolData?.entry?.transferCount ?? 0)}
        />
        <StatsItem
          title="Last 24h top path"
          value={
            protocolData?.topPath ? (
              <TopPathValue path={protocolData.topPath} />
            ) : (
              EM_DASH
            )
          }
        />
        <HorizontalSeparator className="col-span-3 my-4 max-md:hidden" />
        <StatsItem
          title="Last 24h avg. transfer time"
          value={
            protocolData?.entry?.averageDuration ? (
              <AvgDurationCell
                className="font-bold text-label-value-16"
                splitClassName="flex-row text-label-value-16 font-bold"
                averageDuration={protocolData?.entry?.averageDuration}
              />
            ) : (
              <InteropNoDataBadge size="extraSmall" />
            )
          }
        />
        <StatsItem
          title="Last 24 avg. transfer value"
          value={
            protocolData?.entry?.averageValue
              ? formatCurrency(protocolData.entry.averageValue, 'usd')
              : EM_DASH
          }
        />
        <StatsItem
          title="Tokens by volume"
          value={
            <TopTokensCell
              topItems={
                protocolData?.entry?.tokens ?? { items: [], remainingCount: 0 }
              }
              type={undefined}
              apiSelection={apiSelection}
              protocol={{
                id: protocol.id,
                name: protocolData?.entry?.name ?? '',
                iconUrl: protocolData?.entry?.iconUrl ?? '',
                bridgeTypes: protocolData?.entry?.bridgeTypes ?? [],
              }}
              hideChainsInfo
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
            transferSize={protocolData?.transferSize}
          />
        </TooltipContent>
      </Tooltip>
      <HorizontalSeparator className="my-4" />
      <span className="font-medium text-paragraph-12 text-secondary">
        Transfer type distribution
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            <Breakdown
              values={transferTypeBreakdownValues}
              className="mt-2! h-1.5 w-full"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {transferTypeBreakdownValues
                .filter((value) => value.value > 0)
                .map((value) => (
                  <div
                    key={value.label}
                    className="flex items-center gap-[3px]"
                  >
                    <div className={`size-3.5 rounded-xs ${value.className}`} />
                    <span className="font-medium text-label-value-12 text-secondary leading-none">
                      {value.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent fitContent>
          <TransferTypeTooltipContent values={transferTypeBreakdownValues} />
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

function TopPathValue({
  path,
}: {
  path: { chainA: string; chainB: string; volume: number }
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-label-value-16">
      <span className="capitalize">{path.chainA}</span>
      <BidirectionalArrowIcon className="size-4 fill-brand" />
      <span className="capitalize">{path.chainB}</span>
      <span className="text-secondary">
        {formatCurrency(path.volume, 'usd')}
      </span>
    </div>
  )
}

function StatsItem({ title, value }: { title: string; value: ReactNode }) {
  return (
    <div className="flex gap-1.5 max-md:justify-between md:flex-col">
      <span className="font-medium text-paragraph-12 text-secondary">
        {title}
      </span>
      <div className="font-bold text-label-value-16 leading-none">{value}</div>
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
            Total identified transfers
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

function TransferTypeTooltipContent({
  values,
}: {
  values: {
    value: number
    label: string
    className: string
  }[]
}) {
  const totalVolume = values.reduce((sum, v) => sum + v.value, 0)

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between gap-x-6">
        <span className="font-medium text-label-value-14">Total volume</span>
        <span className="font-medium text-label-value-15 text-primary tabular-nums">
          {formatCurrency(totalVolume, 'usd')}
        </span>
      </div>
      {values.map((entry) => (
        <div
          key={entry.label}
          className="flex items-center justify-between gap-x-6"
        >
          <div className="flex items-center gap-1">
            <div className={`size-3 rounded-xs ${entry.className}`} />
            <span className="font-medium text-label-value-14">
              {entry.label}
            </span>
          </div>
          <span className="font-medium text-label-value-15 text-primary tabular-nums">
            {formatCurrency(entry.value, 'usd')}
          </span>
        </div>
      ))}
    </div>
  )
}
