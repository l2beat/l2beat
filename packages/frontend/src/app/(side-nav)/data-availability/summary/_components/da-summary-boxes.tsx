import { ProjectId } from '@l2beat/shared-pure'
import { partition } from 'lodash'
import { Breakdown } from '~/components/breakdown/breakdown'
import { PercentChange } from '~/components/percent-change'
import { PrimaryCard } from '~/components/primary-card'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/get-da-summary-entries'
import type { ThroughputSummaryData } from '~/server/features/data-availability/throughput/get-da-throughput-summary'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { cn } from '~/utils/cn'
import { formatBytes } from '~/utils/number-format/format-bytes'
import { formatCurrency } from '~/utils/number-format/format-currency'

interface DaSummaryBoxesProps {
  entries: DaSummaryEntry[]
  throughputSummaryData: ThroughputSummaryData
}

export function DaSummaryBoxes({
  entries,
  throughputSummaryData,
}: DaSummaryBoxesProps) {
  const [[ethereum], others] = partition(
    entries,
    (entry) => entry.id === ProjectId.ETHEREUM,
  )

  return (
    <div className="flex max-md:flex-col md:gap-6">
      <SummaryTvsBox ethereum={ethereum} others={others} />
      <SummaryThroughputBox throughputSummaryData={throughputSummaryData} />
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

  const breakdown = [
    { label: 'Ethereum', value: ethereumValue, className: 'bg-chart-ethereum' },
    { label: 'Alt-DAs', value: othersValue, className: 'bg-[#FF8933]' },
  ]

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
      <Breakdown className="h-1 w-full md:h-2" gap={0} values={breakdown} />
      <div className="-mt-4 flex gap-4">
        {breakdown.map(({ label, className }) => (
          <BreakdownElement key={label} label={label} color={className} />
        ))}
      </div>
      <div className="h-px w-full bg-divider md:hidden" />
    </PrimaryCard>
  )
}

function SummaryThroughputBox({
  throughputSummaryData,
}: {
  throughputSummaryData: ThroughputSummaryData
}) {
  if (!throughputSummaryData) return null

  const { latest, data7dAgo } = throughputSummaryData
  const totalPosted = Object.values(latest).reduce(
    (acc, entry) => acc + entry,
    0,
  )
  const totalPosted7d = Object.values(data7dAgo).reduce(
    (acc, entry) => acc + entry,
    0,
  )

  const breakdown = [
    {
      label: 'Ethereum',
      value: latest.ethereum ?? 0,
      className: 'bg-[hsl(var(--chart-ethereum))]',
    },
    {
      label: 'Celestia',
      value: latest.celestia ?? 0,
      className: 'bg-[hsl(var(--chart-da-celestia))]',
    },
    {
      label: 'Avail',
      value: latest.avail ?? 0,
      className: 'bg-[hsl(var(--chart-da-avail))]',
    },
  ]

  return (
    <PrimaryCard className="flex w-full flex-col gap-6 py-6 md:w-1/2">
      <span className="text-base font-bold md:text-xl">Past Day Data Size</span>
      <ValueWithChange
        label="Past day data posted to projects with public APIs"
        value={formatBytes(totalPosted)}
        change={calculatePercentageChange(totalPosted, totalPosted7d)}
      />
      <Breakdown className="h-1 w-full md:h-2" gap={0} values={breakdown} />
      <div className="-mt-4 flex gap-4">
        {breakdown.map(({ label, className }) => (
          <BreakdownElement key={label} label={label} color={className} />
        ))}
      </div>
    </PrimaryCard>
  )
}

function BreakdownElement({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <div className={cn('size-2 rounded-sm', color)} />
      <span className="text-[11px] font-medium text-secondary">{label}</span>
    </div>
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
