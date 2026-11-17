import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import type { CSSProperties } from 'react'
import { Breakdown } from '~/components/breakdown/Breakdown'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import {
  TooltipHeader,
  TooltipRow,
} from '~/components/core/tooltip/TooltipParts'
import { EM_DASH } from '~/consts/characters'
import type { TransferSizeDistribution } from '~/server/features/layer2s/interop/utils/getTransferSizeChartData'
import { cn } from '~/utils/cn'
import {
  getTransferSizeBreakdown,
  TRANSFER_SIZE_COLORS_CLASS,
} from '../utils/transferSizeBuckets'

export function InteropTransferSizeBreakdown({
  transferSize,
  inSummary = false,
}: {
  transferSize: TransferSizeDistribution | undefined
  /** In a summary card the title is a key like the stats beside it. */
  inSummary?: boolean
}) {
  const breakdownValues = getTransferSizeBreakdown(transferSize).map(
    (bucket) => ({
      value: bucket.count,
      label: bucket.label,
      style: { backgroundColor: bucket.color },
    }),
  )

  return (
    <div className={TRANSFER_SIZE_COLORS_CLASS}>
      <span
        className={cn(
          'block text-label-value-13 leading-4',
          inSummary ? 'font-normal' : 'font-semibold',
        )}
      >
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
                  <span className="font-medium text-label-value-12 leading-none">
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

function TransferSizeTooltipContent({
  breakdownValues,
  transferSize,
}: {
  breakdownValues: { value: number; style: CSSProperties; label: string }[]
  transferSize: TransferSizeDistribution | undefined
}) {
  const totalTransfers = breakdownValues.reduce((sum, v) => sum + v.value, 0)

  return (
    <div className={cn('flex flex-col gap-2', TRANSFER_SIZE_COLORS_CLASS)}>
      <TooltipHeader
        label="Identified transfers"
        value={formatInteger(totalTransfers)}
      />
      {breakdownValues.map((entry) => (
        <TooltipRow
          key={entry.label}
          gap="gap-x-6"
          indicator={<div className="size-3 rounded-xs" style={entry.style} />}
          label={entry.label}
        >
          {formatInteger(entry.value)}
        </TooltipRow>
      ))}
      <HorizontalSeparator />
      <TransferSizeStatsRows
        min={transferSize?.minTransferValueUsd}
        average={transferSize?.averageTransferSizeUsd}
        max={transferSize?.maxTransferValueUsd}
      />
    </div>
  )
}

/** The smallest, average and largest transfer, under a size breakdown. */
export function TransferSizeStatsRows(props: {
  min: number | undefined
  average: number | undefined
  max: number | undefined
}) {
  return (
    <>
      <TooltipRow gap="gap-x-6" label="Min size">
        {formatTransferSize(props.min)}
      </TooltipRow>
      <TooltipRow gap="gap-x-6" label="Average size">
        {formatTransferSize(props.average)}
      </TooltipRow>
      <TooltipRow gap="gap-x-6" label="Max size">
        {formatTransferSize(props.max)}
      </TooltipRow>
    </>
  )
}

function formatTransferSize(value: number | undefined) {
  return value !== undefined ? formatCurrency(value, 'usd') : EM_DASH
}
