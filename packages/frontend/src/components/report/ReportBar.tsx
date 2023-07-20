import React from 'react'

import { ArrowRightIcon } from '../icons'

export function ReportBar() {
  return (
    <a
      className="flex flex-col items-center justify-center space-x-5 bg-indigo-500 p-2 text-center text-xs font-bold text-white dark:bg-indigo-500 md:flex-row md:text-sm"
      href="/multisig-report"
    >
      <p>Just released ⸱ Upgradeability of Ethereum L2s</p>
      <span>
        <span className="underline decoration-solid underline-offset-2">
          Download now
        </span>
        <ArrowRightIcon className="ml-1 inline-block fill-current" />
      </span>
    </a>
  )
}
