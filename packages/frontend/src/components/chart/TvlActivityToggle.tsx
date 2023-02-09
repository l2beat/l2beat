import cx from 'classnames'
import React from 'react'

export function TvlActivityToggle() {
  return (
    <div
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
      <label
        className={cx(
          'bg-purple-300 text-lg font-bold dark:bg-purple-700',
          'flex items-center p-[5px] md:p-[7px]',
          'cursor-pointer select-none rounded-[5px] md:rounded-[11px]',
          'relative z-20',
        )}
      >
        <input
          data-role="toggle-tvl-activity"
          id="tvl-activity"
          type="checkbox"
          autoComplete="off"
          className="peer hidden"
        />
        <div
          className={cx(
            'flex-1 py-1 md:flex-auto md:px-6 md:py-1.5',
            'flex justify-center',
            'rounded md:rounded-md',
            'bg-gradient-to-r from-purple-100 to-pink-100',
            'peer-checked:bg-none',
            'text-white',
            'peer-checked:text-black',
            'dark:peer-checked:text-white',
          )}
        >
          <span className="hidden md:inline">Total Value Locked</span>
          <span className="md:hidden">TVL</span>
        </div>
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
          Activity
        </div>
      </label>
    </div>
  )
}
