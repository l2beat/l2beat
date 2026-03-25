import { Breakdown } from '~/components/breakdown/Breakdown'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EmptyStateIcon } from '~/icons/EmptyState'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { BetweenChainsInfo } from '../../components/BetweenChainsInfo'
import {
  INTEROP_TYPE_TO_BG_COLOR,
  TRANSFER_TYPE_DISPLAY,
} from '../../utils/display'
import type { TransferTypeBreakdown } from '../utils/getTransferTypeBreakdown'

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
        <BetweenChainsInfo className="inline-flex lowercase" />
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
      <Breakdown className="mt-2! h-2 w-full" gap={0} values={values} />
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
            <span className="font-bold text-label-value-12 text-secondary">
              ({formatPercent(total === 0 ? total : value.value / total)})
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
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      ))}
    </div>
  )
}

function SelectedPathNoDataState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        className,
      )}
    >
      <EmptyStateIcon className="mb-4 size-10 fill-yellow-700 dark:fill-yellow-200" />
      <span className="mb-2 font-bold text-heading-20">
        No data for the selected path
      </span>
      <span className="text-balance text-paragraph-14 text-secondary">
        We couldn&apos;t find data for this path. Select another route or adjust
        your filters.
      </span>
    </div>
  )
}
