import React from 'react'

import { ArrowRightIcon } from '../icons'

export function TopBar() {
  return (
    <a
      className="flex flex-col items-center justify-center bg-[#2C7265] p-2 text-center text-xs font-bold text-white md:flex-row md:space-x-5 md:text-sm"
      href="https://warsaw.l2beat.com"
      target="_blank"
    >
      <p>Join us for L2Warsaw on August 30th! </p>
      <span>
        <span className="underline decoration-solid underline-offset-2">
          warsaw.l2beat.com
        </span>
        <ArrowRightIcon className="ml-1 inline-block fill-current" />
      </span>
    </a>
  )
}
