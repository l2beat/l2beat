import React from 'react'

import { CloseIcon } from '../icons/CloseIcon'

export function FloatingBanner() {
  return (
    <div className="FloatingBanner fixed inset-x-0 bottom-0 z-110 m-4 hidden max-h-[223px] overflow-hidden rounded-md bg-gray-200 shadow-lg data-[state=visible]:flex dark:bg-zinc-800 xs:right-[unset] xs:m-6">
      <Close />
      <img
        src="/images/announcements/l2-days-floating.png"
        className="max-w-[158px]"
      />
      <div className="flex w-full flex-col justify-center px-7 pb-5 pt-9 md:px-11 ">
        <div className="mb-2 text-2xs font-medium uppercase leading-none text-gray-550 xs:text-base">
          Upcoming event
        </div>
        <div className="text-2xl font-extrabold leading-none tracking-normal text-black dark:text-white">
          L2DAYS
        </div>
        <div className="mb-7 font-extrabold xs:text-xl">at Devconnect</div>
        <a
          className="w-full max-w-[142px] rounded-md bg-[#DE4A2A] py-[8px] text-center text-base font-medium text-white transition-colors hover:bg-[#ba371b] md:w-40"
          href="https://l2days.xyz/"
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
      <CloseIcon className="fill-gray-550" />
    </div>
  )
}
