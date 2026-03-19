import { Breakdown } from '~/components/breakdown/Breakdown'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { BetweenChainsInfo } from '../../components/BetweenChainsInfo'
import {
  INTEROP_TYPE_TO_BG_COLOR,
  TRANSFER_TYPE_DISPLAY,
} from '../../utils/display'
import type { TransferTypeBreakdown } from '../getTransferTypeBreakdown'
import { SelectedPathNoDataState } from './SelectedPathNoDataState'

interface Props {
  isLoading: boolean
  breakdown: TransferTypeBreakdown
}

export function BreakdownByTransferType({ isLoading, breakdown }: Props) {
  const hasTransfers =
    breakdown.transferCount.nonMinting +
      breakdown.transferCount.lockAndMint +
      breakdown.transferCount.burnAndMint >
    0

  return (
    <PrimaryCard className="flex flex-col border-transparent max-md:border-b max-md:border-b-divider md:border-t-4">
      <div className="flex h-[34px] shrink-0 items-center gap-2">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Breakdown by transfer type
        </h2>
      </div>
      <div className="mt-1 font-medium text-label-value-12 text-secondary md:text-label-value-14">
        Volume and count of transfers per transfer type{' '}
        <div className="inline-block">
          <BetweenChainsInfo className="lowercase" />
        </div>
      </div>

      {isLoading ? (
        <BreakdownByTransferTypeSkeleton />
      ) : hasTransfers ? (
        <div className="mt-4 flex flex-col gap-5">
          <BreakdownSection
            label="Volume"
            values={(['lockAndMint', 'burnAndMint', 'nonMinting'] as const).map(
              (key) => ({
                label: TRANSFER_TYPE_DISPLAY[key].label,
                value: breakdown.volume[key],
                formattedValue: formatCurrency(breakdown.volume[key], 'usd'),
                className: INTEROP_TYPE_TO_BG_COLOR[key],
              }),
            )}
          />
          <BreakdownSection
            label="Transfer count"
            values={(['lockAndMint', 'burnAndMint', 'nonMinting'] as const).map(
              (key) => ({
                label: TRANSFER_TYPE_DISPLAY[key].label,
                value: breakdown.transferCount[key],
                formattedValue: formatCurrency(
                  breakdown.transferCount[key],
                  'usd',
                ),
                className: INTEROP_TYPE_TO_BG_COLOR[key],
              }),
            )}
          />
        </div>
      ) : (
        <SelectedPathNoDataState className="mt-4 min-h-[191px] rounded-lg border border-divider px-4 py-5" />
      )}
    </PrimaryCard>
  )
}

function BreakdownSection({
  label,
  values,
}: {
  label: string
  values: {
    label: string
    value: number
    formattedValue: string
    className: string
  }[]
}) {
  const total = values.reduce((sum, value) => sum + value.value, 0)

  return (
    <div>
      <div className="font-medium text-label-value-12 text-secondary uppercase">
        {label}
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            <Breakdown className="mt-2! h-2 w-full" gap={0} values={values} />
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className="flex flex-col gap-1">
            {values.map((value) => (
              <div
                key={value.label}
                className="flex items-center justify-between gap-x-6"
              >
                <span className="flex items-center gap-1">
                  <div className={`size-2.5 rounded-sm ${value.className}`} />
                  <span className="font-medium text-label-value-15">
                    {value.label}
                  </span>
                </span>
                <span>
                  <span className="mr-1 font-bold text-label-value-15">
                    {value.formattedValue}
                  </span>
                  <span className="font-medium text-label-value-15 text-secondary">
                    (
                    {total === 0 ? '0.00%' : formatPercent(value.value / total)}
                    )
                  </span>
                </span>
              </div>
            ))}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {values.map((value) => (
          <div key={value.label} className="flex items-center gap-1">
            <div className={`size-2 rounded-full ${value.className}`} />
            <span className="font-medium text-label-value-12 text-secondary">
              {value.label}
            </span>
            <span className="font-bold text-label-value-12">
              {value.formattedValue}
            </span>
            <span className="hidden font-bold text-label-value-12 text-secondary md:inline">
              ({total === 0 ? '0.00%' : formatPercent(value.value / total)})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BreakdownByTransferTypeSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-5">
      {[0, 1].map((index) => (
        <div key={index}>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-2 w-full rounded-full" />
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {[0, 1, 2].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Skeleton className="size-2 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
