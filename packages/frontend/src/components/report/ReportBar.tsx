import React from 'react'

import { ArrowRightIcon } from '../icons'

export function ReportBar() {
  return (
    <a
      className="flex flex-col items-center justify-center space-x-5 bg-indigo-500 p-2 text-center text-xs font-bold text-white dark:bg-indigo-500 md:flex-row md:text-sm"
      href="https://warsaw.l2beat.com"
    >
      <p>Join us at L2Warsaw</p>
      <ArrowRightIcon className="ml-1 inline-block fill-current" />
      <span>
        <span className="underline decoration-solid underline-offset-2">
          warsaw.l2beat.com
        </span>
      </span>
    </a>
  )
}
