import { formatSeconds } from '@l2beat/shared-pure'
import { useState } from 'react'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { Skeleton } from '~/components/core/Skeleton'
import { TrendArrowIcon } from '~/icons/TrendArrow'
import type { TokenFrameworksData } from '~/server/features/scaling/interop/getTokenFrameworksData'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import type { InteropTokenFramework } from '../getInteropTokenFrameworksData'

type CompareMetric = {
  key: 'volume' | 'transfers' | 'time' | 'size'
  label: string
  lowerIsBetter?: boolean
  getValue: (entry: ComparableEntry) => number | null
  format: (value: number | null) => string
}

type ComparableEntry = {
  volume: number
  transferCount: number
  averageDurationSeconds: number | null
  averageValue: number | null
}

const METRICS: CompareMetric[] = [
  {
    key: 'volume',
    label: 'Volume',
    getValue: (e) => e.volume,
    format: (v) => (v === null ? '$ —' : formatCurrency(v, 'usd')),
  },
  {
    key: 'transfers',
    label: 'Transfers',
    getValue: (e) => e.transferCount,
    format: (v) => (v === null ? '—' : formatInteger(v)),
  },
  {
    key: 'time',
    label: 'Avg. transfer time',
    lowerIsBetter: true,
    getValue: (e) => e.averageDurationSeconds,
    format: (v) => (v === null ? '—' : formatSeconds(v)),
  },
  {
    key: 'size',
    label: 'Avg. transfer size',
    getValue: (e) => e.averageValue,
    format: (v) => (v === null ? '$ —' : formatCurrency(v, 'usd')),
  },
]

export function FrameworkCompareContent({
  tokenFrameworks,
  frameworkDominance,
  isLoading,
}: {
  tokenFrameworks: InteropTokenFramework[]
  frameworkDominance: TokenFrameworksData['frameworkDominance'] | undefined
  isLoading: boolean
}) {
  const [leftId, setLeftId] = useState<string | undefined>()
  const [rightId, setRightId] = useState<string | undefined>()

  const entriesById = new Map<string, ComparableEntry>()
  if (frameworkDominance) {
    for (const e of frameworkDominance.volume.entries) {
      entriesById.set(e.id, e)
    }
  }

  const leftFramework = leftId
    ? tokenFrameworks.find((f) => f.id === leftId)
    : undefined
  const rightFramework = rightId
    ? tokenFrameworks.find((f) => f.id === rightId)
    : undefined

  const leftEntry = leftId ? entriesById.get(leftId) : undefined
  const rightEntry = rightId ? entriesById.get(rightId) : undefined

  return (
    <div>
      <h2 className="font-bold text-heading-20">Frameworks Head-to-Head</h2>
      <p className="mt-1 font-medium text-secondary text-xs leading-[1.2]">
        Select two frameworks & view head-to-head comparison
      </p>
      <HorizontalSeparator className="my-6" />
      <div className="flex items-center gap-5">
        <FrameworkSelect
          frameworks={tokenFrameworks}
          value={leftId}
          onChange={setLeftId}
          excludeId={rightId}
        />
        <span className="font-semibold text-base text-secondary">vs.</span>
        <FrameworkSelect
          frameworks={tokenFrameworks}
          value={rightId}
          onChange={setRightId}
          excludeId={leftId}
        />
      </div>

      <div className="mt-6 flex flex-col gap-5">
        {METRICS.map((metric) => (
          <CompareRow
            key={metric.key}
            metric={metric}
            left={
              leftFramework && leftEntry
                ? { framework: leftFramework, entry: leftEntry }
                : undefined
            }
            right={
              rightFramework && rightEntry
                ? { framework: rightFramework, entry: rightEntry }
                : undefined
            }
            isLoading={isLoading && (!!leftId || !!rightId)}
          />
        ))}
      </div>
    </div>
  )
}

