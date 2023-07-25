import React from 'react'

import { CloseIcon } from '../icons/CloseIcon'

export function ReportFloatingBanner() {
  return (
    <div className="ReportFloatingBanner fixed bottom-0 left-0 z-110 m-4 flex max-w-[435px] overflow-hidden rounded-md bg-gray-100 dark:bg-zinc-800">
      <Close />
      <div className="flex max-w-[182px] bg-purple-50 py-2 px-3 md:px-5 md:py-4">
        <img src={'/images/announcements/multisig-cover.png'} />
      </div>
      <div className="flex flex-col justify-center px-4 pl-5">
        <div className="mb-2 text-xs font-medium uppercase text-gray-550 dark:text-gray-50 md:text-sm">
          Just Released
        </div>
        <div className="mb-5 text-xl font-semibold leading-tight tracking-normal text-black dark:text-white md:text-2xl">
          Upgradeability of Ethereum L2s
        </div>
        <a
          className="w-full max-w-[135px] rounded-md bg-pink-900 py-[8px] text-center text-base font-medium text-white transition-colors hover:bg-pink-800 md:w-40"
          href="/multisig-report"
        >
          Read now
        </a>
      </div>
    </div>
  )
}

function Close() {
  return (
    <div className="ReportFloatingBanner-Close absolute top-0 right-0 mt-4 mr-4 cursor-pointer">
      <CloseIcon className="fill-gray-550 dark:fill-gray-50" />
    </div>
  )
}
