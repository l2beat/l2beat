import React from 'react'
import { formatRange } from '~/utils/dates'
import { RadioGroup, RadioGroupItem } from '../../radio-group'

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
  return (
    <div className="flex flex-wrap justify-between gap-2">
      <p className="flex h-8 max-w-[130px] items-center font-bold transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none sm:max-w-full group-data-[interactivity-disabled]/chart:opacity-0">
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
