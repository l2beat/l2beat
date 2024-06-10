import React from 'react'

import { EM_DASH } from '../../utils/constants'
import { CloseIcon } from '../icons/CloseIcon'

export function FloatingBanner() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-110 m-4 hidden max-h-[178px] overflow-hidden rounded-md bg-gray-200 shadow-lg xs:right-[unset] xs:m-6 data-[state=visible]:flex sm:max-h-[201px] dark:bg-zinc-800"
      data-role="floating-banner"
    >
      <Close />
      <img
        src="/images/announcements/gitcoin-20-floating.png"
        className="max-w-[140px] sm:max-w-[158px]"
      />
      <div className="flex w-full flex-col justify-center px-4 pt-9 pb-8 sm:px-11 xs:px-7">
        <div className="font-semibold text-pink-900 text-xs uppercase dark:text-pink-200 sm:text-base">
          Support us
        </div>
        <div className="font-extrabold text-xl tracking-normal sm:text-2xl">
          Gitcoin Grants 20
        </div>
        <div className="mb-3 font-bold text-xs">
          April 23 {EM_DASH} May 7, 2024
        </div>
        <a
          className="w-full rounded-md bg-pink-900 py-[8px] text-center font-bold text-base text-white transition-all dark:bg-pink-200 dark:hover:bg-pink-200/90 hover:bg-pink-800 dark:text-black"
          href="https://explorer.gitcoin.co/#/round/42161/26/66"
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
      className="group absolute top-0 right-0 cursor-pointer p-4"
      data-role="floating-banner-close"
    >
      <CloseIcon className="fill-gray-550 transition-all dark:group-hover:fill-gray-400 group-hover:fill-gray-700" />
    </div>
  )
}
