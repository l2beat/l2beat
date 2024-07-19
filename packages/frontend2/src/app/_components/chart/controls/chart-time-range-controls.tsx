import React from 'react'
import { formatRange } from '~/utils/dates'
import { RadioGroup, RadioGroupItem } from '../../radio-group'
import { Skeleton } from '../../skeleton'
import { type TvlChartRange } from '~/server/features/tvl/range-utils'
import { useChartLoading } from '../core/chart-loading-context'
import { useIsClient } from '~/hooks/use-is-client'

interface Props {
  value: TvlChartRange
  setValue: (range: TvlChartRange) => void
  range: readonly [number, number]
  options: { value: TvlChartRange; label: string }[]
}

export function ChartTimeRangeControls({
  value,
  setValue,
  range,
  options,
}: Props) {
  const loading = useChartLoading()
  const isClient = useIsClient()

  return (
    <div className="flex flex-wrap-reverse justify-between gap-2">
      {loading ? (
        <Skeleton className="h-8 w-40" />
      ) : (
        <p className="flex h-8 items-center font-bold transition-opacity duration-200">
          {formatRange(...range)}
        </p>
      )}
      {!isClient ? (
        <Skeleton className="h-8 w-[292px]" />
      ) : (
        <RadioGroup value={value} onValueChange={setValue}>
          {options.map((option) => (
            <RadioGroupItem key={option.value} value={option.value}>
              {option.label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}
