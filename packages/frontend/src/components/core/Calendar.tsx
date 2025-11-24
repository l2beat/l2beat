'use client'

import * as React from 'react'
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from 'react-day-picker'
import type { Button } from '~/components/core/Button'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'outline',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'group/calendar bg-surface-primary [--cell-height:--spacing(9.5)] [--cell-width:--spacing(11)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        className,
      )}
      captionLayout={captionLayout}
      formatters={{
        formatWeekdayName: (day) => {
          return new Intl.DateTimeFormat('en-US', { weekday: 'short' })
            .format(day)
            .toUpperCase()
        },
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col gap-4 md:flex-row',
          defaultClassNames.months,
        ),

        month: cn('flex w-full flex-col', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 px-3 py-[9px]',
          captionLayout === 'dropdown' && 'h-[54px]',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          'flex items-center justify-center text-secondary',
          'select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          'flex items-center justify-center text-secondary',
          'select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex w-full items-center justify-center px-(--cell-width) py-2',
          defaultClassNames.month_caption,
        ),
        dropdowns: cn(
          'flex h-(--cell-height) w-full items-center justify-center gap-1.5 font-medium text-sm',
          defaultClassNames.dropdowns,
        ),
        dropdown_root: cn(
          'relative rounded-md border border-divider shadow-xs',
          // 'has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50',
          defaultClassNames.dropdown_root,
        ),
        dropdown: cn('absolute inset-0 opacity-0', defaultClassNames.dropdown),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'font-medium text-label-value-14 text-secondary'
            : 'flex h-8 items-center gap-1 rounded-md pr-1 pl-2 font-medium text-label-value-14 [&>svg]:text-secondary',
          defaultClassNames.caption_label,
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex h-4', defaultClassNames.weekdays),
        weekday: cn(
          'flex flex-1 select-none items-center justify-center rounded-md font-semibold text-secondary text-subtitle-10',
          defaultClassNames.weekday,
        ),
        week: cn('group/week flex w-full', defaultClassNames.week),
        week_number_header: cn(
          'w-(--cell-width) select-none',
          defaultClassNames.week_number_header,
        ),
        week_number: cn(
          'select-none font-semibold text-secondary text-subtitle-10',
          defaultClassNames.week_number,
        ),
        day: cn(
          'group/day relative h-(--cell-height) w-(--cell-width) select-none border border-divider p-0 text-center',
          // props.showWeekNumber
          //   ? '[&:nth-child(2)[data-selected=true]_button]:rounded-l-md'
          //   : '[&:first-child[data-selected=true]_button]:rounded-l-md',
          defaultClassNames.day,
        ),
        range_start: cn('bg-brand', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('bg-brand', defaultClassNames.range_end),
        today: cn('text-brand', defaultClassNames.today),
        outside: cn(
          'text-secondary aria-selected:text-secondary',
          defaultClassNames.outside,
        ),
        disabled: cn('text-secondary opacity-30', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronIcon
                className={cn('size-3 rotate-90 fill-current', className)}
                {...props}
              />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronIcon
                className={cn('-rotate-90 size-3 fill-current', className)}
                {...props}
              />
            )
          }

          return (
            <ChevronIcon
              className={cn('size-3 fill-current', className)}
              {...props}
            />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex h-(--cell-height) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <button
      ref={ref}
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'flex size-full flex-col items-center justify-center gap-1 font-medium text-label-value-14 leading-none data-[range-end=true]:bg-brand data-[range-middle=true]:bg-surface-secondary data-[range-start=true]:bg-brand data-[selected-single=true]:bg-brand data-[range-end=true]:text-white data-[range-middle=true]:text-primary data-[range-start=true]:text-white data-[selected-single=true]:text-white group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 dark:hover:text-white [&>span]:text-xs [&>span]:opacity-70',
        // 'group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
