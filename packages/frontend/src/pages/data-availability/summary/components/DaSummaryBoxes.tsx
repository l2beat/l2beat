import { ProjectId } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import round from 'lodash/round'
import { Breakdown } from '~/components/breakdown/Breakdown'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChevronIcon } from '~/icons/Chevron'
import { InfoIcon } from '~/icons/Info'
import type { DaSummaryEntry } from '~/server/features/data-availability/summary/getDaSummaryEntries'
import type { ThroughputSummaryData } from '~/server/features/data-availability/throughput/getDaThroughputSummary'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatBytes } from '~/utils/number-format/formatBytes'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

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
  const ethereumValue = ethereum?.tvs.latest ?? 0
  const othersValue = others.reduce((acc, entry) => acc + entry.tvs.latest, 0)

  const ethereum7dAgo = ethereum?.tvs.sevenDaysAgo ?? 0
  const others7dAgo = others.reduce(
    (acc, entry) => acc + entry.tvs.sevenDaysAgo,
    0,
  )

  const total = ethereumValue + othersValue

  const breakdown: BreakdownItem[] = [
    {
      label: 'Ethereum',
      value: ethereumValue,
      className: 'bg-chart-ethereum',
      percentage: round((ethereumValue / total) * 100, 2),
    },
    {
      label: 'Alt-DAs',
      value: othersValue,
      className: 'bg-orange-400',
      percentage: round((othersValue / total) * 100, 2),
    },
  ]

  return (
    <PrimaryCard className="flex w-full flex-col pt-6 pb-0 md:w-1/2 md:pt-[21px] md:pb-[29px]">
      <span className="font-bold text-base leading-6! md:text-xl">
        Total Value Secured
      </span>
      <div className="mt-2.5 grid grid-cols-2 md:my-6">
        <ValueWithChange
          label="By Ethereum"
          value={formatCurrency(ethereumValue, 'usd')}
          change={calculatePercentageChange(ethereumValue, ethereum7dAgo)}
          tooltip="The sum of the Total Value Secured of all rollups listed on L2BEAT, displayed along with the percentage change compared to 7D ago."
        />
        <ValueWithChange
          label="By Alt-DAs"
          value={formatCurrency(othersValue, 'usd')}
          change={calculatePercentageChange(othersValue, others7dAgo)}
          tooltip="The sum of the Total Value Secured of all scaling solutions listed on L2BEAT that use an alternative solution for DA (other than Ethereum), displayed along with the percentage change compared to 7D ago."
        />
      </div>
      <BreakdownWithTooltip items={breakdown} />
      <div className="mt-1 flex gap-4 md:mt-2">
        {breakdown.map(({ label, className }) => (
          <BreakdownElement key={label} label={label} color={className} />
        ))}
      </div>
      <div className="mt-4 h-px w-full bg-divider md:hidden" />
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

  const total =
    latest.ethereum + latest.celestia + latest.avail + latest.eigenda

  const breakdown: BreakdownItem[] = [
    {
      label: 'Ethereum',
      value: latest.ethereum,
      className: 'bg-chart-ethereum',
      percentage: round((latest.ethereum / total) * 100, 2),
    },
    {
      label: 'Avail',
      value: latest.avail,
      className: 'bg-chart-sky',
      percentage: round((latest.avail / total) * 100, 2),
    },
    {
      label: 'Celestia',
      value: latest.celestia,
      className: 'bg-chart-fuchsia',
      percentage: round((latest.celestia / total) * 100, 2),
    },
    {
      label: 'EigenDA',
      value: latest.eigenda,
      className: 'bg-chart-lime',
      percentage: round((latest.eigenda / total) * 100, 2),
    },
  ]

  return (
    <PrimaryCard className="flex w-full flex-col pt-4 pb-6 md:w-1/2 md:pt-4">
      <div className="flex items-end gap-2">
        <span className="font-bold text-base leading-6! md:text-xl">
          Past Day Data Size
        </span>
        <a
          className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke py-1.5 pr-1.5 pl-2.5 font-bold text-[13px] text-link leading-none md:px-3 md:py-2"
          href="/data-availability/throughput"
        >
          <span className="max-md:hidden">View details</span>
          <span className="md:hidden">Details</span>
          <ChevronIcon className="-rotate-90 size-[10px] fill-current" />
        </a>
      </div>
      <div className="mt-2.5 md:mt-[25px] md:mb-6">
        <ValueWithChange
          label="Scaling projects' past day data posted to DA Layers with public APIs"
          value={formatBytes(totalPosted)}
          change={calculatePercentageChange(totalPosted, totalPosted7d)}
          tooltip="The total size of the data posted over the past day by Ethereum scaling projects to DA solutions that have provided public APIs, displayed along with the percentage change compared to 7D ago."
        />
      </div>
      <BreakdownWithTooltip items={breakdown} />
      <div className="mt-1 flex gap-4 md:mt-2">
        {breakdown.map(({ label, className }) => (
          <BreakdownElement key={label} label={label} color={className} />
        ))}
      </div>
    </PrimaryCard>
  )
}

interface BreakdownItem {
  label: string
  value: number
  className: string
  percentage: number
}

function BreakdownWithTooltip({ items }: { items: BreakdownItem[] }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Breakdown className="mt-1 h-1 w-full md:h-2" gap={0} values={items} />
      </TooltipTrigger>
      <TooltipContent className="flex flex-col gap-2">
        {items.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-between gap-5"
          >
            <div className="flex items-baseline gap-1">
              <div className={cn('size-2.5 rounded-sm', s.className)} />
              <span className="font-medium text-label-value-14">{s.label}</span>
            </div>
            <span className="font-medium text-label-value-15">
              {s.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </TooltipContent>
    </Tooltip>
  )
}

function BreakdownElement({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <div className={cn('size-2 rounded-sm', color)} />
      <span className="font-medium text-[11px] text-secondary leading-[11px]">
        {label}
      </span>
    </div>
  )
}

function ValueWithChange({
  label,
  value,
  change,
  tooltip,
}: {
  label: string
  value: string
  change: number
  tooltip: string
}) {
  return (
    <div className="flex flex-col gap-1.5 md:gap-2.5">
      <div className="flex items-center gap-1">
        <span className="font-medium text-[13px] text-secondary leading-[normal]! md:text-xs">
          {label}
        </span>
        <InfoTooltip text={tooltip} />
      </div>
      <div className="flex items-end gap-0.5 md:gap-1.5">
        <span className="whitespace-pre font-semibold text-xl [@media(min-width:1000px)]:text-3xl [@media(min-width:1000px)]:leading-[32px]!">
          {value}
        </span>
        <PercentChange
          value={change}
          className="mt-1"
          textClassName="text-xs md:text-base font-semibold"
        />
      </div>
    </div>
  )
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger className="mb-px">
        <InfoIcon className="size-3 fill-secondary" />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}
