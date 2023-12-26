import React from 'react'

export function ReportBanner() {
  return (
    <div className="mt-8 mb-10 flex max-h-fit flex-col overflow-hidden rounded-md bg-transparent from-gray-250 to-gray-450 md:my-12 md:grid md:grid-cols-2 md:bg-gradient-to-r">
      <div className="mx-0 my-8 flex flex-col justify-center md:mx-12">
        <div className="text-gray-5 mb-2 font-medium uppercase leading-5 md:text-xl md:text-[#4F4F4F]">
          Just Released
        </div>
        <div className="tracking-norm text-2xl font-semibold leading-tight text-black dark:text-white md:text-5xl md:text-black md:dark:text-black">
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
