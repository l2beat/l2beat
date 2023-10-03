import cx from 'classnames'
import compact from 'lodash/compact'
import React from 'react'

interface Tab {
  fullName: string
  shortName: string
  value: string
}

export function RadioChartTypeControl({
  hasActivity,
}: {
  hasActivity: boolean
}) {
  const tabs: Tab[] = compact([
    {
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
      className={cx(
        'relative',
        'before:absolute',
        'before:z-10',
        'before:-top-[1px]',
        'before:-left-[1px]',
        'before:-right-[1px]',
        'before:-bottom-[1px]',
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
            className={cx(
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
              className={cx(
                'flex-1 py-1 md:flex-auto md:px-6 md:py-1.5',
                'flex justify-center',
                'rounded md:rounded-md',
                'peer-checked:text-white',
                'peer-checked:bg-gradient-to-r',
                'peer-checked:from-purple-100',
                'peer-checked:to-pink-100',
              )}
            >
              <span className="hidden md:inline">{tab.fullName}</span>
              <span className="md:hidden">{tab.shortName}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
