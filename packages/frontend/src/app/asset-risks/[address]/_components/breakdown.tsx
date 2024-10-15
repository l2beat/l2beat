'use client'
import { indexOf, max, sum } from 'lodash'
import { useEffect, useRef } from 'react'
import { type ClassNameValue } from 'tailwind-merge'
import { useEventCallback } from '~/hooks/use-event-callback'
import { useEventListener } from '~/hooks/use-event-listener'
import { cn } from '~/utils/cn'
import { formatNumberWithCommas } from '~/utils/number-format/format-number'

type BreakdownValue = {
  name: string
  value: number
  className: ClassNameValue
  valueClassName: ClassNameValue
}

const CONFIG: BreakdownValue[] = [
  {
    name: 'Stage 2',
    value: 40203.02,
    className: 'from-[#00B84C] to-[#15CA60] border-[#00B84C] text-white',
    valueClassName: 'text-white/60',
  },
  {
    name: 'Stage 1',
    value: 98101.05,
    className: 'from-[#DCE84B] to-[#ECCD27] border-[#C2AB13] text-[#5A5836]',
    valueClassName: 'text-[#5A5837]/50',
  },
  {
    name: 'Stage 0',
    value: 19002.12,
    className: 'from-[#FF8B36] to-[#EC731B] border-[#ED7924] text-white',
    valueClassName: 'text-white/60',
  },
  {
    name: 'Validiums/Optimiums',
    value: 30000.32,
    className: 'from-[#E8EBF1] to-[#C3C7CD] border-[#9FA6B2] text-[#4F5865]',
    valueClassName: 'text-[#505966]/60',
  },
]

export function Breakdown() {
  const groups = getBreakdownGroups(CONFIG)

  return (
    <div className="mt-1 flex flex-col">
      <div
        className={cn(
          'relative h-[14px] w-full max-w-full md:my-0 md:h-[56px]',
        )}
      >
        {groups.map((g, i) => {
          const leftPercentage = groups
            .slice(0, i)
            .reduce(
              (acc, prevStage) =>
                !prevStage.weight ? acc : acc + (prevStage.weight / 100) * 100,
              0,
            )

          return (
            <BreakdownItem
              key={`breakdown-group-${i}`}
              group={g}
              groupLength={groups.length}
              index={i}
              offset={leftPercentage}
            />
          )
        })}
      </div>
      <div className="mt-4 flex w-full flex-col text-sm md:hidden">
        {groups.map((g, i) => (
          <div
            key={`breakdown-legend-${i}`}
            className="flex w-full items-center justify-between"
          >
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'size-4 rounded border bg-gradient-to-r',
                  g.className,
                )}
              />
              <span className="hidden pl-1 font-bold text-pink-900 sm:inline-block">
                ${formatNumberWithCommas(g.value)}
              </span>
              <span className="hidden font-medium text-zinc-500 sm:inline-block">
                ({g.weight}%)
              </span>
              <span className="font-medium text-zinc-800">{g.name}</span>
            </div>
            <div className="block sm:hidden">
              <span className="pl-1 font-bold text-pink-900">
                ${formatNumberWithCommas(g.value)}
              </span>
              <span className="font-medium text-zinc-500">({g.weight}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BreakdownItem({
  group,
  index,
  groupLength,
  offset,
}: {
  group: BreakdownGroup
  index: number
  groupLength: number
  offset: number
}) {
  const parentRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const valueRef = useRef<HTMLSpanElement | null>(null)

  const checkOverflow = useEventCallback(() => {
    const containerWidth = parentRef.current?.clientWidth
    const textWidth = textRef.current?.scrollWidth
    const valueWidth = valueRef.current?.scrollWidth

    if (textWidth && containerWidth && valueWidth) {
      if (textWidth > containerWidth - 32 || valueWidth > containerWidth - 32) {
        textRef.current?.classList.add('opacity-0')
        valueRef.current?.classList.add('opacity-0')
      } else {
        textRef.current?.classList.remove('opacity-0')
        valueRef.current?.classList.remove('opacity-0')
      }
    }
  })
  useEffect(() => checkOverflow(), [checkOverflow])
  useEventListener('resize', checkOverflow)

  return (
    <div
      ref={parentRef}
      className={cn(
        'h-full rounded-lg border bg-gradient-to-r last:mr-0',
        'flex flex-col items-end justify-end',
        'absolute overflow-hidden text-ellipsis',
        'p-0 md:px-3 md:py-[10px]',
        group.className,
      )}
      style={{
        width: `calc(${group.weight}%${index !== 0 ? ' + 12px' : ''})`,
        left: `calc(${offset}%${index !== 0 ? ' - 12px' : ''})`,
        zIndex: groupLength - index,
      }}
    >
      <span
        ref={valueRef}
        className={cn('hidden text-sm md:inline-block', group.valueClassName)}
      >
        ${formatNumberWithCommas(group.value)}
      </span>
      <span
        ref={textRef}
        className="hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-[15px] md:inline-block"
      >
        {group.name}
      </span>
    </div>
  )
}

interface BreakdownGroup {
  weight: number | undefined
  value: number
  name: string
  className: ClassNameValue
  valueClassName: ClassNameValue
}

function getBreakdownGroups(values: BreakdownValue[]): BreakdownGroup[] {
  const totalValue = values.reduce((sum, v) => sum + v.value, 0)

  if (totalValue === 0) return []

  const groups = values.map((v) => ({
    weight: (v.value / totalValue) * 100,
    value: v.value,
    name: v.name,
    className: v.className,
    valueClassName: v.valueClassName,
  }))

  const toFilterOut = groups.filter((g) => g.weight < 2)
  const filteredGroups = groups.filter((g) => g.weight >= 2)

  const filteredOutSum = toFilterOut.reduce((sum, g) => sum + g.weight, 0)
  for (const filteredGroup of filteredGroups) {
    filteredGroup.weight += filteredOutSum / filteredGroups.length
  }

  if (filteredGroups.length < 2) {
    return filteredGroups
  }

  const weights = unifyPercentagesAsIntegers(
    filteredGroups.map((g) => g.weight),
  )
  return filteredGroups.map((f, i) => ({
    weight: weights[i],
    name: f.name,
    value: f.value,
    className: f.className,
    valueClassName: f.valueClassName,
  }))
}

export function unifyPercentagesAsIntegers(percentages: number[]): number[] {
  if (percentages.length < 2) {
    throw new Error(`Array has to contain at least two elements`)
  }

  const ALLOWED_ERROR = 0.001
  const summed = sum(percentages)
  if (summed < 100 - ALLOWED_ERROR || summed > 100 + ALLOWED_ERROR) {
    throw new Error(`Values do not sum to 100, they sum to ${summed}`)
  }

  const intParts = percentages.map(Math.floor)
  const decimalParts = percentages.map((v) => v - Math.floor(v))

  const iterations = 100 - sum(intParts)
  for (let i = 0; i < iterations; i++) {
    const largestIndex = indexOf(decimalParts, max(decimalParts))
    if (intParts[largestIndex] !== undefined) intParts[largestIndex] += 1

    decimalParts[largestIndex] = 0
  }

  return intParts
}
