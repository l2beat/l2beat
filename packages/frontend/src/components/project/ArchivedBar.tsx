import React from 'react'

import { ArchivedIcon } from '../icons/symbols/ArchivedIcon'

export interface ArchiveBarProps {
  text: string
}

export function ArchivedBar({ text }: ArchiveBarProps) {
  return (
    <div className="mb-6 flex justify-center rounded-lg bg-gray-800 py-2.5">
      <span className="flex flex-row">
        <span className="flex items-center">
          <ArchivedIcon />
        </span>
        <span className="ml-2 text-base font-medium text-white">{text}</span>
      </span>
    </div>
  )
}
