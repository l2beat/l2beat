import { UnixTime } from '@l2beat/shared-pure'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '~/components/core/Calendar'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/core/Drawer'
import { selectTriggerClassnames } from '~/components/core/Select'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import { useIsClient } from '~/hooks/useIsClient'
import { CalendarIcon } from '~/icons/Calendar'
import { ChevronIcon } from '~/icons/Chevron'
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
  offset = 0,
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<DateRange | undefined>({
    from: value[0] ? UnixTime.toDate(value[0]) : UnixTime.toDate(0),
    to: UnixTime.toDate(value[1]),
  })

  const [month, setMonth] = useState<Date>(UnixTime.toDate(value[1]))
  const isClient = useIsClient()
  const breakpoint = useBreakpoint()
  const showSelect = breakpoint === 'xs' || breakpoint === 'sm'

  if (!isClient) {
    return <Skeleton className={cn('h-8 w-14 md:w-[320px]')} />
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
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger
          className={cn(
            selectTriggerClassnames,
            'z-0 h-8 bg-surface-secondary',
          )}
        >
          {selectedOption === 'custom' ? (
            <CalendarIcon className="size-4 shrink-0" />
          ) : (
            options.find((option) => option.value === selectedOption)?.label
          )}
          <ChevronIcon className="size-2.5 fill-current stroke-[1.8px] transition-transform group-data-[state=open]/trigger:rotate-180 md:size-3" />
        </DrawerTrigger>
        <DrawerHeader className="sr-only">
          <DrawerTitle className="sr-only">Select time range</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <p className="mb-2 font-medium text-label-value-12 text-secondary">
            Predefined
          </p>
          <div
            className={cn(
              'group/radio-group inline-flex h-8 w-max items-center gap-1 rounded-lg p-1 font-medium',
              'bg-surface-secondary',
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
                  setDrawerOpen(false)
                }}
                type="button"
                disabled={option.disabled}
                data-state={
                  selectedOption === option.value ? 'checked' : 'unchecked'
                }
                className={cn(
                  'h-full rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
                  'data-[state=checked]:bg-pure-white dark:primary-card:data-[state=checked]:bg-black',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="mt-4 font-medium text-label-value-12 text-secondary">
            Custom
          </p>
          <CalendarComponent className="mx-auto h-[286px]" />
        </DrawerContent>
      </Drawer>
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
