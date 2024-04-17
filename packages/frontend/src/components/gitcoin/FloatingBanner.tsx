import React from 'react'

import { LONG_HYPHEN } from '../../utils/constants'
import { CloseIcon } from '../icons/CloseIcon'

export function FloatingBanner() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-110 m-4 hidden max-h-[178px] overflow-hidden rounded-md bg-gray-200 shadow-lg data-[state=visible]:flex dark:bg-zinc-800 xs:right-[unset] xs:m-6 sm:max-h-[201px]"
      data-role="floating-banner"
    >
      <Close />
      <img
        src="/images/announcements/gitcoin-20-floating.png"
        className="max-w-[140px] sm:max-w-[158px]"
      />
      <div className="flex w-full flex-col justify-center px-4 pb-8 pt-9 xs:px-7 sm:px-11">
        <div className="text-xs font-semibold uppercase text-pink-900 dark:text-pink-200 sm:text-base">
          Support us
        </div>
        <div className="text-xl font-extrabold tracking-normal sm:text-2xl">
          Gitcoin Grants 20
        </div>
        <div className="mb-3 text-xs font-bold">
          April 23 {LONG_HYPHEN} May 7, 2024
        </div>
        <a
          className="w-full rounded-md bg-pink-900 py-[8px] text-center text-base font-bold text-white transition-all hover:bg-pink-800 dark:bg-pink-200 dark:text-black dark:hover:bg-pink-200/90"
          href="https://explorer.gitcoin.co/#/round/137/0xa1d52f9b5339792651861329a046dd912761e9a9/0xa1d52f9b5339792651861329a046dd912761e9a9-15"
          target="_blank"
        >
          Donate here
        </a>
      </div>
    </div>
  )
}

function Close() {
  return (
    <div
      className="group absolute right-0 top-0 cursor-pointer p-4"
      data-role="floating-banner-close"
    >
      <CloseIcon className="fill-gray-550 transition-all group-hover:fill-gray-700 dark:group-hover:fill-gray-400" />
    </div>
  )
}
