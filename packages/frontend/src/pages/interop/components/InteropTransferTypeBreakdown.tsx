import { Breakdown } from '~/components/breakdown/Breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import {
  INTEROP_TYPE_TO_BG_COLOR,
  TRANSFER_TYPE_DISPLAY,
} from '../utils/display'

type TransferType = keyof typeof TRANSFER_TYPE_DISPLAY
export function InteropTransferTypeBreakdown({
  byType,
}: {
  byType: Partial<Record<TransferType, number>> | undefined
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
      <span className="font-medium text-paragraph-12 text-secondary">
        Transfer type distribution
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            <Breakdown values={values} className="mt-2! h-1.5 w-full" />
            <div className="mt-2 flex flex-wrap gap-2">
              {values
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
