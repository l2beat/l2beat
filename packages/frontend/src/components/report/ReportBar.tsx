import React from 'react'

import { ArrowRightIcon } from '../icons'

export function ReportBar() {
  return (
    <a
      className="flex flex-col items-center justify-center space-x-5 bg-[#2C7265] p-2 text-center text-xs font-bold text-white dark:bg-[#487A85] md:flex-row md:text-sm"
      href="https://warsaw.l2beat.com"
      target="_blank"
    >
      <p>Join us at L2Warsaw</p>
      <ArrowRightIcon className="invisible ml-1 inline-block fill-current md:visible" />
      <span>
        <span className="underline decoration-solid underline-offset-2">
          warsaw.l2beat.com
        </span>
      </span>
    </a>
  )
}
