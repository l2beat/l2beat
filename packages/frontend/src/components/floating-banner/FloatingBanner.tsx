import cx from 'classnames'
import React from 'react'

import { AnnouncementButtonLink } from '../announcement/AnnouncementButtonLink'
import { FloatingBannerCross } from './FloatingBannerCross'

export function FloatingBanner() {
  return (
    <div
      className={cx(
        'FloatingBanner',
        'rounded-md',
        'overflow-hidden',
        'fixed',
        'flex',
        'bottom-0',
        'left-0',
        'max-w-[435px]',
        'm-4',
        'bg-gray-100',
        'dark:bg-zinc-800',
        'z-110',
      )}
    >
      <FloatingBannerCross />
      <div
        className={cx(
          'bg-purple-50',
          'py-2',
          'px-3',
          'md:px-5',
          'md:py-4',
          'flex',
          'max-w-[182px]',
        )}
      >
        <img src={'/images/announcements/multisig-cover.png'} />
      </div>
      <div className={cx('flex', 'flex-col', 'px-4', 'pl-5', 'justify-center')}>
        <div className="mb-2 text-xs font-medium uppercase text-gray-550 dark:text-gray-50 md:text-sm">
          Just Released
        </div>
        <div className="mb-5 text-xl font-semibold leading-tight tracking-normal text-black dark:text-white md:text-2xl">
          Upgradeability of Ethereum L2s
        </div>
        <AnnouncementButtonLink
          className={cx('py-[8px]', 'max-w-[135px]', 'text-base')}
          href="/multisig-report"
        >
          Read now
        </AnnouncementButtonLink>
      </div>
    </div>
  )
}
