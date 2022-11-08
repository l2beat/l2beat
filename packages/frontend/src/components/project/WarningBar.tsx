import cx from 'classnames'
import React from 'react'

import { ShieldIcon } from '../icons'

export interface WarningBarProps {
  color: 'red' | 'yellow'
  text: string
  isCritical: boolean
}

export function WarningBar({ color, text, isCritical }: WarningBarProps) {
  return (
    <div
      className={cx(
        'flex gap-3 mt-4 first:mt-0 md:mt-6 p-4',
        'bg-opacity-20 rounded-lg',
        color === 'red' ? 'bg-red-600' : 'bg-yellow-300',
      )}
    >
      <span>
        <ShieldIcon
          className={cx(
            color === 'red'
              ? 'fill-red-700 dark:fill-red-300'
              : 'fill-yellow-700 dark:fill-yellow-300',
          )}
        />
      </span>
      <p>
        {isCritical ? (
          <>
            {text.slice(0, -1)}{' '}
            <span className="text-red-700 dark:text-red-300">(CRITICAL)</span>
            {text.slice(-1)}
          </>
        ) : (
          text
        )}
      </p>
    </div>
  )
}
