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
import { useTracking } from '~/hooks/useTracking'
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

export type ChartRangeOptionValue =
  | '1d'
  | '7d'
  | '30d'
  | '90d'
  | '180d'
  | '1y'
  | 'max'
interface ChartRangeOption {
  value: ChartRangeOptionValue
  disabled?: boolean
  label: string
}

interface Props {
  name: string
  value: ChartRange
  setValue: (range: ChartRange) => void
  options: ChartRangeOption[]
  offset?: UnixTime
}

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

  const { track } = useTracking()
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

  if (showSelect) {
    return (
      <Drawer
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            track('chartRangeSelected', {
              props: { name, value: selectedOption },
            })
          }
          setDrawerOpen(open)
        }}
      >
        <DrawerTrigger
          className={cn(
            selectTriggerClassnames,
            'z-0 h-8 bg-surface-secondary',
          )}
        >
          {selectedOption === 'custom' ? (
            <CalendarIcon className="size-5 shrink-0" />
          ) : (
            options.find((option) => option.value === selectedOption)?.label
          )}
          <ChevronIcon className="size-2.5 fill-current stroke-[1.8px] transition-transform group-data-[state=open]/trigger:rotate-180 md:size-3" />
        </DrawerTrigger>
        <DrawerHeader className="sr-only">
          <DrawerTitle className="sr-only">Select time range</DrawerTitle>
        </DrawerHeader>
        <DrawerContent className="primary-card">
          <p className="mb-2 font-medium text-label-value-12 text-secondary">
            Predefined
          </p>
          <PredefinedOptions
            name={name}
            options={options}
            offset={offset}
            setValue={(range) => {
              setValue(range)
              setDrawerOpen(false)
            }}
            setInternalValue={setInternalValue}
            selectedOption={selectedOption}
          />
          <p className="mt-4 font-medium text-label-value-12 text-secondary">
            Custom
          </p>
          <CalendarComponent
            className="mx-auto h-[286px]"
            value={value}
            internalValue={internalValue}
            offset={offset}
            onDateRangeChange={onDateRangeChange}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PredefinedOptions
        name={name}
        options={options}
        offset={offset}
        setValue={setValue}
        setInternalValue={setInternalValue}
        selectedOption={selectedOption}
      >
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
          <CalendarIcon className="size-5 shrink-0" />
        </PopoverTrigger>
      </PredefinedOptions>
      <PopoverContent className="!p-0 !bg-surface-primary">
        <CalendarComponent
          value={value}
          internalValue={internalValue}
          offset={offset}
          onDateRangeChange={(dateRange) => {
            onDateRangeChange(dateRange)
            if (dateRange?.from && dateRange?.to) {
              track('chartRangeSelected', {
                props: { name, value: 'custom' },
              })
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

function PredefinedOptions({
  name,
  options,
  offset,
  setValue,
  setInternalValue,
  selectedOption,
  children,
}: {
  name: string
  options: ChartRangeOption[]
  offset: UnixTime
  setValue: (range: ChartRange) => void
  setInternalValue: (dateRange: DateRange | undefined) => void
  selectedOption: ChartRangeOptionValue | 'custom'
  children?: React.ReactNode
}) {
  const { track } = useTracking()
  return (
    <div
      className={cn(
        'group/radio-group inline-flex h-8 w-max items-center gap-1 rounded-lg p-1 font-medium',
        'bg-surface-primary primary-card:bg-surface-secondary',
      )}
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
            track('chartRangeSelected', {
              props: { name, value: option.value },
            })
          }}
          type="button"
          disabled={option.disabled}
          data-state={selectedOption === option.value ? 'checked' : 'unchecked'}
          className={cn(
            'h-full rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
            'data-[state=checked]:bg-surface-tertiary primary-card:data-[state=checked]:bg-pure-white dark:primary-card:data-[state=checked]:bg-black',
          )}
        >
          {option.label}
        </button>
      ))}
      {children}
    </div>
  )
}

function CalendarComponent({
  className,
  value,
  internalValue,
  offset,
  onDateRangeChange,
}: {
  className?: string
  value: ChartRange
  internalValue: DateRange | undefined
  offset: UnixTime
  onDateRangeChange: (dateRange: DateRange | undefined) => void
}) {
  const [month, setMonth] = useState<Date>(UnixTime.toDate(value[1]))

  return (
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
  )
}
