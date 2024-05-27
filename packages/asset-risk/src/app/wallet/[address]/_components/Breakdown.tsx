import { indexOf, max, sum } from 'lodash'
import { ClassNameValue } from 'tailwind-merge'
import { cn } from '~/utils/cn'
import { formatNumberWithCommas } from '~/utils/formatNumber'

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
    <div>
      <div className={cn('h-[56px] w-full max-w-full md:my-0 relative')}>
        {groups.map((g, i) => {
          const leftPercentage = groups
            .slice(0, i)
            .reduce(
              (acc, prevStage) =>
                !prevStage.weight ? acc : acc + (prevStage.weight / 100) * 100,
              0,
            )
          return (
            <div
              key={`breakdown-group-${i}`}
              className={cn(
                'rounded-lg h-[56px] last:mr-0 bg-gradient-to-r border',
                'flex flex-col items-end justify-end py-[10px] px-3',
                'absolute',
                g.className,
              )}
              style={{
                width: `calc(${g.weight}%${i !== 0 ? ' + 12px' : ''})`,
                left: `calc(${leftPercentage}%${i !== 0 ? ' - 12px' : ''})`,
                zIndex: groups.length - i,
              }}
            >
              <span className={cn('text-sm', g.valueClassName)}>
                ${formatNumberWithCommas(g.value)}
              </span>
              <span className="text-sm font-semibold leading-[15px] whitespace-nowrap overflow-ellipsis">
                {g.name}
              </span>
            </div>
          )
        })}
      </div>
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
    intParts[largestIndex] += 1
    decimalParts[largestIndex] = 0
  }

  return intParts
}
