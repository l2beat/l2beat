import { ProjectId } from '@l2beat/shared-pure'
import { Breakdown } from '~/components/breakdown/breakdown'
import { PercentChange } from '~/components/percent-change'
import { PrimaryCard } from '~/components/primary-card'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import { formatCurrency } from '~/utils/number-format/format-currency'

interface DaSummaryBoxesProps {
  entries: DaSummaryEntry[]
}

export function DaSummaryBoxes({ entries }: DaSummaryBoxesProps) {
  const ethereumValue =
    entries.find((entry) => entry.id === ProjectId.ETHEREUM)?.tvs ?? 0
  const othersValue = entries
    .filter((entry) => entry.id !== ProjectId.ETHEREUM)
    .reduce((acc, entry) => acc + entry.tvs, 0)

  return (
    <div className="flex max-md:flex-col md:gap-6">
      <SummaryTvsBox ethereumValue={ethereumValue} othersValue={othersValue} />
    </div>
  )
}

function SummaryTvsBox({
  ethereumValue,
  othersValue,
}: { ethereumValue: number; othersValue: number }) {
  return (
    <PrimaryCard className="flex w-full flex-col gap-6 pb-0 pt-6 md:w-1/2">
      <span className="text-base font-bold md:text-xl">
        Total Value Secured
      </span>
      <div className="grid grid-cols-2 ">
        <ValueWithChange
          label="By Ethereum"
          value={formatCurrency(ethereumValue, 'usd')}
          change={0.04}
        />
        <ValueWithChange
          label="By Alt-DAs"
          value={formatCurrency(othersValue, 'usd')}
          change={0.04}
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
          <span className="text-[11px] font-medium text-zinc-800">
            Ethereum
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <div className="size-2 rounded-sm bg-[#FF8933]" />
          <span className="text-[11px] font-medium text-zinc-800">Alt-DAs</span>
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
