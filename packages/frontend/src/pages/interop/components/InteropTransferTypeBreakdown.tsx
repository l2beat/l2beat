import { formatCurrency } from '@l2beat/shared-pure'
import { Breakdown } from '~/components/breakdown/Breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { TransferTypeDataPoint } from '~/server/features/layer2s/interop/utils/getTransferSizeChartData'
import { cn } from '~/utils/cn'
import {
  INTEROP_TYPE_TO_BG_COLOR,
  TRANSFER_TYPE_DISPLAY,
} from '../utils/display'

type TransferType = keyof typeof TRANSFER_TYPE_DISPLAY

export function InteropTransferTypeBreakdown({
  byType,
  inSummary = false,
}: {
  byType: TransferTypeDataPoint | undefined
  /** In a summary card the title is a key like the stats beside it. */
  inSummary?: boolean
}) {
  const values = (Object.keys(TRANSFER_TYPE_DISPLAY) as TransferType[]).flatMap(
    (transferType) => {
      const volume = byType?.[transferType]
      if (volume === undefined) return []
      return {
        value: volume,
        label: TRANSFER_TYPE_DISPLAY[transferType].label,
        className: INTEROP_TYPE_TO_BG_COLOR[transferType],
      }
    },
  )

  return (
    <div>
      <span
        className={cn(
          'text-label-value-13 leading-4',
          inSummary ? 'font-normal' : 'font-semibold',
        )}
      >
        Transfer type distribution
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            <Breakdown
              values={values}
              className={cn('h-1.5 w-full', inSummary ? 'mt-3!' : 'mt-2!')}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {values
                .filter((value) => value.value > 0)
                .map((value) => (
                  <div
                    key={value.label}
                    className="flex items-center gap-[3px]"
                  >
                    <div className={`size-3.5 rounded-xs ${value.className}`} />
                    <span className="font-medium text-label-value-12 leading-none">
                      {value.label}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent fitContent>
          <TransferTypeTooltipContent values={values} />
        </TooltipContent>
      </Tooltip>
    </div>
  )
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
