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

type ComparableEntry = {
  volume: number
  transferCount: number
  averageDurationSeconds: number | null
  averageValue: number | null
}

type Side = {
  framework: InteropTokenFramework
  entry: ComparableEntry
}

export function FrameworkCompareContent({
  tokenFrameworks,
  frameworkDominance,
  isLoading,
}: {
  tokenFrameworks: InteropTokenFramework[]
  frameworkDominance: TokenFrameworksData['frameworkDominance'] | undefined
  isLoading: boolean
}) {
  const [leftId, setLeftId] = useState<string>()
  const [rightId, setRightId] = useState<string>()

  const getSide = (id: string | undefined): Side | undefined => {
    const framework = tokenFrameworks.find((f) => f.id === id)
    const entry = frameworkDominance?.volume.entries.find((e) => e.id === id)
    return framework && entry ? { framework, entry } : undefined
  }

  const left = getSide(leftId)
  const right = getSide(rightId)
  const showSkeleton = isLoading && (!!leftId || !!rightId)

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
        <CompareRow
          label="Volume"
          left={left}
          right={right}
          leftValue={left?.entry.volume ?? null}
          rightValue={right?.entry.volume ?? null}
          format={(v) => formatCurrency(v, 'usd')}
          isLoading={showSkeleton}
        />
        <CompareRow
          label="Transfers"
          left={left}
          right={right}
          leftValue={left?.entry.transferCount ?? null}
          rightValue={right?.entry.transferCount ?? null}
          format={formatInteger}
          isLoading={showSkeleton}
        />
        <CompareRow
          label="Avg. transfer time"
          left={left}
          right={right}
          leftValue={left?.entry.averageDurationSeconds ?? null}
          rightValue={right?.entry.averageDurationSeconds ?? null}
          format={formatSeconds}
          lowerIsBetter
          isLoading={showSkeleton}
        />
        <CompareRow
          label="Avg. transfer size"
          left={left}
          right={right}
          leftValue={left?.entry.averageValue ?? null}
          rightValue={right?.entry.averageValue ?? null}
          format={(v) => formatCurrency(v, 'usd')}
          isLoading={showSkeleton}
        />
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
  const selected = frameworks.find((f) => f.id === value)
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 flex-1 border border-divider bg-surface-primary">
        <SelectValue placeholder="Select project">
          {selected && <FrameworkLabel framework={selected} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {frameworks.map((framework) => (
          <SelectItem
            key={framework.id}
            value={framework.id}
            disabled={framework.id === excludeId}
          >
            <FrameworkLabel framework={framework} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function FrameworkLabel({ framework }: { framework: InteropTokenFramework }) {
  return (
    <span className="flex items-center gap-2">
      <img
        src={framework.iconUrl}
        alt={framework.name}
        className="size-5 rounded-full"
      />
      <span className="font-bold">{framework.label}</span>
      <span className="font-medium text-secondary">{framework.name}</span>
    </span>
  )
}

function CompareRow({
  label,
  left,
  right,
  leftValue,
  rightValue,
  format,
  lowerIsBetter,
  isLoading,
}: {
  label: string
  left: Side | undefined
  right: Side | undefined
  leftValue: number | null
  rightValue: number | null
  format: (v: number) => string
  lowerIsBetter?: boolean
  isLoading: boolean
}) {
  const { leader, leftFill, rightFill } = compare(
    leftValue,
    rightValue,
    lowerIsBetter,
  )

  return (
    <div className="flex flex-col gap-1.5">
      <div className="grid grid-cols-3 items-baseline gap-3">
        <span
          className={cn('font-bold text-heading-16', !left && 'text-secondary')}
          style={{ color: left?.framework.color }}
        >
          {leftValue ? format(leftValue) : '—'}
        </span>
        <span className="text-center font-semibold text-base text-secondary leading-none">
          {label}
        </span>
        <span
          className={cn(
            'text-right font-bold text-heading-16',
            !right && 'text-secondary',
          )}
          style={{ color: right?.framework.color }}
        >
          {rightValue ? format(rightValue) : '—'}
        </span>
      </div>

      {isLoading ? (
        <Skeleton className="h-1.5 w-full" />
      ) : (
        <CompareBar
          leftFill={leftFill}
          rightFill={rightFill}
          leftColor={left?.framework.color}
          rightColor={right?.framework.color}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <LeadsIndicator
          side={leader === 'left' ? left : undefined}
          align="left"
        />
        <LeadsIndicator
          side={leader === 'right' ? right : undefined}
          align="right"
        />
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
          style={{ width: `${leftFill * 100}%`, backgroundColor: leftColor }}
        />
      </div>
      <div className="flex h-full flex-1 overflow-hidden rounded-r-full bg-surface-secondary">
        <div
          className="h-full rounded-r-full"
          style={{ width: `${rightFill * 100}%`, backgroundColor: rightColor }}
        />
      </div>
    </div>
  )
}

function LeadsIndicator({
  side,
  align,
}: {
  side: Side | undefined
  align: 'left' | 'right'
}) {
  if (!side) return <span />
  const { color, label } = side.framework
  return (
    <span
      className={cn(
        'flex items-center gap-1 font-medium text-2xs',
        align === 'right' && 'justify-self-end',
      )}
      style={{ color }}
    >
      <TrendArrowIcon fill={color} />
      {label} leads
    </span>
  )
}

function compare(
  left: number | null,
  right: number | null,
  lowerIsBetter: boolean | undefined,
): {
  leader: 'left' | 'right' | undefined
  leftFill: number
  rightFill: number
} {
  if (left === null || right === null) {
    return { leader: undefined, leftFill: 0, rightFill: 0 }
  }
  const total = left + right
  let leftFill = total > 0 ? left / total : 0
  let rightFill = total > 0 ? right / total : 0
  if (lowerIsBetter) [leftFill, rightFill] = [rightFill, leftFill]
  if (left === right) return { leader: undefined, leftFill, rightFill }
  const leftWins = lowerIsBetter ? left < right : left > right
  return { leader: leftWins ? 'left' : 'right', leftFill, rightFill }
}
