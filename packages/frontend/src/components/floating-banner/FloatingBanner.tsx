import cx from 'classnames'
import React from 'react'

import { AnnouncementButtonLink } from '../announcement/AnnouncementButtonLink'
import { AnnouncementImage } from '../announcement/AnnouncementImage'
import { AnnouncementNotation } from '../announcement/AnnouncementNotation'
import { AnnouncementTitle } from '../announcement/AnnouncementTitle'
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
        <AnnouncementImage src={'/images/announcements/multisig-cover.png'} />
      </div>
      <div className={cx('flex', 'flex-col', 'px-4', 'pl-5', 'justify-center')}>
        <AnnouncementNotation
          className={cx(
            'text-gray-550',
            'dark:text-gray-50',
            'text-xs',
            'md:text-sm',
            'font-medium',
            'mb-2',
          )}
        >
          Just Released
        </AnnouncementNotation>
        <AnnouncementTitle
          className={cx(
            'text-black',
            'dark:text-white',
            'text-xl',
            'md:text-2xl',
            'mb-5',
          )}
        >
          Upgradeability of Ethereum L2s
        </AnnouncementTitle>
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
