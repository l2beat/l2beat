import React from 'react'

import { CloseIcon } from '../icons/CloseIcon'

export function FloatingBanner() {
  return (
    <div className="FloatingBanner fixed inset-x-0 bottom-0 z-110 m-4 hidden max-h-[223px] overflow-hidden rounded-md bg-gray-200 shadow-lg data-[state=visible]:flex dark:bg-zinc-800 xs:right-[unset] xs:m-6">
      <Close />
      <img
        src="/images/announcements/gitcoin-19-floating.png"
        className="max-w-[158px]"
      />
      <div className="flex w-full flex-col justify-center px-7 pb-5 pt-9 md:px-11 ">
        <div className="mb-1.5   text-2xs font-medium uppercase leading-none text-gray-550 xs:text-base">
          Support us
        </div>
        <div className="mb-1 text-2xl font-extrabold leading-none tracking-normal text-black dark:text-white">
          Gitcoin Grants 19
        </div>
        <div className="mb-7 font-extrabold xs:text-sm">
          November 15-29, 2023
        </div>
        <a
          className="w-full max-w-[142px] rounded-md bg-[#008B84] py-[8px] text-center text-base font-medium text-white transition-colors hover:bg-opacity-60 md:w-40"
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
    <div className="FloatingBanner-Close absolute top-0 right-0 cursor-pointer p-4">
      <CloseIcon className="fill-gray-550" />
    </div>
  )
}
