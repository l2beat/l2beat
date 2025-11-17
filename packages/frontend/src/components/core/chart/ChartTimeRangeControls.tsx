import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { Calendar } from '~/components/core/Calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/Select'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useIsClient } from '~/hooks/useIsClient'
import { CalendarIcon } from '~/icons/Calendar'
import { cn } from '~/utils/cn'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Skeleton } from '../Skeleton'
import { VerticalSeparator } from '../VerticalSeparator'

interface Props {
  name: string
  value: ChartTimeRangeValue
  setValue: (range: ChartTimeRangeValue) => void
  options: { value: ChartTimeRangeOption; disabled?: boolean; label: string }[]
  projectSection?: boolean
}

export type ChartTimeRangeOption =
  | '1d'
  | '7d'
  | '30d'
  | '90d'
  | '180d'
  | '1y'
  | 'max'

export type ChartTimeRangeValue = {
  from: UnixTime | null
  to: UnixTime
}

export function ChartTimeRangeControls({
  name,
  value,
  setValue,
  options,
  projectSection,
}: Props) {
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
  const selectedOption = rangeToOption(value, options)

  if (showSelect) {
    return (
      <Select
        value={selectedOption === 'custom' ? undefined : selectedOption}
        onValueChange={(option) => {
          const range = optionToRange(option as ChartTimeRangeOption)
          setValue(range)
        }}
      >
        <SelectTrigger className={cn('z-0 h-8 bg-surface-secondary')}>
          <SelectValue
            placeholder={selectedOption === 'custom' ? 'Custom' : undefined}
          />
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
    <Popover>
      <div
        className={cn(
          'group/radio-group inline-flex h-8 w-max items-center gap-1 rounded-lg p-1 font-medium',
          'bg-surface-primary primary-card:bg-surface-secondary',
        )}
        // name={name}
      >
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              setValue({
                from:
                  option.value === 'max'
                    ? null
                    : UnixTime.toStartOf(UnixTime.now(), 'day') -
                      optionToDays(option.value) * UnixTime.DAY,
                to: UnixTime.toStartOf(UnixTime.now(), 'day'),
              })
            }
            type="button"
            disabled={option.disabled}
            data-state={
              selectedOption === option.value ? 'checked' : 'unchecked'
            }
            className={cn(
              'h-full rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
              'group-data-[variant=highlighted]/radio-group:data-[state=checked]:bg-linear-to-r group-data-[variant=highlighted]/radio-group:data-[state=checked]:from-purple-100 group-data-[variant=highlighted]/radio-group:data-[state=checked]:to-pink-100 group-data-[variant=highlighted]/radio-group:data-[state=checked]:text-white',
              'data-[state=checked]:bg-surface-tertiary primary-card:data-[state=checked]:bg-pure-white dark:primary-card:data-[state=checked]:bg-black',
            )}
          >
            {option.label}
          </button>
        ))}
        <VerticalSeparator />
        <PopoverTrigger className="flex w-9 items-center justify-center p-0">
          <CalendarIcon className="size-4 shrink-0" />
        </PopoverTrigger>
      </div>

      <PopoverContent className="!p-0 !bg-surface-primary">
        <Calendar
          mode="range"
          defaultMonth={
            value.from ? UnixTime.toDate(value.from) : UnixTime.toDate(value.to)
          }
          selected={
            value.from
              ? {
                  from: UnixTime.toDate(value.from),
                  to: UnixTime.toDate(value.to),
                }
              : undefined
          }
          onSelect={(dateRange) => {
            if (dateRange?.from && dateRange?.to) {
              setValue({
                from: UnixTime.fromDate(dateRange.from),
                to: UnixTime.fromDate(dateRange.to),
              })
            }
          }}
          className="rounded-lg"
        />
        <div className="h-3" />
      </PopoverContent>
    </Popover>
  )
}

function rangeToOption(
  { from, to }: { from: UnixTime | null; to: UnixTime },
  options: { value: ChartTimeRangeOption }[],
): ChartTimeRangeOption | 'custom' {
  if (from === null) return 'max'
  const days = rangeToDays({ from, to })
  const option = options.find((option) => optionToDays(option.value) === days)
  if (option) return option.value

  return 'custom'
}

function optionToDays(option: 'max'): null
function optionToDays(option: Exclude<ChartTimeRangeOption, 'max'>): number
function optionToDays(option: ChartTimeRangeOption): number | null
function optionToDays(option: ChartTimeRangeOption): number | null {
  switch (option) {
    case '1d':
      return 1
    case '7d':
      return 7
    case '30d':
      return 30
    case '90d':
      return 90
    case '180d':
      return 180
    case '1y':
      return 365
    case 'max':
      return null
    default:
      return assertUnreachable(option)
  }
}

export function optionToRange(option: ChartTimeRangeOption) {
  const days = optionToDays(option)
  return {
    from:
      days === null
        ? null
        : UnixTime.toStartOf(UnixTime.now(), 'day') - days * UnixTime.DAY,
    to: UnixTime.toStartOf(UnixTime.now(), 'day'),
  }
}
