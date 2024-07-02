import React from 'react'
import { formatRange } from '~/utils/dates'
import { RadioGroup, RadioGroupItem } from '../../radio-group'
import { Skeleton } from '../../skeleton'
import { useChartContext } from '../core/chart-context'

interface Props {
  value: string
  setValue: (range: string) => void
  range: readonly [number, number]
  options: { value: string; label: string }[]
}

export function ChartTimeRangeControls({
  value,
  setValue,
  range,
  options,
}: Props) {
  const { loading } = useChartContext()

  if (loading) {
    return (
      <div className="flex flex-wrap justify-between gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-[292px]" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap-reverse justify-between gap-2">
      <p className="flex h-8 items-center font-bold transition-opacity duration-200">
        {formatRange(...range)}
      </p>
      <RadioGroup value={value} onValueChange={setValue}>
        {options.map((option) => (
          <RadioGroupItem key={option.value} value={option.value}>
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  )
}
