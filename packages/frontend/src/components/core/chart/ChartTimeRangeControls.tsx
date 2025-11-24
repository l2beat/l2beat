import { UnixTime } from '@l2beat/shared-pure'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '~/components/core/Calendar'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  selectTriggerClassnames,
} from '~/components/core/Select'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useIsClient } from '~/hooks/useIsClient'
import { CalendarIcon } from '~/icons/Calendar'
import { cn } from '~/utils/cn'
import {
  type ChartRange,
  optionToRange,
  rangeToOption,
} from '~/utils/range/range'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Skeleton } from '../Skeleton'
import { VerticalSeparator } from '../VerticalSeparator'

interface Props {
  name: string
  value: ChartRange
  setValue: (range: ChartRange) => void
  options: { value: ChartRangeOption; disabled?: boolean; label: string }[]
  projectSection?: boolean
  offset?: UnixTime
}

export type ChartRangeOption =
  | '1d'
  | '7d'
  | '30d'
  | '90d'
  | '180d'
  | '1y'
  | 'max'

export function ChartTimeRangeControls({
  name,
  value,
  setValue,
  options,
  projectSection,
  offset = 0,
}: Props) {
  const [internalValue, setInternalValue] = useState<DateRange | undefined>({
    from: value[0] ? UnixTime.toDate(value[0]) : UnixTime.toDate(0),
    to: UnixTime.toDate(value[1]),
  })

  const [month, setMonth] = useState<Date>(UnixTime.toDate(value[1]))
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
  const selectedOption = rangeToOption(value, options, offset)

  function onDateRangeChange(dateRange: DateRange | undefined) {
    setInternalValue(dateRange)

    if (dateRange?.from && dateRange?.to) {
      setValue([
        UnixTime.fromDate(dateRange.from),
        Math.min(
          UnixTime.toStartOf(UnixTime.now(), 'hour'),
          UnixTime.fromDate(dateRange.to) +
            23 * UnixTime.HOUR +
            59 * UnixTime.MINUTE +
            59,
        ),
      ])
    }
  }

  const CalendarComponent = ({ className }: { className?: string }) => (
    <>
      <Calendar
        mode="range"
        month={month}
        onMonthChange={setMonth}
        // 2020-01-01
        startMonth={UnixTime.toDate(1577836800)}
        endMonth={UnixTime.toDate(UnixTime.toStartOf(UnixTime.now(), 'day'))}
        selected={internalValue}
        min={1}
        timeZone="UTC"
        disabled={(date) =>
          date.getTime() >
          UnixTime.toStartOf(UnixTime.now() + offset, 'day') * 1000
        }
        onSelect={onDateRangeChange}
        captionLayout="dropdown"
        className={cn('rounded-lg pb-3', className)}
      />
    </>
  )

  if (showSelect) {
    return (
      <div className="flex items-center gap-1">
        <Select
          value={selectedOption}
          onValueChange={(option) => {
            const range = optionToRange(option as ChartRangeOption, {
              offset,
            })
            setValue(range)
          }}
        >
          <SelectTrigger className="z-0 h-8 bg-surface-secondary">
            <SelectValue>
              {selectedOption === 'custom'
                ? '-'
                : options.find((option) => option.value === selectedOption)
                    ?.label}
            </SelectValue>
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
        <Drawer>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Select time range</DrawerTitle>
            <DrawerDescription>
              Select the time range for the chart.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerTrigger
            className={cn(
              '!bg-surface-secondary z-0 h-8',
              selectTriggerClassnames,
            )}
          >
            <CalendarIcon className="size-4 shrink-0" />
          </DrawerTrigger>
          <DrawerContent className="mx-auto">
            <CalendarComponent className="mx-auto h-[286px]" />
          </DrawerContent>
        </Drawer>
      </div>
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
            onClick={() => {
              const range = optionToRange(option.value, { offset })
              setValue(range)
              setInternalValue({
                from: UnixTime.toDate(range[0] ?? 0),
                to: UnixTime.toDate(range[1]),
              })
            }}
            type="button"
            disabled={option.disabled}
            data-state={
              selectedOption === option.value ? 'checked' : 'unchecked'
            }
            className={cn(
              'h-full rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
              'data-[state=checked]:bg-surface-tertiary primary-card:data-[state=checked]:bg-pure-white dark:primary-card:data-[state=checked]:bg-black',
            )}
          >
            {option.label}
          </button>
        ))}
        <VerticalSeparator />
        <PopoverTrigger
          data-state={selectedOption === 'custom' ? 'checked' : 'unchecked'}
          className={cn(
            'flex w-9 items-center justify-center p-0',
            'h-full rounded-md',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
            'focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 focus:ring-offset-transparent',
            // unset the ring inset from the popover trigger classnames
            'focus:[--tw-ring-inset:_]!',
            'data-[state=checked]:bg-surface-tertiary primary-card:data-[state=checked]:bg-pure-white dark:primary-card:data-[state=checked]:bg-black',
          )}
        >
          <CalendarIcon className="size-4 shrink-0" />
        </PopoverTrigger>
      </div>

      <PopoverContent className="!p-0 !bg-surface-primary">
        <CalendarComponent />
      </PopoverContent>
    </Popover>
  )
}
