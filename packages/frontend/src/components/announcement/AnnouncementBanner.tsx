import cx from 'classnames'
import React from 'react'

import { Logo } from '../Logo'
import { PolygonLogo } from './logos/AnnouncementLogos'

export function FullAnnouncementBanner() {
  return (
    <div className="my-20 flex max-h-fit flex-col-reverse overflow-hidden rounded-md bg-gray-100 dark:bg-zinc-800 md:grid md:grid-cols-2">
      <div
        className={cx('flex', 'flex-col', 'justify-center', 'm-6', 'md:m-10')}
      >
        <div className={cx('flex', 'space-x-4', 'mb-5 md:mb-8')}>
          <Logo className="h-[26px] w-[64px]" />
          <PolygonLogo />
        </div>

        <div className="dark:text-gray-5 mb-1 uppercase text-gray-550">
          Just Released
        </div>

        <div className="mb-4 text-2xl font-semibold leading-tight tracking-normal text-black dark:text-white sm:text-4xl md:mb-7">
          Upgradeability <br /> of Ethereum L2s
        </div>
        <a
          href="/multisig-report"
          className="w-full rounded-md bg-pink-900 py-3.5 text-center font-medium text-white md:w-40"
        >
          Read now
        </a>
      </div>
      <img
        className={cx('h-full')}
        src="/images/announcements/multisig-report.png"
      />
    </div>
  )
}

export function LimitedAnnouncementBanner() {
  return (
    <div
      className={cx(
        'flex',
        'flex-col',
        'md:grid',
        'md:grid-cols-2',
        'rounded-md',
        'my-12',
        'overflow-hidden',
        'max-h-fit',
        'bg-transparent from-gray-250 to-gray-450 md:bg-gradient-to-r',
      )}
    >
      <div
        className={cx(
          'flex',
          'flex-col',
          'justify-center',
          'mx-0',
          'my-8',
          'md:mx-12',
        )}
      >
        <div className="text-gray-5 mb-2 uppercase md:text-xl md:text-black">
          Just Released
        </div>
        <div className="tracking-norm text-2xl font-semibold leading-tight text-black dark:text-white md:text-5xl md:text-black md:dark:text-black">
          Upgradeability of Ethereum L2s
        </div>
      </div>
      <img
        src="/images/announcements/multisig-report.png"
        className="h-full rounded-md md:rounded-none"
      />
    </div>
  )
}
