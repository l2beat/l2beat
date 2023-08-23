import React from 'react'

import { CloseIcon } from '../icons/CloseIcon'

export function FloatingBanner() {
  return (
    <div className="FloatingBanner fixed bottom-0 left-0 z-110 m-4 flex overflow-hidden rounded-md bg-gray-100 pr-4 dark:bg-zinc-800">
      <Close />
      <div className="flex max-w-[182px] bg-[#2C7265] py-2 px-3 md:px-5 md:py-4">
        <img src={'/images/announcements/l2-warsaw-floating.png'} />
      </div>
      <div className="flex max-w-[300px] flex-col justify-center px-3 sm:pr-5">
        <div className="mb-2 text-xs font-medium uppercase text-gray-550 dark:text-gray-50 md:text-sm">
          Upcoming event
        </div>
        <div className="text-xl font-semibold leading-tight tracking-normal text-black dark:text-white md:text-2xl">
          L2Warsaw
        </div>
        <div className="mb-4 text-xs sm:text-base">
          Technical conference dedicated to Ethereum L2 scaling
        </div>
        <a
          className="w-full max-w-[135px] rounded-md bg-pink-900 py-[8px] text-center text-base font-medium text-white transition-colors hover:bg-pink-800 md:w-40"
          href="https://warsaw.l2beat.com"
          target="_blank"
        >
          Get tickets
        </a>
      </div>
    </div>
  )
}

function Close() {
  return (
    <div className="FloatingBanner-Close absolute top-0 right-0 mt-4 mr-4 cursor-pointer">
      <CloseIcon className="fill-gray-550 dark:fill-gray-50" />
    </div>
  )
}
