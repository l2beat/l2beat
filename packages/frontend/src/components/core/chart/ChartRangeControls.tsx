import { UnixTime } from '@l2beat/shared-pure'
import { useId, useState } from 'react'
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
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { Popover, PopoverContent, PopoverTrigger } from '../Popover'
import { Skeleton } from '../Skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'
import { VerticalSeparator } from '../VerticalSeparator'
import {
  type ChartRangeOptionValue,
  rangeToOption,
} from './utils/rangeToOption'

export { rangeToOption, type ChartRangeOptionValue }

interface ChartRangeOption {
  value: ChartRangeOptionValue
  disabled?: boolean
  /** Shown in a tooltip in the bar and as text under the options in the drawer */
  disabledReason?: string
  label: string
}

interface Props {
  name: string
  value: ChartRange
  setValue: (range: ChartRange) => void
  options: ChartRangeOption[]
}

export function ChartRangeControls({ name, value, setValue, options }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<DateRange | undefined>(
    undefined,
  )

  const { track } = useTracking()
  const isClient = useIsClient()
  const breakpoint = useBreakpoint()

  const showSelect = breakpoint === 'xs' || breakpoint === 'sm'

  if (!isClient) {
    return <Skeleton className={cn('h-8 w-14 md:w-[320px]')} />
  }
  const selectedOption = rangeToOption(
    value,
    options.map((option) => option.value),
  )

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
            track('chartRangeSelected', { name, value: selectedOption })
          }
          setDrawerOpen(open)
        }}
      >
        <DrawerTrigger
          className={cn(
            selectTriggerClassnames,
            'z-0 h-8 bg-surface-primary primary-card:bg-surface-secondary',
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
            layout="drawer"
            name={name}
            options={options}
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
            onDateRangeChange={onDateRangeChange}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover>
      <PredefinedOptions
        layout="bar"
        name={name}
        options={options}
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
            // unset the ring inset from the popover trigger classnames
            'focus-visible:[--tw-ring-inset:_]!',
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
          onDateRangeChange={(dateRange) => {
            onDateRangeChange(dateRange)
            if (dateRange?.from && dateRange?.to) {
              track('chartRangeSelected', { name, value: 'custom' })
            }
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

/**
 * `bar` sits inline in the chart header, so it stays 32px tall and explains a
 * disabled option in a tooltip, which the app's Tooltip opens on tap too.
 * `drawer` is the touch layout: options are 40px tall so they are easy to
 * hit, and the reasons are written out under them, as nothing hovers there.
 */
type PredefinedOptionsLayout = 'bar' | 'drawer'

function PredefinedOptions({
  layout,
  name,
  options,
  setValue,
  setInternalValue,
  selectedOption,
  children,
}: {
  layout: PredefinedOptionsLayout
  name: string
  options: ChartRangeOption[]
  setValue: (range: ChartRange) => void
  setInternalValue: (dateRange: DateRange | undefined) => void
  selectedOption: ChartRangeOptionValue | 'custom'
  children?: React.ReactNode
}) {
  const { track } = useTracking()
  const idPrefix = useId()
  const disabledReasons = groupDisabledReasons(options).map((group, i) => ({
    ...group,
    id: `${idPrefix}-${i}`,
  }))

  const group = (
    <div
      className={cn(
        'group/radio-group items-center gap-1 rounded-lg p-1 font-medium',
        layout === 'bar' ? 'inline-flex h-8 w-max' : 'flex w-full',
        'bg-surface-primary primary-card:bg-surface-secondary',
      )}
    >
      {options.map((option) => {
        const disabledReason = option.disabled
          ? option.disabledReason
          : undefined
        const button = (
          <button
            key={option.value}
            onClick={() => {
              const range = optionToRange(option.value)
              setValue(range)
              setInternalValue(undefined)
              track('chartRangeSelected', { name, value: option.value })
            }}
            type="button"
            disabled={option.disabled}
            aria-describedby={
              layout === 'drawer'
                ? disabledReasons.find((r) => r.reason === disabledReason)?.id
                : undefined
            }
            data-state={
              selectedOption === option.value ? 'checked' : 'unchecked'
            }
            className={cn(
              'rounded-md px-2 text-xs disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              layout === 'bar' ? 'h-full' : 'h-10 min-w-0 flex-1 px-1',
              // A disabled button swallows taps without firing click, so
              // they go through to the tooltip's wrapper
              layout === 'bar' && disabledReason && 'pointer-events-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:ring-offset-transparent',
              'data-[state=checked]:bg-surface-tertiary primary-card:data-[state=checked]:bg-pure-white dark:primary-card:data-[state=checked]:bg-black',
            )}
          >
            {option.label}
          </button>
        )
        if (layout === 'drawer' || !disabledReason) {
          return button
        }
        return (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              <span className="flex h-full cursor-not-allowed">{button}</span>
            </TooltipTrigger>
            <TooltipContent>{disabledReason}</TooltipContent>
          </Tooltip>
        )
      })}
      {children}
    </div>
  )

  if (layout === 'bar') {
    return group
  }
  return (
    <>
      {group}
      {disabledReasons.map(({ reason, labels, id }) => (
        <p key={id} id={id} className="mt-2 text-label-value-12 text-secondary">
          <span className="font-medium text-primary">{labels.join(', ')}:</span>{' '}
          {reason}
        </p>
      ))}
    </>
  )
}

/** One line per reason, as options are usually disabled for the same one */
function groupDisabledReasons(options: ChartRangeOption[]) {
  const groups: { reason: string; labels: string[] }[] = []
  for (const option of options) {
    if (!option.disabled || !option.disabledReason) continue
    const group = groups.find((g) => g.reason === option.disabledReason)
    if (group) {
      group.labels.push(option.label)
    } else {
      groups.push({ reason: option.disabledReason, labels: [option.label] })
    }
  }
  return groups
}

function CalendarComponent({
  className,
  value,
  internalValue,
  onDateRangeChange,
}: {
  className?: string
  value: ChartRange
  internalValue: DateRange | undefined
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
        date.getTime() > UnixTime.toStartOf(UnixTime.now(), 'day') * 1000
      }
      onSelect={onDateRangeChange}
      captionLayout="dropdown"
      className={cn('rounded-lg pb-3', className)}
    />
  )
}
