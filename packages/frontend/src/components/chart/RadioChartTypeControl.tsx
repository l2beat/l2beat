import compact from 'lodash/compact'
import React from 'react'

import { cn } from '../../utils/cn'

interface Tab {
  fullName: string
  shortName: string
  value: string
}

export function RadioChartTypeControl({
  hasActivity,
  hasTvl,
}: {
  hasActivity: boolean
  hasTvl: boolean
}) {
  const tabs: Tab[] = compact([
    hasTvl && {
      fullName: 'Value Locked',
      shortName: 'Value',
      value: 'detailedTvl',
      checked: true,
    },
    hasActivity && {
      fullName: 'Activity',
      shortName: 'Activity',
      value: 'activity',
      checked: false,
    },
  ])

  return (
    <div
      data-role="radio-chart-type-controls"
      className={cn(
        'relative',
        'before:absolute',
        'before:z-10',
        'before:top-[-1px]',
        'before:left-[-1px]',
        'before:right-[-1px]',
        'before:bottom-[-1px]',
        'before:bg-gradient-to-r',
        'before:from-purple-100',
        'before:to-pink-100',
        'before:rounded-md',
        'md:before:rounded-xl',
      )}
    >
      <div className="relative z-20 inline-flex w-full overflow-hidden rounded-[5px] bg-purple-300 px-[5px] text-base dark:bg-purple-700 md:rounded-[11px] md:px-[7px]">
        {tabs.map((tab, i) => (
          <label
            key={i}
            className={cn(
              'flex-1 text-lg font-bold md:flex-auto',
              'block items-center py-[5px] md:py-[7px]',
              'cursor-pointer select-none',
              'relative',
            )}
          >
            <input
              defaultChecked={i === 0}
              id={`radio-chart-type-controls-${tab.value}`}
              name="radio-chart-type-controls"
              type="radio"
              autoComplete="off"
              className="peer hidden"
              value={tab.value}
            />
            <div
              className={cn(
                'flex-1 py-1 md:flex-auto md:px-6 md:py-1.5',
                'flex justify-center',
                'rounded md:rounded-md',
                'peer-checked:text-white',
                'peer-checked:bg-gradient-to-r',
                'peer-checked:from-purple-100',
                'peer-checked:to-pink-100',
              )}
            >
              <span className="hidden lg:inline">{tab.fullName}</span>
              <span className="lg:hidden">{tab.shortName}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
