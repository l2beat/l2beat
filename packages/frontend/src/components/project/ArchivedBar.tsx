import cx from 'classnames'
import React from 'react'

import { ArchivedIcon } from '../icons/symbols/ArchivedIcon'

export interface ArchiveBarProps {
  text: string
  className?: string
}

export function ArchivedBar({ text, className }: ArchiveBarProps) {
  return (
    <div
      className={cx('bg-gray-750 flex justify-center rounded-lg', className)}
    >
      <span className="flex flex-row">
        <span className="flex items-center">
          <ArchivedIcon />
        </span>
        <span className="ml-2 text-base font-medium">{text}</span>
      </span>
    </div>
  )
}
