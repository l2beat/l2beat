import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/select'
import { useIsClient } from '~/hooks/use-is-client'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { cn } from '~/utils/cn'
import { RadioGroup, RadioGroupItem } from '../../core/radio-group'
import { Skeleton } from '../../core/skeleton'

interface Props<T extends string> {
  value: T | undefined
  setValue: (range: T) => void
  options: { value: T; disabled?: boolean; label: string }[]
  projectSection?: boolean
}

export function ChartTimeRangeControls<T extends string>({
  value,
  setValue,
  options,
  projectSection,
}: Props<T>) {
  const isClient = useIsClient()
  const breakpoint = useBreakpoint()
  const showSelect = projectSection
    ? breakpoint === 'tablet' || breakpoint === 'mobile'
    : breakpoint === 'mobile'

  if (!isClient) {
    return (
      <Skeleton
        className={cn(
          'h-8 w-20',
          projectSection ? 'lg:w-[292px]' : 'md:w-[292px]',
        )}
      />
    )
  }

  if (showSelect) {
    return (
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="z-[0] h-8">
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