function FrameworkSelect({
  frameworks,
  value,
  onChange,
  excludeId,
}: {
  frameworks: InteropTokenFramework[]
  value: string | undefined
  onChange: (id: string) => void
  excludeId: string | undefined
}) {
  const selected = value ? frameworks.find((f) => f.id === value) : undefined
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 flex-1 border border-divider bg-surface-primary">
        <SelectValue placeholder="Select project">
          {selected && (
            <span className="flex items-center gap-2">
              <img
                src={selected.iconUrl}
                alt={selected.name}
                className="size-5 rounded-full"
              />
              <span className="font-bold">{selected.label}</span>
              <span className="font-medium text-secondary">
                {selected.name}
              </span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {frameworks.map((framework) => (
          <SelectItem
            key={framework.id}
            value={framework.id}
            disabled={framework.id === excludeId}
          >
            <span className="flex items-center gap-2">
              <img
                src={framework.iconUrl}
                alt={framework.name}
                className="size-5 rounded-full"
              />
              <span className="font-bold">{framework.label}</span>
              <span className="font-medium text-secondary">
                {framework.name}
              </span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type Side = {
  framework: InteropTokenFramework
  entry: ComparableEntry
}

function CompareRow({
  metric,
  left,
  right,
  isLoading,
}: {
  metric: CompareMetric
  left: Side | undefined
  right: Side | undefined
  isLoading: boolean
}) {
  const leftValue = left ? metric.getValue(left.entry) : null
  const rightValue = right ? metric.getValue(right.entry) : null

  const leader = getLeader(leftValue, rightValue, metric.lowerIsBetter)
  const { leftFill, rightFill } = getFills(
    leftValue,
    rightValue,
    metric.lowerIsBetter,
  )

  const leftColor = left?.framework.color
  const rightColor = right?.framework.color

  const leadingFramework =
    leader === 'left'
      ? left?.framework
      : leader === 'right'
        ? right?.framework
        : undefined

  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-3 items-baseline gap-3">
        <span
          className={cn('font-bold text-heading-16', !left && 'text-secondary')}
          style={leftColor ? { color: leftColor } : undefined}
        >
          {metric.format(leftValue)}
        </span>
        <span className="text-center font-semibold text-base text-secondary leading-none">
          {metric.label}
        </span>
        <span
          className={cn(
            'text-right font-bold text-heading-16',
            !right && 'text-secondary',
          )}
          style={rightColor ? { color: rightColor } : undefined}
        >
          {metric.format(rightValue)}
        </span>
      </div>

      {isLoading ? (
        <Skeleton className="h-1.5 w-full" />
      ) : (
        <CompareBar
          leftFill={leftFill}
          rightFill={rightFill}
          leftColor={leftColor}
          rightColor={rightColor}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        {leader === 'left' && leadingFramework ? (
          <LeadsIndicator
            label={`${leadingFramework.label} leads`}
            color={leftColor}
            align="left"
          />
        ) : (
          <span />
        )}
        {leader === 'right' && leadingFramework ? (
          <LeadsIndicator
            label={`${leadingFramework.label} leads`}
            color={rightColor}
            align="right"
          />
        ) : (
          <span />
        )}
      </div>
    </div>
  )
}

function CompareBar({
  leftFill,
  rightFill,
  leftColor,
  rightColor,
}: {
  leftFill: number
  rightFill: number
  leftColor: string | undefined
  rightColor: string | undefined
}) {
  return (
    <div className="flex h-1.5 w-full items-center gap-0.5">
      <div className="flex h-full flex-1 justify-end overflow-hidden rounded-l-full bg-surface-secondary">
        <div
          className="h-full rounded-l-full"
          style={{
            width: `${leftFill * 100}%`,
            backgroundColor: leftColor,
          }}
        />
      </div>
      <div className="flex h-full flex-1 overflow-hidden rounded-r-full bg-surface-secondary">
        <div
          className="h-full rounded-r-full"
          style={{
            width: `${rightFill * 100}%`,
            backgroundColor: rightColor,
          }}
        />
      </div>
    </div>
  )
}

function LeadsIndicator({
  label,
  color,
  align,
}: {
  label: string
  color: string | undefined
  align: 'left' | 'right'
}) {
  return (
    <span
      className={cn(
        'flex items-center gap-1 font-medium text-2xs',
        align === 'right' && 'justify-self-end',
      )}
      style={{ color }}
    >
      <TrendArrowIcon fill={color} />
      {label}
    </span>
  )
}

function getLeader(
  leftValue: number | null,
  rightValue: number | null,
  lowerIsBetter: boolean | undefined,
): 'left' | 'right' | undefined {
  if (leftValue === null || rightValue === null) return undefined
  if (leftValue === rightValue) return undefined
  const leftWins = lowerIsBetter
    ? leftValue < rightValue
    : leftValue > rightValue
  return leftWins ? 'left' : 'right'
}

function getFills(
  leftValue: number | null,
  rightValue: number | null,
  lowerIsBetter: boolean | undefined,
): { leftFill: number; rightFill: number } {
  if (leftValue === null || rightValue === null) {
    return { leftFill: 0, rightFill: 0 }
  }
  let leftProp: number
  let rightProp: number
  if (lowerIsBetter) {
    if (leftValue <= 0 && rightValue <= 0) return { leftFill: 0, rightFill: 0 }
    if (leftValue <= 0) return { leftFill: 1, rightFill: 0 }
    if (rightValue <= 0) return { leftFill: 0, rightFill: 1 }
    leftProp = 1 / leftValue
    rightProp = 1 / rightValue
  } else {
    leftProp = leftValue
    rightProp = rightValue
  }
  const total = leftProp + rightProp
  if (total <= 0) return { leftFill: 0, rightFill: 0 }
  return { leftFill: leftProp / total, rightFill: rightProp / total }
}
