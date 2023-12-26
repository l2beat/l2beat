import React from 'react'

import { Logo } from '../Logo'
import { PolygonLogo } from './PolygonLogo'

export function ReportBannerWithButton() {
  return (
    <div className="my-20 flex max-h-fit flex-col-reverse overflow-hidden rounded-md bg-gray-100 dark:bg-zinc-800 md:grid md:grid-cols-2">
      <div className="m-6 flex flex-col justify-center md:m-10">
        <div className="mb-5 flex space-x-4 md:mb-8">
          <Logo className="h-[26px] w-[64px]" />
          <PolygonLogo />
        </div>

        <div className="dark:text-gray-5 mb-1 text-sm uppercase text-gray-550">
          Just Released
        </div>

        <div className="mb-4 text-2xl font-semibold leading-tight tracking-normal text-black dark:text-white sm:text-4xl md:mb-7">
          Upgradeability <br /> of Ethereum L2s
        </div>
        <a
          href="/multisig-report"
          className="w-full rounded-md bg-pink-900 py-3.5 text-center font-medium text-white transition-colors hover:bg-pink-800 md:w-40"
        >
          Read now
        </a>
      </div>
      <img
        className="h-full max-h-[420px]"
        src="/images/announcements/multisig-report.png"
      />
    </div>
  )
}
