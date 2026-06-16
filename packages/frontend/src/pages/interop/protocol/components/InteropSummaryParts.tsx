import type { CSSProperties, ReactNode } from 'react'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { EM_DASH } from '~/consts/characters'
import type { TransferSizeDataPoint } from '~/server/features/scaling/interop/utils/getTransferSizeChartData'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import {
  INTEROP_TYPE_TO_BG_COLOR,
  TRANSFER_TYPE_DISPLAY,
} from '../../utils/display'
import { transferSizeBuckets } from '../../utils/transferSizeBuckets'

type TransferType = keyof typeof TRANSFER_TYPE_DISPLAY

export function InteropSummaryStat({
  title,
  value,
}: {
  title: string
  value: ReactNode
}) {
  return (
    <div className="flex gap-1.5 max-md:justify-between md:flex-col">
      <span className="text-nowrap font-medium text-paragraph-12 text-secondary">
        {title}
      </span>
      <div className="font-bold text-label-value-16 leading-none">{value}</div>
    </div>
  )
}

export function InteropTransferSizeBreakdown({
  transferSize,
}: {
  transferSize: TransferSizeDataPoint | undefined
}) {
  const breakdownValues = [
    {
      value: transferSize?.countUnder100 ?? 0,
      label: transferSizeBuckets.under100.label,
      style: { backgroundColor: transferSizeBuckets.under100.color },
    },
    {
      value: transferSize?.count100To1K ?? 0,
      label: transferSizeBuckets.from100To1K.label,
      style: { backgroundColor: transferSizeBuckets.from100To1K.color },
    },
    {
      value: transferSize?.count1KTo10K ?? 0,
      label: transferSizeBuckets.from1KTo10K.label,
      style: { backgroundColor: transferSizeBuckets.from1KTo10K.color },
    },
    {
      value: transferSize?.count10KTo100K ?? 0,
      label: transferSizeBuckets.from10KTo100K.label,
      style: { backgroundColor: transferSizeBuckets.from10KTo100K.color },
    },
    {
      value: transferSize?.countOver100K ?? 0,
      label: transferSizeBuckets.over100K.label,
      style: { backgroundColor: transferSizeBuckets.over100K.color },
    },
  ]

  return (
    <div>
      <span className="font-medium text-paragraph-12 text-secondary">
        Transfer size
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
            transferSize={transferSize}
          />
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export function InteropTransferTypeBreakdown({
  byType,
}: {
  /** Volume per bridge type. */
  byType: Partial<Record<TransferType, number>> | undefined
}) {
  const transferTypeBreakdownValues = (
    Object.keys(TRANSFER_TYPE_DISPLAY) as TransferType[]
  ).flatMap((transferType) => {
    const volume = byType?.[transferType]
    if (volume === undefined) return []
    return {
      value: volume,
      label: TRANSFER_TYPE_DISPLAY[transferType].label,
      className: INTEROP_TYPE_TO_BG_COLOR[transferType],
    }
  })

  return (
    <div>
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
  values: { value: number; label: string; className: string }[]
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
