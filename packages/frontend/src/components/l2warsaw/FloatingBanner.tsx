import React from 'react'

import { CloseIcon } from '../icons/CloseIcon'

export function FloatingBanner() {
  return (
    <div className="FloatingBanner fixed inset-x-0 bottom-0 z-110 m-4 hidden max-h-[178px] overflow-hidden rounded-md bg-gray-200 shadow-lg data-[state=visible]:flex dark:bg-zinc-800 xs:right-[unset] xs:m-6 sm:max-h-[201px]">
      <Close />
      <img
        src="/images/announcements/gitcoin-19-floating.png"
        className="max-w-[140px] sm:max-w-[158px]"
      />
      <div className="flex w-full flex-col  justify-center px-4 pb-5 pt-9 xs:px-7 sm:px-11">
        <div className="text-2xs font-medium uppercase  text-gray-550 sm:text-base">
          Support us
        </div>
        <div className="text-lg font-extrabold  tracking-normal sm:text-2xl">
          Gitcoin Grants 19
        </div>
        <div className="mb-7 text-sm font-extrabold">November 15-29, 2023</div>
        <a
          className="w-full max-w-[142px] rounded-md bg-[#008B84] py-[8px] text-center text-base font-medium text-white transition-all hover:bg-opacity-60 md:w-40"
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
    <div className="FloatingBanner-Close group absolute top-0 right-0 cursor-pointer p-4">
      <CloseIcon className="fill-gray-550 transition-all group-hover:fill-gray-700 dark:group-hover:fill-gray-400" />
    </div>
  )
}
