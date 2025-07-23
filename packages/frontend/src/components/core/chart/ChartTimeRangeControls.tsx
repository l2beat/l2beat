import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'
import { RadioGroup, RadioGroupItem } from '../RadioGroup'
import { Skeleton } from '../Skeleton'

interface Props<T extends string> {
  name: string
  value: T | undefined
  setValue: (range: T) => void
  options: { value: T; disabled?: boolean; label: string }[]
  projectSection?: boolean
}

export function ChartTimeRangeControls<T extends string>({
  name,
  value,
  setValue,
  options,
  projectSection,
}: Props<T>) {
  const isClient = useIsClient()
  const breakpoint = useBreakpoint()
  const showSelect = projectSection
    ? breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md'
    : breakpoint === 'xs' || breakpoint === 'sm'

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
        <SelectTrigger className={cn('z-0 h-8 bg-surface-secondary')}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-surface-secondary">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="focus:bg-surface-tertiary"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <RadioGroup name={name} value={value} onValueChange={setValue}>
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
