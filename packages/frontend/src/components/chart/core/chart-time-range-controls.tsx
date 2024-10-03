import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/select'
import { useIsClient } from '~/hooks/use-is-client'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { formatRange } from '~/utils/dates'
import { RadioGroup, RadioGroupItem } from '../../core/radio-group'
import { Skeleton } from '../../core/skeleton'
import { useChartLoading } from './chart-loading-context'

interface Props<T extends string> {
  value: T | undefined
  setValue: (range: T) => void
  range: [number, number] | undefined
  options: { value: T; disabled?: boolean; label: string }[]
}

export function ChartTimeRangeControls<T extends string>(props: Props<T>) {
  const loading = useChartLoading()
  const isClient = useIsClient()

  return (
    <div className="flex flex-wrap-reverse justify-between gap-2">
      {loading ? (
        <Skeleton className="h-8 w-52" />
      ) : (
        <p className="flex h-8 items-center font-bold transition-opacity duration-200 max-md:w-52">
          {props.range ? formatRange(...props.range) : null}
        </p>
      )}
      {!isClient ? (
        <Skeleton className="h-8 w-20 md:w-[292px]" />
      ) : (
        <Controls {...props} />
      )}
    </div>
  )
}

function Controls<T extends string>({ value, setValue, options }: Props<T>) {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'

  if (isMobile) {
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
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
  )
}
