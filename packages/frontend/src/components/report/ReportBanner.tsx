import React from 'react'

export function ReportBanner() {
  return (
    <div className="mt-8 mb-10 flex max-h-fit flex-col overflow-hidden rounded-md bg-transparent from-gray-250 to-gray-450 md:my-12 md:grid md:grid-cols-2 md:bg-gradient-to-r">
      <div className="mx-0 my-8 flex flex-col justify-center md:mx-12">
        <div className="mb-2 font-medium text-gray-50 uppercase leading-5 md:text-[#4F4F4F] md:text-xl">
          Just Released
        </div>
        <div className="font-semibold text-2xl text-black leading-tight dark:text-white md:dark:text-black md:text-5xl md:text-black">
          Upgradeability of Ethereum L2s
        </div>
      </div>
      <img
        src="/images/announcements/multisig-report.png"
        className="h-full max-h-[320px] rounded-md md:rounded-none"
      />
    </div>
  )
}
