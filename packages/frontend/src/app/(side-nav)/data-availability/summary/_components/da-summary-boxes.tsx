import { ProjectId } from '@l2beat/shared-pure'
import { partition } from 'lodash'
import { Breakdown } from '~/components/breakdown/breakdown'
import { PercentChange } from '~/components/percent-change'
import { PrimaryCard } from '~/components/primary-card'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { formatCurrency } from '~/utils/number-format/format-currency'

interface DaSummaryBoxesProps {
  entries: DaSummaryEntry[]
}

export function DaSummaryBoxes({ entries }: DaSummaryBoxesProps) {
  const [[ethereum], others] = partition(
    entries,
    (entry) => entry.id === ProjectId.ETHEREUM,
  )

  return (
    <div className="flex max-md:flex-col md:gap-6">
      <SummaryTvsBox ethereum={ethereum} others={others} />
    </div>
  )
}

function SummaryTvsBox({
  ethereum,
  others,
}: {
  ethereum: DaSummaryEntry | undefined
  others: DaSummaryEntry[]
}) {
  const ethereumValue = ethereum?.tvs.latestTvs ?? 0
  const othersValue = others.reduce(
    (acc, entry) => acc + entry.tvs.latestTvs,
    0,
  )

  const ethereum7dAgo = ethereum?.tvs.tvs7d ?? 0
  const others7dAgo = others.reduce((acc, entry) => acc + entry.tvs.tvs7d, 0)

  return (
    <PrimaryCard className="flex w-full flex-col gap-6 pb-0 pt-6 md:w-1/2">
      <span className="text-base font-bold md:text-xl">
        Total Value Secured
      </span>
      <div className="grid grid-cols-2 ">
        <ValueWithChange
          label="By Ethereum"
          value={formatCurrency(ethereumValue, 'usd')}
          change={calculatePercentageChange(ethereumValue, ethereum7dAgo)}
        />
        <ValueWithChange
          label="By Alt-DAs"
          value={formatCurrency(othersValue, 'usd')}
          change={calculatePercentageChange(othersValue, others7dAgo)}
        />
      </div>
      <Breakdown
        className="h-1 w-full md:h-2"
        gap={0}
        values={[
          { value: ethereumValue, className: 'bg-chart-ethereum' },
          { value: othersValue, className: 'bg-[#FF8933]' },
        ]}
      />
      <div className="-mt-4 flex gap-4">
        <div className="flex items-baseline gap-1">
          <div className="size-2 rounded-sm bg-chart-ethereum" />
          <span className="text-[11px] font-medium text-secondary">
            Ethereum
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <div className="size-2 rounded-sm bg-[#FF8933]" />
          <span className="text-[11px] font-medium text-secondary">
            Alt-DAs
          </span>
        </div>
      </div>
      <div className="h-px w-full bg-divider md:hidden" />
    </PrimaryCard>
  )
}

function ValueWithChange({
  label,
  value,
  change,
}: { label: string; value: string; change: number }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] font-medium text-secondary md:text-xs">
        {label}
      </span>
      <div className="flex items-end gap-1.5">
        <span className="text-xl font-semibold [@media(min-width:1000px)]:text-3xl">
          {value}
        </span>
        <PercentChange
          value={change}
          textClassName="text-xs md:text-base font-semibold"
        />
      </div>
    </div>
  )
}
