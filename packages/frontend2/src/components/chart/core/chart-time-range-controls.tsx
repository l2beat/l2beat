import { useIsClient } from '~/hooks/use-is-client'
import { formatRange } from '~/utils/dates'
import { RadioGroup, RadioGroupItem } from '../../core/radio-group'
import { Skeleton } from '../../core/skeleton'
import { useChartLoading } from './chart-loading-context'

interface Props<T extends string> {
  value: T | undefined
  setValue: (range: T) => void
  range: readonly [number, number]
  options: { value: T; disabled?: boolean; label: string }[]
}

export function ChartTimeRangeControls<T extends string>({
  value,
  setValue,
  range,
  options,
}: Props<T>) {
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
            <RadioGroupItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}
