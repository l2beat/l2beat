import React from 'react'

import { ArrowRightIcon } from '../icons'

export function ReportBar() {
  return (
    <div className="flex flex-col items-center justify-center space-x-5 bg-indigo-500 p-2 text-center text-white dark:bg-indigo-500 md:flex-row">
      <p>Just released ⸱ Upgradeability of Ethereum L2s</p>
      <a href="/multisig-report">
        <span className="underline decoration-solid underline-offset-2">
          Download now
        </span>
        <ArrowRightIcon className="ml-1 inline-block fill-current" />
      </a>
    </div>
  )
}
